import type Listener from "../Listener";
import InvalidAmountError from "./InvalidAmountError";
import InsufficientBadCodeError from "./InsufficientBadCodeError";
import { assert } from "../../assertion";
import Upgrade from "../Upgrade/Upgrade";
import db from "../connection";
import Building from "../Building/Building";

/**
 * Represents the player state in the game.
 * Manages resources, upgrades, buildings, and persistence.
 */
export default class Player {
  #name: string; // player's username
  #badCode: number; // total accumulated resource
  #clickPower: number; // amount gained per click
  #listeners: Array<Listener>; // observers for UI updates
  #productionPerSecond: number; // passive generation rate
  #upgrades: Upgrade[];
  #buildings: Building[];

  /**
   * Ensures internal state remains valid.
   */
  #checkInvariants(): void {
    assert(
      this.#badCode >= 0,
      "Bad Code must always be greater than or equal to 0",
    );
    assert(
      this.#clickPower >= 1,
      "Click Power must always be greater than or equal to 1",
    );
  }

  /**
   * Creates a new player with default values.
   */
  private constructor(name: string) {
    // Initialised through the create public function
    this.#name = name;
    this.#badCode = 0;
    this.#clickPower = 1;
    this.#listeners = [];
    this.#upgrades = [];
    this.#buildings = [];

    this.#productionPerSecond = 0;

    this.#checkInvariants();
  }

  /**
   * Creates a new Player and initializes all upgrade and building types
   * from the database.
   *
   * @param name the username of the player
   * @returns a fully initialized promise of a Player with upgrades and buildings loaded
   */
  public static async create(name: string): Promise<Player> {
    const player = new Player(name);

    await player.loadUpgrade();
    await player.loadBuilding();

    return player;
  }

  /**
   * Loads all upgrade types from the database and creates corresponding
   * upgrade objects for this player.
   */
  public async loadUpgrade(): Promise<void> {
    const results = await db().query<{
      name: string;
      basecost: number;
      clickpowerincrease: number;
    }>(`select * from upgrade_type`);
    const upgrades = [];
    for (const row of results.rows) {
      upgrades.push(
        new Upgrade(row.name, row.basecost, row.clickpowerincrease),
      );
    }
    this.#upgrades = upgrades;
  }

  /**
   * Loads all building types from the database and creates corresponding
   * building objects for this player.
   */
  public async loadBuilding(): Promise<void> {
    const results = await db().query<{
      name: string;
      basecost: number;
      productionpersecond: number;
    }>(
      `select 
        * from building_type
      `,
    );
    const buildings = [];
    for (const row of results.rows) {
      buildings.push(
        new Building(row.name, row.basecost, row.productionpersecond),
      );
    }
    this.#buildings = buildings;
  }

  /**
   * Saves player, upgrades, and buildings to database.
   */
  public async saveAll(): Promise<void> {
    await Player.savePlayer(this);
    for (const myUpgrade of this.#upgrades) {
      await Player.savePlayerUpgrade(this, myUpgrade);
    }
    for (const myBuilding of this.#buildings) {
      await Player.savePlayerBuilding(this, myBuilding);
    }
  }

  /**
   * Saves building quantity for a player.
   */
  public static async savePlayerBuilding(
    player: Player,
    building: Building,
  ): Promise<void> {
    await db().query(
      `insert into player_building(player_name, building_name, quantity)
       values ($1, $2, $3)
       on conflict (player_name, building_name) do update set
         quantity = excluded.quantity`,
      [player.name, building.buildingName, building.buildingCount],
    );
  }

  /**
   * Saves core player stats.
   */
  public static async savePlayer(player: Player): Promise<Player> {
    const results = await db().query<{ username: string }>(
      `insert into player(username, badCode, clickPower, productionPerSecond)
       values ($1, $2, $3, $4)
       on conflict (username) do update set
         badCode = excluded.badCode,
         clickPower = excluded.clickPower,
         productionPerSecond = excluded.productionPerSecond
       returning username`,
      [
        player.name,
        player.badCode,
        player.clickPower,
        player.productionPerSecond,
      ],
    );

    player.name = results.rows[0].username;
    return player;
  }

  /**
   * Saves upgrade count for a player.
   */
  public static async savePlayerUpgrade(
    player: Player,
    upgrade: Upgrade,
  ): Promise<void> {
    await db().query(
      `insert into player_upgrade(username, upgrade_name, quantity)
       values ($1, $2, $3)
       on conflict (username, upgrade_name) do update set
         quantity = excluded.quantity`,
      [player.name, upgrade.upgradeName, upgrade.upgradeCount],
    );
  }

  /**
   * Loads core player values.
   */
  public loadData(
    badCode: number,
    clickPower: number,
    productionPerSecond: number,
  ): void {
    this.#badCode = badCode;
    this.#clickPower = clickPower;
    this.#productionPerSecond = productionPerSecond;
  }

  /**
   * Loads a player and all related data from database.
   */
  public static async loadPlayer(username: string): Promise<Player | null> {
    let player = null;
    let flag = true;
    const results = await db().query<{
      username: string;
      badcode: number;
      clickpower: number;
      productionpersecond: number;
    }>(
      `select 
        username,
        badCode as badcode,
        clickPower as clickpower,
        productionPerSecond as productionpersecond
       from player
       where username = $1`,
      [username],
    );

    if (results.rows.length === 0) {
      flag = false;
    }
    if (flag) {
      const row = results.rows[0];
      player = new Player(row.username);

      player.loadData(row.badcode, row.clickpower, row.productionpersecond);
      await player.loadUpgrade();
      await player.loadBuilding();
      await player.loadUpgradeCounts(); // restore upgrades
      await player.loadBuildingCounts(); // restore buildings
    }

    return player;
  }

  /**
   * Loads upgrade quantities from database.
   */
  public async loadUpgradeCounts(): Promise<void> {
    const results = await db().query<{
      upgrade_name: string;
      quantity: number;
    }>(
      `select upgrade_name, quantity
       from player_upgrade
       where username = $1`,
      [this.name],
    );
    for (const row of results.rows) {
      let i = 0;
      while (
        i < this.#upgrades.length &&
        this.#upgrades[i].upgradeName !== row.upgrade_name
      ) {
        i++;
      }
      if (i < this.#upgrades.length) {
        this.#upgrades[i].loadCount(row.quantity);
      }
    }
  }

  /**
   * Loads building quantities from database.
   */
  public async loadBuildingCounts(): Promise<void> {
    const results = await db().query<{
      building_name: string;
      quantity: number;
    }>(
      `select building_name, quantity
       from player_building
       where player_name = $1`,
      [this.name],
    );

    for (const row of results.rows) {
      let i = 0;
      while (
        i < this.#buildings.length &&
        this.#buildings[i].buildingName !== row.building_name
      ) {
        i++;
      }
      if (i < this.#buildings.length) {
        this.#buildings[i].loadCount(row.quantity);
      }
    }
  }

  get productionPerSecond(): number {
    return this.#productionPerSecond;
  }

  get buildingsList(): Building[] {
    return this.#buildings;
  }

  get upgradesList(): Upgrade[] {
    return this.#upgrades;
  }

  get name(): string {
    return this.#name;
  }

  set name(name: string) {
    this.#name = name;
  }

  get badCode(): number {
    return this.#badCode;
  }

  get clickPower(): number {
    return this.#clickPower;
  }

  /**
   * Purchases mentioned upgrade.
   */
  public purchaseUpgrade(name: string): void {
    for (const myUpgrade of this.#upgrades) {
      if (name == myUpgrade.upgradeName) {
        this.purchaseUpgradeHelper(myUpgrade);
      }
    }
    this.#notifyAll();
  }

  /**
   * Purchases a building and increases passive production.
   */
  public purchaseBuilding(name: string): void {
    for (const myBuilding of this.#buildings) {
      if (name == myBuilding.buildingName) {
        this.purchaseBuildingHelper(myBuilding);
      }
    }
    this.#notifyAll();
  }

  /**
   * Purchases an upgrade and applies its effect.
   */
  public purchaseUpgradeHelper(upgrade: Upgrade): void {
    this.#checkInvariants();

    this.spend(upgrade.costValue); // deduct cost
    this.#apply(upgrade); // apply effect
    upgrade.increaseCount(); // increment count

    this.#checkInvariants();
  }

  /**
   * Purchases a building and applies its effect.
   */
  public purchaseBuildingHelper(building: Building): void {
    this.#checkInvariants();

    this.spend(building.costValue);
    building.increaseCount();
    this.increaseProductionPerSecond(building.productionValue);

    this.#checkInvariants();
  }

  /**
   * Applies upgrade effect.
   */
  #apply(upgrade: Upgrade): void {
    this.increaseClickPower(upgrade.clickPowerIncreaseValue);
  }

  /**
   * Handles manual click.
   */
  public increment(): void {
    this.#badCode += this.#clickPower; // gain from click
    this.#notifyAll();
  }

  /**
   * Increases passive production rate.
   */
  public increaseProductionPerSecond(amount: number): void {
    if (amount < 0) throw new InvalidAmountError();

    this.#productionPerSecond += amount;
    this.#notifyAll();
  }

  /**
   * Deducts bad code if sufficient balance exists.
   */
  public spend(amount: number): void {
    if (amount < 0) throw new InvalidAmountError();
    if (amount > this.#badCode) throw new InsufficientBadCodeError();

    this.#badCode -= amount;
    this.#notifyAll();
  }

  /**
   * Generates passive bad code over time.
   */
  public produceBadCode(): void {
    this.#badCode += this.#productionPerSecond;
    this.#notifyAll();
  }

  /**
   * Increases click power.
   */
  public increaseClickPower(amount: number): void {
    if (amount < 0) throw new InvalidAmountError();

    this.#clickPower += amount;
    this.#notifyAll();
  }

  /**
   * Registers a listener for updates.
   */
  public registerListener(listener: Listener): void {
    this.#listeners.push(listener);
  }

  /**
   * Notifies all listeners of changes.
   */
  #notifyAll(): void {
    this.#listeners.forEach((l) => l.notify());
  }
}

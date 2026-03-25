import type Listener from "../listener";
import InvalidAmountError from "./InvalidAmountError";
import InsufficientBadCodeError from "./InsufficientBadCodeError";
import { assert } from "../../assertion";
import Upgrade from "../Upgrade/Upgrade";
import AIFacilitatedChatBot from "../Upgrade/AIFacilitatedChatBot";
import VibeCodingIntern from "../Upgrade/VibeCodingIntern";
import db from "../connection";
import Building from "../Building/Building";
import DataCentre from "../Building/DataCentre";
import MemoryLeak from "../Building/MemoryLeak";

/**
 * Represents the player state in the game.
 * Manages resources, upgrades, buildings, and persistence.
 */
export default class Player {
  #name: string; // player's username
  #badCode: number; // total accumulated resource
  #clickPower: number; // amount gained per click
  #listeners: Array<Listener>; // observers for UI updates
  #AIBotUpgrade!: AIFacilitatedChatBot; // AI bot upgrade instance
  #InternUpgrade!: VibeCodingIntern; // intern upgrade instance
  #dataCentre!: DataCentre; // data centre building
  #memoryLeak!: MemoryLeak; // memory leak building
  #productionPerSecond: number; // passive generation rate

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
    this.#name = name;
    this.#badCode = 0;
    this.#clickPower = 1;
    this.#listeners = [];

    this.#productionPerSecond = 0;

    this.#checkInvariants();
  }

  public static async create(name: string): Promise<Player> {
    const player = new Player(name);

    await player.loadUpgrade();
    await player.loadBuilding();

    return player;
  }

  public async loadUpgrade(): Promise<void> {
    const results = await db().query<{
      name: string;
      basecost: number;
      clickpowerincrease: number;
    }>(
      `select 
        * from upgrade_type
      `,
    );

    for (const row of results.rows) {
      if (row.name === "AI-facilitated chatbot") {
        this.#AIBotUpgrade = new AIFacilitatedChatBot(
          row.name,
          row.basecost,
          row.clickpowerincrease,
        );
      } else if (row.name === "Vibe Coding Intern") {
        this.#InternUpgrade = new VibeCodingIntern(
          row.name,
          row.basecost,
          row.clickpowerincrease,
        );
      }
    }
  }

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

    for (const row of results.rows) {
      if (row.name === "Data Centre") {
        this.#dataCentre = new DataCentre(
          row.name,
          row.basecost,
          row.productionpersecond,
        );
      } else if (row.name === "Memory Leak") {
        this.#memoryLeak = new MemoryLeak(
          row.name,
          row.basecost,
          row.productionpersecond,
        );
      }
    }
  }

  /**
   * Saves player, upgrades, and buildings to database.
   */
  public async saveAll(): Promise<void> {
    await Player.savePlayer(this);
    await Player.savePlayerUpgrade(this, this.#AIBotUpgrade);
    await Player.savePlayerUpgrade(this, this.#InternUpgrade);
    await Player.savePlayerBuilding(this, this.#dataCentre);
    await Player.savePlayerBuilding(this, this.#memoryLeak);
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
      if (row.upgrade_name === this.AIBot.upgradeName) {
        this.AIBot.loadCount(row.quantity);
      } else if (row.upgrade_name === this.Intern.upgradeName) {
        this.Intern.loadCount(row.quantity);
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
      if (row.building_name === this.dataCentre.buildingName) {
        this.dataCentre.loadCount(row.quantity);
      } else if (row.building_name === this.memoryLeak.buildingName) {
        this.memoryLeak.loadCount(row.quantity);
      }
    }
  }

  get productionPerSecond(): number {
    return this.#productionPerSecond;
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

  get AIBot(): AIFacilitatedChatBot {
    return this.#AIBotUpgrade;
  }

  get Intern(): VibeCodingIntern {
    return this.#InternUpgrade;
  }

  get dataCentre(): DataCentre {
    return this.#dataCentre;
  }

  get memoryLeak(): MemoryLeak {
    return this.#memoryLeak;
  }

  /**
   * Purchases intern upgrade.
   */
  public purchaseInternUpgrade(): void {
    this.purchase(this.#InternUpgrade);
    this.#notifyAll();
  }

  /**
   * Purchases AI bot upgrade.
   */
  public purchaseBotUpgrade(): void {
    this.purchase(this.#AIBotUpgrade);
    this.#notifyAll();
  }

  /**
   * Purchases data centre building.
   */
  public purchaseDataCentre(): void {
    this.purchaseBuilding(this.#dataCentre);
    this.#notifyAll();
  }

  /**
   * Purchases memory leak building.
   */
  public purchaseMemoryLeak(): void {
    this.purchaseBuilding(this.#memoryLeak);
    this.#notifyAll();
  }

  /**
   * Purchases an upgrade and applies its effect.
   */
  public purchase(upgrade: Upgrade): void {
    this.#checkInvariants();

    this.spend(upgrade.costValue); // deduct cost
    this.#apply(upgrade); // apply effect
    upgrade.increaseCount(); // increment count

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
   * Purchases a building and increases passive production.
   */
  public purchaseBuilding(building: Building): void {
    this.spend(building.costValue);
    building.increaseCount();
    this.increaseProductionPerSecond(building.productionValue);
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

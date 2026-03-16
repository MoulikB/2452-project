import type Listener from "../listener";
import InvalidAmountError from "./InvalidAmountError";
import InsufficientBadCodeError from "./InsufficientBadCodeError";
import { assert } from "../../assertion";
import Upgrade from "../Upgrade/Upgrade";
import AIFacilitatedChatBot from "../Upgrade/AIFacilitatedChatBot";
import VibeCodingIntern from "../Upgrade/VibeCodingIntern";
import Account from "../../Account/Account.ts";
import db from "../connection.ts";

// Represents the player state in the game.
// Tracks accumulated bad code, click power, and notifies listeners on state changes.

export default class Player {
  #name: string;
  #badCode: number;
  #clickPower: number;
  #listeners: Array<Listener>;
  #AIBotUpgrade: AIFacilitatedChatBot;
  #InternUpgrade: VibeCodingIntern;
  #productionPerSecond: number;
  #account: Account;

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

  constructor(name: string, account: Account) {
    // Initial values and initialisation
    this.#name = name;
    this.#badCode = 0;
    this.#clickPower = 1;
    this.#listeners = [];
    this.#AIBotUpgrade = new AIFacilitatedChatBot();
    this.#InternUpgrade = new VibeCodingIntern();
    this.#productionPerSecond = 0;
    this.#account = account;
    this.#checkInvariants();
  }

  public async saveAll(): Promise<void> {
    await Player.savePlayer(this);
    await Player.savePlayerUpgrade(this, this.#AIBotUpgrade);
    await Player.savePlayerUpgrade(this, this.#InternUpgrade);
  }

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

    console.log(
      `Saved upgrade ${upgrade.upgradeName} for player ${player.name} with quantity ${upgrade.upgradeCount}`,
    );
  }

  public loadData(
    badCode: number,
    clickPower: number,
    productionPerSecond: number,
  ): void {
    this.#badCode = badCode;
    this.#clickPower = clickPower;
    this.#productionPerSecond = productionPerSecond;
  }

  public static async loadPlayer(
    username: string,
    account: Account,
  ): Promise<Player | null> {
    const results = await db().query<{
      username: string;
      badcode: number;
      clickpower: number;
      productionpersecond: number;
    }>(
      `select username, badCode, clickPower, productionPerSecond
     from player
     where username = $1`,
      [username],
    );

    if (results.rows.length === 0) {
      return null;
    }

    const row = results.rows[0];
    const player = new Player(row.username, account);
    player.loadData(row.badcode, row.clickpower, row.productionpersecond);

    await player.loadUpgradeCounts();

    return player;
  }

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

  public purchaseInternUpgrade(): void {
    this.purchase(this.#InternUpgrade);
    this.#notifyAll();
  }

  public purchaseBotUpgrade(): void {
    this.purchase(this.#AIBotUpgrade);
    this.#notifyAll();
  }

  // Purchases this upgrade for the given player.
  // Deducts cost, increments upgrade count, and applies the upgrade effect
  public purchase(upgrade: Upgrade): void {
    this.#checkInvariants();

    this.spend(upgrade.costValue); // Spend the total value needed to buy the upgrade. Also checks if we can afford the upgrade or not

    this.#apply(upgrade); // Apply the total increase it brings to our clickPower
    upgrade.increaseCount(); // Increment total upgrade count by one

    this.#checkInvariants();
  }

  // Applies the effect of the upgrade to the player and increases their click power
  #apply(upgrade: Upgrade): void {
    this.#checkInvariants();

    this.increaseClickPower(upgrade.clickPowerIncreaseValue);

    this.#checkInvariants();
  }

  // Increments total bad code by current click power
  public increment(): void {
    this.#checkInvariants();

    this.#badCode += this.#clickPower;

    this.#checkInvariants();
    this.#notifyAll();
  }

  // Check if we can spend the given amount to buy more upgrades
  public spend(amount: number): void {
    this.#checkInvariants();

    if (amount < 0) {
      throw new InvalidAmountError();
    }
    if (amount > this.#badCode) {
      throw new InsufficientBadCodeError();
    }

    this.#badCode -= amount;

    this.#checkInvariants();
    this.#notifyAll();
  }

  // Function used by upgrade class to increase click power for every purchase by a given amount
  public increaseClickPower(amount: number): void {
    this.#checkInvariants();

    if (amount < 0) {
      throw new InvalidAmountError();
    }
    this.#clickPower += amount;

    this.#checkInvariants();
    this.#notifyAll();
  }

  //Register given listener to the player
  public registerListener(listener: Listener): void {
    this.#listeners.push(listener);
  }

  //Notify all listeners for any changes made
  #notifyAll(): void {
    this.#listeners.forEach((l) => l.notify());
  }
}

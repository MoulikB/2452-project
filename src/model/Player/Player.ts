import type Listener from "../listener";
import InvalidAmountError from "./InvalidAmountError";
import InsufficientBadCodeError from "./InsufficientBadCodeError";
import { assert } from "../../assertion";
import Upgrade from "../Upgrade/Upgrade";
import AIFacilitatedChatBot from "../Upgrade/AIFacilitatedChatBot";
import VibeCodingIntern from "../Upgrade/VibeCodingIntern";

// Represents the player state in the game.
// Tracks accumulated bad code, click power, and notifies listeners on state changes.

export default class Player {
  #badCode: number;
  #clickPower: number;
  #listeners: Array<Listener>;
  #AIBotUpgrade: AIFacilitatedChatBot;
  #InternUpgrade: VibeCodingIntern;

  #checkInvariants() {
    assert(
      this.#badCode >= 0,
      "Bad Code must always be greater than or equal to 0",
    );
    assert(
      this.#clickPower >= 1,
      "Click Power must always be greater than or equal to 1",
    );
  }

  constructor() {
    // Initial values and initialisation
    this.#badCode = 0;
    this.#clickPower = 1;
    this.#listeners = [];
    this.#AIBotUpgrade = new AIFacilitatedChatBot();
    this.#InternUpgrade = new VibeCodingIntern();
    this.#checkInvariants();
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

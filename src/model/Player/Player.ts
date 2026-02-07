import type Listener from "../listener";
import InvalidAmountError from "./InvalidAmountError";
import InsufficientBadCodeError from "./InsufficientBadCodeError";
import { assert } from "../../assertion";

// Represents the player state in the game.
// Tracks accumulated bad code, click power, and notifies listeners on state changes.

export default class Player {
  #badCode: number;
  #clickPower: number;
  #listeners: Array<Listener>;

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
    this.#checkInvariants();
  }

  get badCode(): number {
    return this.#badCode;
  }

  get clickPower(): number {
    return this.#clickPower;
  }

  // Increments total bad code by current click power
  public increment() {
    this.#checkInvariants();

    this.#badCode += this.#clickPower;

    this.#checkInvariants();
    this.#notifyAll();
  }

  // Check if we can spend the given amount to buy more upgrades
  public spend(amount: number) {
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
  public increaseClickPower(amount: number) {
    this.#checkInvariants();

    if (amount < 0) {
      throw new InvalidAmountError();
    }
    this.#clickPower += amount;

    this.#checkInvariants();
    this.#notifyAll();
  }

  //Register given listener to the player
  public registerListener(listener: Listener) {
    this.#listeners.push(listener);
  }

  //Notify all listeners for any changes made
  #notifyAll() {
    this.#listeners.forEach((l) => l.notify());
  }
}

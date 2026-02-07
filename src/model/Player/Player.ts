import type Listener from "../listener";
import InvalidAmountError from "./InvalidAmountError";
import InsufficientBadCodeError from "./InsufficientBadCodeError";
import { assert } from "../../assertion";

export default class Player {
  #badCode: number;
  #clickPower: number;
  #listeners: Array<Listener>;

  constructor() {
    this.#badCode = 0;
    this.#clickPower = 1;
    this.#listeners = [];
    this.#checkInvariants();
  }

  get badCode() {
    return this.#badCode;
  }

  get clickPower() {
    return this.#clickPower;
  }

  increment() {
    this.#badCode += this.#clickPower;
    this.#checkInvariants();
    this.#notifyAll();
  }

  spend(amount: number) {
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

  increaseClickPower(amount: number) {
    this.#checkInvariants();
    if (amount < 0) {
      throw new InvalidAmountError();
    }
    this.#clickPower += amount;
    this.#checkInvariants();
    this.#notifyAll();
  }

  registerListener(listener: Listener) {
    this.#listeners.push(listener);
  }

  #notifyAll() {
    this.#listeners.forEach((l) => l.notify());
  }

  #checkInvariants() {
    assert(
      this.#badCode >= 0,
      "Bad Code must always be greather than or equal to 0",
    );
    assert(
      this.#clickPower >= 1,
      "Click Power must always be greater than or equal to 1",
    );
  }
}

import type Listener from "../Listener";
import BadCodeCountError from "./BadCodeCountError";
import { InvalidClickPowerError } from "./InvalidClickPowerError";
import InsufficientBadCodeError from "./InsufficientBadCodeError";

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
    if (amount > this.#badCode) {
      throw new InsufficientBadCodeError();
    }

    this.#badCode -= amount;
    this.#notifyAll();
  }

  increaseClickPower(amount: number) {
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
    if (this.#badCode < 0) {
      throw new BadCodeCountError();
    }
    if (this.#clickPower < 1) {
      throw new InvalidClickPowerError();
    }
  }
}

import { test, expect } from "vitest";
import Player from "../src/model/Player/Player";
import InvalidAmountError from "../src/model/Player/InvalidAmountError";
import InsufficientBadCodeError from "../src/model/Player/InsufficientBadCodeError";
import { InvalidClickPowerError } from "../src/model/Player/InvalidClickPowerError";
import BadCodeCountError from "../src/model/Player/BadCodeCountError";

test("player starts with valid initial state", () => {
  const p = new Player();

  expect(p.badCode).toBe(0);
  expect(p.clickPower).toBe(1);
});

// THE BELOW TESTS CANNOT DIRECTLY ACCESS PRIVATE METHODS/PROPERTIES SO THEY ARE COMMENTED
// OUT FOR FUTURE REFERENCE IF ANY REFACTORING ALLOWS IT

// test("badCode invariant throws InvalidClickPowerError if violated", () => {
//   const p = new Player();
//   expect(() => {
//     p.#clickPower = -10; // force violation
//     p.#checkInvariants();
//   }).toThrow(InvalidClickPowerError);
// });

// test("badCode invariant throws BadCodeCountError if violated", () => {
//   const p = new Player();
//   expect(() => {
//     p.#badCode = -5; // force violation
//     p.#checkInvariants();
//   }).toThrow(BadCodeCountError);
// });

test("increment increases badCode by 1 at default click power", () => {
  const p = new Player();
  p.increment();
  expect(p.badCode).toBe(1);
});

test("increment uses current click power", () => {
  const p = new Player();
  p.increaseClickPower(4);
  p.increment();
  expect(p.badCode).toBe(5);
});

test("spend decreases bad code by amount", () => {
  const p = new Player();
  p.increaseClickPower(4);
  p.increment(); // badCode = 5
  p.spend(3);
  expect(p.badCode).toBe(2);
});

test("click power invariant throws InvalidAmountError if violated", () => {
  const p = new Player();

  expect(() => {
    // force violation indirectly
    p.increaseClickPower(-100);
  }).toThrow(InvalidAmountError);
});

test("spend throws InsufficientBadCodeError if amount > badCode", () => {
  const p = new Player();
  p.increment(); // badCode = 1
  expect(() => p.spend(2)).toThrow(InsufficientBadCodeError);
});

test("spend throws InvalidAmountError if amount is negative", () => {
  const p = new Player();
  expect(() => p.spend(-1)).toThrow(InvalidAmountError);
});

test("increaseClickPower increases click power by amount", () => {
  const p = new Player();
  p.increaseClickPower(4);
  expect(p.clickPower).toBe(5);
});

test("listeners are notified on state change", () => {
  const p = new Player();

  let called = false;

  p.registerListener({
    notify() {
      called = true;
    },
  });

  p.increment();

  expect(called).toBe(true);
});

test("click power cannot be increased by negative amount", () => {
  const p = new Player();

  expect(() => {
    p.increaseClickPower(-1);
  }).toThrow(InvalidAmountError);
});

test("badCode never becomes negative", () => {
  const p = new Player();

  expect(() => {
    p.spend(1);
  }).toThrow(InsufficientBadCodeError);
});

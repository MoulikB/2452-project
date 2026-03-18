import { test, expect } from "vitest";
import Player from "../src/model/Player/Player";
import InvalidAmountError from "../src/model/Player/InvalidAmountError";
import InsufficientBadCodeError from "../src/model/Player/InsufficientBadCodeError";
import Account from "../src/Account/Account";

test("player starts with valid initial state", () => {
  const p = new Account("test", "test").player;

  expect(p.badCode).toBe(0);
  expect(p.clickPower).toBe(1);
});

test("increment increases badCode by 1 at default click power", () => {
  const p = new Account("test", "test").player;
  p.increment();
  expect(p.badCode).toBe(1);
});

test("increment uses current click power", () => {
  const p = new Account("test", "test").player;
  p.increaseClickPower(4);
  p.increment();
  expect(p.badCode).toBe(5);
});

test("spend decreases bad code by amount", () => {
  const p = new Account("test", "test").player;
  p.increaseClickPower(4);
  p.increment(); // badCode = 5
  p.spend(3);
  expect(p.badCode).toBe(2);
});

test("click power invariant throws InvalidAmountError if violated", () => {
  const p = new Account("test", "test").player;

  expect(() => {
    // force violation indirectly
    p.increaseClickPower(-100);
  }).toThrow(InvalidAmountError);
});

test("spend throws InsufficientBadCodeError if amount > badCode", () => {
  const p = new Account("test", "test").player;
  p.increment(); // badCode = 1
  expect(() => p.spend(2)).toThrow(InsufficientBadCodeError);
});

test("spend throws InvalidAmountError if amount is negative", () => {
  const p = new Account("test", "test").player;
  expect(() => p.spend(-1)).toThrow(InvalidAmountError);
});

test("increaseClickPower increases click power by amount", () => {
  const p = new Account("test", "test").player;
  p.increaseClickPower(4);
  expect(p.clickPower).toBe(5);
});

test("listeners are notified on state change", () => {
  const p = new Account("test", "test").player;

  let called = false;

  p.registerListener({
    notify() {
      called = true;
    },
  });

  p.increment();

  expect(called).toBe(true);
});

test("badCode never becomes negative", () => {
  const p = new Account("test", "test").player;

  expect(() => {
    p.spend(1);
  }).toThrow(InsufficientBadCodeError);
});
test("produceBadCode adds productionPerSecond to badCode", () => {
  const p = new Account("test_" + Math.random(), "pw").player;

  p.increaseProductionPerSecond(10);
  p.produceBadCode();

  expect(p.badCode).toBe(10);
});

test("increaseProductionPerSecond increases production rate", () => {
  const p = new Account("test_" + Math.random(), "pw").player;

  p.increaseProductionPerSecond(5);

  expect(p.productionPerSecond).toBe(5);
});

test("increaseProductionPerSecond throws InvalidAmountError for negative values", () => {
  const p = new Account("test_" + Math.random(), "pw").player;

  expect(() => p.increaseProductionPerSecond(-5)).toThrow();
});

test("player can be saved and loaded from database", async () => {
  const username = "test_" + Math.random();

  const account = new Account(username, "pw");
  await Account.saveAccount(account);

  const player = account.player;

  player.increaseClickPower(9);
  player.increment(); // badCode = 10

  await player.saveAll();

  const loaded = await Player.loadPlayer(username, account);

  expect(loaded).not.toBeNull();
  expect(loaded!.badCode).toBe(10);
  expect(loaded!.clickPower).toBe(10);
});

test("building counts persist in database", async () => {
  const username = "test_" + Math.random();

  const account = new Account(username, "pw");
  await Account.saveAccount(account);

  const player = account.player;

  player.increaseClickPower(99);
  player.increment();

  player.purchaseDataCentre();

  await player.saveAll();

  const loaded = await Player.loadPlayer(username, account);

  expect(loaded!.dataCentre.buildingCount).toBe(1);
});

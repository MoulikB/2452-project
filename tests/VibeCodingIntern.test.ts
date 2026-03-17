import { test, expect } from "vitest";
import Player from "../src/model/Player/Player";
import InsufficientBadCodeError from "../src/model/Player/InsufficientBadCodeError";
import Account from "../src/Account/Account";

// helper to create fresh player each time
function createPlayer(): Player {
  const username = "test_" + Math.random();
  return new Account(username, "password").player;
}

// helper to give player badCode
function givePlayerBadCode(player: Player, amount: number) {
  player.increaseClickPower(amount - 1);
  player.increment();
}

test("purchase increases click power and upgrade count", () => {
  const player = createPlayer();

  givePlayerBadCode(player, 20);

  player.purchaseInternUpgrade();

  expect(player.badCode).toBe(0);
  expect(player.clickPower).toBe(21);
  expect(player.Intern.upgradeCount).toBe(1);
});

test("upgrade can be purchased multiple times", () => {
  const player = createPlayer();

  givePlayerBadCode(player, 40);

  player.purchaseInternUpgrade();
  player.purchaseInternUpgrade();

  expect(player.badCode).toBe(0);
  expect(player.Intern.upgradeCount).toBe(2);
  expect(player.clickPower).toBe(42);
});

test("purchase throws error if player cannot afford upgrade", () => {
  const player = createPlayer();

  expect(() => {
    player.purchaseInternUpgrade();
  }).toThrow(InsufficientBadCodeError);
});

test("Intern upgrade cost remains constant", () => {
  const player = createPlayer();

  givePlayerBadCode(player, 20);

  player.purchaseInternUpgrade();

  expect(player.badCode).toBe(0);
  expect(player.Intern.costValue).toBe(20);
});

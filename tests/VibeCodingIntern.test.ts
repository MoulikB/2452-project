import { test, expect } from "vitest";
import Player from "../src/model/Player/Player";
import InsufficientBadCodeError from "../src/model/Player/InsufficientBadCodeError";
import Account from "../src/model/Account/Account";

async function createPlayer(): Promise<Player> {
  const username = "test_" + Math.random();
  const account = await Account.create(username, "pw");
  return account.player;
}

// helper to give player badCode
function givePlayerBadCode(player: Player, amount: number) {
  player.increaseClickPower(amount - 1);
  player.increment();
}

test("purchase increases click power and upgrade count", async () => {
  const player = await createPlayer();

  givePlayerBadCode(player, 20);

  player.purchaseInternUpgrade();

  expect(player.badCode).toBe(0);
  expect(player.clickPower).toBe(21);
  expect(player.Intern.upgradeCount).toBe(1);
});

test("upgrade can be purchased multiple times", async () => {
  const player = await createPlayer();

  givePlayerBadCode(player, 40);

  player.purchaseInternUpgrade();
  player.purchaseInternUpgrade();

  expect(player.badCode).toBe(0);
  expect(player.Intern.upgradeCount).toBe(2);
  expect(player.clickPower).toBe(42);
});

test("purchase throws error if player cannot afford upgrade", async () => {
  const player = await createPlayer();

  expect(() => {
    player.purchaseInternUpgrade();
  }).toThrow(InsufficientBadCodeError);
});

test("Intern upgrade cost remains constant", async () => {
  const player = await createPlayer();

  givePlayerBadCode(player, 20);

  player.purchaseInternUpgrade();

  expect(player.badCode).toBe(0);
  expect(player.Intern.costValue).toBe(20);
});

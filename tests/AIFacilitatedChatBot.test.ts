import { test, expect } from "vitest";
import Player from "../src/model/Player/Player";
import InsufficientBadCodeError from "../src/model/Player/InsufficientBadCodeError";
import Account from "../src/Account/Account";

function createPlayer(): Player {
  const username = "test_" + Math.random();
  return new Account(username, "password").player;
}

function givePlayerBadCode(player: Player, amount: number) {
  player.increaseClickPower(amount - 1);
  player.increment();
}

test("AI chatbot upgrade increases click power by 2", () => {
  const player = createPlayer();

  givePlayerBadCode(player, 50);

  player.purchaseBotUpgrade();

  expect(player.badCode).toBe(0);
  expect(player.clickPower).toBe(52);
  expect(player.AIBot.upgradeCount).toBe(1);
});

test("upgrade can be purchased multiple times", () => {
  const player = createPlayer();

  givePlayerBadCode(player, 100);

  player.purchaseBotUpgrade();
  player.purchaseBotUpgrade();

  expect(player.badCode).toBe(0);
  expect(player.AIBot.upgradeCount).toBe(2);
  expect(player.clickPower).toBe(104);
});

test("AI chatbot purchase fails without enough badCode", () => {
  const player = createPlayer();

  expect(() => {
    player.purchaseBotUpgrade();
  }).toThrow(InsufficientBadCodeError);
});

test("AI chatbot upgrade cost remains constant", () => {
  const player = createPlayer();

  givePlayerBadCode(player, 50);

  player.purchaseBotUpgrade();

  expect(player.badCode).toBe(0);
  expect(player.AIBot.costValue).toBe(50);
});

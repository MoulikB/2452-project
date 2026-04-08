import { test, expect } from "vitest";
import Player from "../src/model/Player/Player";
import InsufficientBadCodeError from "../src/model/Player/InsufficientBadCodeError";
import Account from "../src/model/Account/Account";

async function createPlayer(): Promise<Player> {
  const username = "test_" + Math.random();
  const account = await Account.create(username, "pw");
  return account.player;
}

function givePlayerBadCode(player: Player, amount: number) {
  player.increaseClickPower(amount - 1);
  player.increment();
}

test("AI chatbot upgrade increases click power by 5", async () => {
  const player = await createPlayer();

  givePlayerBadCode(player, 50);

  player.purchaseUpgrade("AI-facilitated chatbot");

  expect(player.badCode).toBe(0);
  expect(player.clickPower).toBe(55);
  expect(player.upgradesList[1].upgradeCount).toBe(1);
});

test("upgrade can be purchased multiple times", async () => {
  const player = await createPlayer();

  givePlayerBadCode(player, 100);

  player.purchaseUpgrade("AI-facilitated chatbot");
  player.purchaseUpgrade("AI-facilitated chatbot");

  expect(player.badCode).toBe(0);
  expect(player.upgradesList[1].upgradeCount).toBe(2);
  expect(player.clickPower).toBe(110);
});

test("AI chatbot purchase fails without enough badCode", async () => {
  const player = await createPlayer();

  expect(() => {
    player.purchaseUpgrade("AI-facilitated chatbot");
  }).toThrow(InsufficientBadCodeError);
});

test("AI chatbot upgrade cost remains constant", async () => {
  const player = await createPlayer();

  givePlayerBadCode(player, 50);

  player.purchaseUpgradeHelper(player.upgradesList[1]);

  expect(player.badCode).toBe(0);
  expect(player.upgradesList[1].costValue).toBe(50);
});

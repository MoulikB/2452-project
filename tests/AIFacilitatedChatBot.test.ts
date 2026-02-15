import { test, expect } from "vitest";
import Player from "../src/model/Player/Player";
import AIFacilitatedChatBot from "../src/model/Upgrade/AIFacilitatedChatBot";
import InsufficientBadCodeError from "../src/model/Player/InsufficientBadCodeError";

//Helper function to increase click power and increment bad code
function givePlayerBadCode(player: Player, amount: number) {
  player.increaseClickPower(amount - 1);
  player.increment();
}

test("AI chatbot upgrade increases click power by 2", () => {
  const player = new Player();

  givePlayerBadCode(player, 50);
  // badCode = 50

  player.purchaseBotUpgrade();

  expect(player.badCode).toBe(0);
  expect(player.clickPower).toBe(52); // PREVIOUS 49 + 2 + 1 (default)
  expect(player.AIBot.upgradeCount).toBe(1);
});

test("upgrade can be purchased multiple times", () => {
  const player = new Player();

  // give enough badCode for two purchases
  givePlayerBadCode(player, 100);

  player.purchaseBotUpgrade(); // first purchase BAD CODE = 50
  player.purchaseBotUpgrade(); // second purchase BAD CODE = 0

  expect(player.badCode).toBe(0);

  expect(player.AIBot.upgradeCount).toBe(2);
  expect(player.clickPower).toBe(104); // 99 from increment +4 from AI chatbot +1 default
});

test("AI chatbot purchase fails without enough badCode", () => {
  const player = new Player();

  expect(() => {
    player.purchaseBotUpgrade();
  }).toThrow(InsufficientBadCodeError);
});

test("AI chatbot upgrade cost remains constant", () => {
  const player = new Player();

  //badCode = 50
  givePlayerBadCode(player, 50);

  player.purchaseBotUpgrade();

  expect(player.badCode).toBe(0);

  // After purchase, cost should remain the same
  expect(player.AIBot.costValue).toBe(50);
});

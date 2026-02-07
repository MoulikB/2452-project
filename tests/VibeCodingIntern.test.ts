import { test, expect } from "vitest";
import Player from "../src/model/Player/Player";
import VibeCodingIntern from "../src/model/Upgrade/VibeCodingIntern";
import InsufficientBadCodeError from "../src/model/Player/InsufficientBadCodeError";

//Helper function to increase click power and increment bad code
function givePlayerBadCode(player: Player, amount: number) {
  player.increaseClickPower(amount - 1);
  player.increment();
}

test("purchase increases click power and upgrade count", () => {
  const player = new Player();
  const upgrade = new VibeCodingIntern();

  // give player exactly 20 badCode
  givePlayerBadCode(player, 20);

  upgrade.purchase(player);

  expect(player.badCode).toBe(0);
  expect(player.clickPower).toBe(21); // 19 from increment +1 from intern +1 default
  expect(upgrade.upgradeCount).toBe(1);
});

test("upgrade can be purchased multiple times", () => {
  const player = new Player();
  const upgrade = new VibeCodingIntern();

  // give enough badCode for two purchases
  // give player exactly 40 badCode
  givePlayerBadCode(player, 40);

  upgrade.purchase(player); // first purchase BAD CODE = 20
  upgrade.purchase(player); // second purchase BAD CODE = 0

  expect(player.badCode).toBe(0);

  expect(upgrade.upgradeCount).toBe(2);
  expect(player.clickPower).toBe(42); // 39 from increment +2 from interns +1 default
});

test("purchase throws error if player cannot afford upgrade", () => {
  const player = new Player();
  const upgrade = new VibeCodingIntern();

  expect(() => {
    upgrade.purchase(player);
  }).toThrow(InsufficientBadCodeError);
});

test("Vibe Coding upgrade cost remains constant", () => {
  const upgrade = new VibeCodingIntern();
  const player = new Player();

  // give player exactly 20 badCode
  givePlayerBadCode(player, 20);

  upgrade.purchase(player);

  expect(player.badCode).toBe(0);

  // After purchase, cost should remain the same
  expect(upgrade.costValue).toBe(20);
});

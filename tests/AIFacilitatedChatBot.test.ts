import { test, expect } from "vitest";
import Player from "../src/model/Player/Player";
import Upgrade from "../src/model/Upgrade/Upgrade";
import InsufficientBadCodeError from "../src/model/Player/InsufficientBadCodeError";

test("purchasing upgrade spends badCode and increases clickPower", () => {
  const player = new Player();
  const upgrade = new Upgrade(1, 2);

  player.increment(); // badCode = 1
  player.purchase(upgrade);

  expect(player.badCode).toBe(0);
  expect(player.clickPower).toBe(3);
});

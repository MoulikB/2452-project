import { test, expect } from "vitest";
import Account from "../src/model/Account/Account";
import Building from "../src/model/Building/Building";

test("MemoryLeak initializes with correct values", () => {
  const building = new Building("Memory Leak", 200, 15);

  expect(building.buildingName).toBe("Memory Leak");
  expect(building.costValue).toBe(200);
  expect(building.productionValue).toBe(15);
  expect(building.buildingCount).toBe(0);
});

test("MemoryLeak inherits count behavior", () => {
  const building = new Building("Memory Leak", 200, 15);

  building.increaseCount();
  building.increaseCount();
  building.increaseCount();

  expect(building.buildingCount).toBe(3);
});

test("purchasing MemoryLeak increases productionPerSecond", async () => {
  const p = (await Account.create("test_" + Math.random(), "pw")).player;

  p.increaseClickPower(499);
  p.increment(); // badCode = 500

  p.purchaseBuildingHelper(p.buildingsList[1]);

  expect(p.badCode).toBe(0);
  expect(p.productionPerSecond).toBe(15);
  expect(p.buildingsList[1].buildingCount).toBe(1);
});

test("purchaseDataCentre throws if player cannot afford it", async () => {
  const p = (await Account.create("test_" + Math.random(), "pw")).player;
  expect(() => p.purchaseBuildingHelper(p.memoryLeak)).toThrow();
});

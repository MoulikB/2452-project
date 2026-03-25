import { test, expect } from "vitest";
import MemoryLeak from "../src/model/Building/MemoryLeak";
import Account from "../src/model/Account/Account";

test("MemoryLeak initializes with correct values", () => {
  const building = new MemoryLeak("Memory Leak", 200, 15);

  expect(building.buildingName).toBe("Memory Leak");
  expect(building.costValue).toBe(200);
  expect(building.productionValue).toBe(15);
  expect(building.buildingCount).toBe(0);
});

test("MemoryLeak inherits count behavior", () => {
  const building = new MemoryLeak("Memory Leak", 200, 15);

  building.increaseCount();
  building.increaseCount();
  building.increaseCount();

  expect(building.buildingCount).toBe(3);
});

test("purchasing MemoryLeak increases productionPerSecond", async () => {
  const p = (await Account.create("test_" + Math.random(), "pw")).player;

  p.increaseClickPower(199);
  p.increment(); // badCode = 200

  p.purchaseMemoryLeak();

  expect(p.badCode).toBe(0);
  expect(p.productionPerSecond).toBe(15);
  expect(p.memoryLeak.buildingCount).toBe(1);
});

test("purchaseDataCentre throws if player cannot afford it", async () => {
  const p = (await Account.create("test_" + Math.random(), "pw")).player;
  expect(() => p.purchaseDataCentre()).toThrow();
});

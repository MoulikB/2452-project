import { test, expect } from "vitest";
import MemoryLeak from "../src/model/Building/MemoryLeak";
import Building from "../src/model/Building/Building";
import db from "../src/model/connection";
import Account from "../src/Account/Account";

test("MemoryLeak initializes with correct values", () => {
  const building = new MemoryLeak();

  expect(building.buildingName).toBe("Memory Leak");
  expect(building.costValue).toBe(200);
  expect(building.productionValue).toBe(15);
  expect(building.buildingCount).toBe(0);
});

test("MemoryLeak inherits count behavior", () => {
  const building = new MemoryLeak();

  building.increaseCount();
  building.increaseCount();
  building.increaseCount();

  expect(building.buildingCount).toBe(3);
});

test("purchasing MemoryLeak increases productionPerSecond", () => {
  const p = new Account("test_" + Math.random(), "pw").player;

  p.increaseClickPower(199);
  p.increment(); // badCode = 200

  p.purchaseMemoryLeak();

  expect(p.badCode).toBe(0);
  expect(p.productionPerSecond).toBe(15);
  expect(p.memoryLeak.buildingCount).toBe(1);
});
test("purchaseDataCentre throws if player cannot afford it", () => {
  const p = new Account("test_" + Math.random(), "pw").player;

  expect(() => p.purchaseDataCentre()).toThrow();
});

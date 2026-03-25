import { test, expect } from "vitest";
import DataCentre from "../src/model/Building/DataCentre";
import Account from "../src/model/Account/Account";

test("DataCentre initializes with correct values", () => {
  const building = new DataCentre("Data Centre", 100, 5);

  expect(building.buildingName).toBe("Data Centre");
  expect(building.costValue).toBe(100);
  expect(building.productionValue).toBe(5);
  expect(building.buildingCount).toBe(0);
});

test("DataCentre inherits count behavior", () => {
  const building = new DataCentre("Data Centre", 100, 5);

  building.increaseCount();
  building.increaseCount();

  expect(building.buildingCount).toBe(2);
});

test("purchasing DataCentre increases productionPerSecond", async () => {
  const p = (await Account.create("test_" + Math.random(), "pw")).player;

  p.increaseClickPower(99);
  p.increment(); // badCode = 100

  p.purchaseDataCentre();

  expect(p.badCode).toBe(0);
  expect(p.productionPerSecond).toBe(5);
  expect(p.dataCentre.buildingCount).toBe(1);
});

test("purchaseDataCentre throws if player cannot afford it", async () => {
  const p = (await Account.create("test_" + Math.random(), "pw")).player;

  expect(() => p.purchaseDataCentre()).toThrow();
});

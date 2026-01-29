import { Upgrade } from "./Upgrade";

// Invariant: value is always >= 0
export class Counter {
  private value: number = 0;
  private upgrades: Upgrade[];

  constructor(upgrades: Upgrade[]) {
    this.upgrades = upgrades;
  }

  private checkInvariant(): void {
    // Invariant: value >= 0 and all upgrade counts >= 0

    if (this.value < 0) {
      throw new Error("Invariant violated: value >= 0");
    }
    for (const upgrade of this.upgrades) {
      if (upgrade.count < 0) {
        throw new Error("Invariant violated: upgrade count >= 0");
      }
    }
  }

  public spend(amount: number): void {
    if (amount > this.value) {
      throw new Error("Precondition violated: insufficient value");
    }

    this.value -= amount;
    this.checkInvariant();
  }

  public increment(): void {
    let totalIncrease = 1;

    for (const upgrade of this.upgrades) {
      totalIncrease += upgrade.count * upgrade.multiplier;
    }

    this.value += totalIncrease;
    this.checkInvariant();
  }

  public getValue(): number {
    return this.value;
  }
}

// Abstract base class representing a purchasable building.
// All Buildings increase emulate a click every x amount of seconds and track how many times they were bought
import { assert } from "../../assertion";

export default abstract class Building {
  protected cost!: number;
  protected ProductionPerSecond!: number;
  protected count: number = 0;

  #checkInvariants(): void {
    assert(this.count >= 0, "Count must always be greater than or equal to 0");
    assert(
      this.ProductionPerSecond >= 1,
      "Increase must be greather than or equal to 1",
    );
    assert(this.cost >= 1, "Upgrade cannot be free");
  }

  public get costValue(): number {
    return this.cost;
  }

  public get buildingCount(): number {
    return this.count;
  }

  public get getProductionPerSecond(): number {
    return this.ProductionPerSecond;
  }

  public increaseCount(): void {
    this.#checkInvariants;
    this.count++;
    this.#checkInvariants;
  }
}

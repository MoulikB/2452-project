// Abstract base class representing a purchasable upgrade.
// All Upgrades increase player clickPower and track how many times they were bought
import { assert } from "../../assertion";

export default abstract class Upgrade {
  protected cost!: number;
  protected clickPowerIncrease!: number;
  protected count: number = 0;

  #checkInvariants() {
    assert(this.count >= 0, "Count must always be greater than or equal to 0");
    assert(
      this.clickPowerIncrease >= 1,
      "Increase must be greather than or equal to 1",
    );
    assert(this.cost >= 1, "Upgrade cannot be free");
  }

  public get costValue(): number {
    return this.cost;
  }

  public get upgradeCount() {
    return this.count;
  }

  public get clickPowerIncreaseValue() {
    return this.clickPowerIncrease;
  }

  public increaseCount() {
    this.#checkInvariants;
    this.count++;
    this.#checkInvariants;
  }
}

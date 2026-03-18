import { assert } from "../../assertion";

/**
 * Abstract base class for all upgrades in the game.
 * Upgrades increase player click power and track how many times they are purchased.
 */
export default abstract class Upgrade {
  protected name!: string; // display name of the upgrade
  protected cost!: number; // cost required to purchase the upgrade
  protected clickPowerIncrease!: number; // amount of click power added per purchase
  protected count: number = 0; // number of times this upgrade has been purchased

  /**
   * Ensures upgrade state remains valid.
   */
  #checkInvariants(): void {
    assert(
      this.name != null || this.name != "",
      "Name of upgrade is null or empty",
    );
    assert(this.count >= 0, "Count must always be greater than or equal to 0");
    assert(
      this.clickPowerIncrease >= 1,
      "Increase must be greater than or equal to 1",
    );
    assert(this.cost >= 1, "Upgrade cannot be free");
  }

  get upgradeName(): string {
    return this.name;
  }

  get costValue(): number {
    return this.cost;
  }

  get upgradeCount(): number {
    return this.count;
  }

  get clickPowerIncreaseValue(): number {
    return this.clickPowerIncrease;
  }

  /**
   * Increases the number of upgrades owned.
   */
  public increaseCount(): void {
    this.#checkInvariants();
    this.count++; // increment purchase count
    this.#checkInvariants();
  }

  /**
   * Loads upgrade count from database.
   */
  public loadCount(count: number): void {
    this.count = count; // set count from persisted value
    this.#checkInvariants();
  }
}

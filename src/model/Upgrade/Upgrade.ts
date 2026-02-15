// Abstract base class representing a purchasable upgrade.
// All Upgrades increase player clickPower and track how many times they were bought
import { assert } from "../../assertion";
import Player from "../Player/Player";

export default abstract class Upgrade {
  protected cost!: number;
  protected clickPowerIncrease!: number;
  protected count: number = 0;

  protected checkInvariants() {
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

  // Purchases this upgrade for the given player.
  // Deducts cost, increments upgrade count, and applies the upgrade effect
  public purchase(player: Player) {
    this.checkInvariants();

    player.spend(this.cost);
    this.count++;
    this.#apply(player);

    this.checkInvariants();
  }

  // Applies the effect of the upgrade to the player and increases their click power
  #apply(player: Player): void {
    this.checkInvariants();

    player.increaseClickPower(this.clickPowerIncrease);

    this.checkInvariants();
  }
}

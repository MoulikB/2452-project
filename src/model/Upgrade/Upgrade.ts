import { assert } from "../../assertion";
import Player from "../Player/Player";

export default abstract class Upgrade {
  protected cost!: number;
  protected clickPowerIncrease!: number;
  protected count: number = 0;

  costValue(): number {
    return this.cost;
  }

  protected checkInvariants() {
    assert(this.count >= 0, "Count must always be greater than or equal to 0");
    assert(
      this.clickPowerIncrease >= 1,
      "Increase must be greather than or equal to 0",
    );
    assert(this.cost >= 1, "Upgrade cannot be free");
  }

  get upgradeCount() {
    return this.count;
  }

  purchase(player: Player) {
    this.checkInvariants();
    player.spend(this.cost);
    this.count++;
    this.apply(player);
  }

  protected abstract apply(player: Player): void;
}

import Player from "../Player/Player";

export default abstract class Upgrade {
  protected cost!: number;
  protected clickPowerIncrease!: number;
  protected count: number = 0;

  costValue(): number {
    return this.cost;
  }

  get upgradeCount() {
    return this.count;
  }

  purchase(player: Player) {
    player.spend(this.cost);
    this.count++;
    this.apply(player);
  }

  protected abstract apply(player: Player): void;
}

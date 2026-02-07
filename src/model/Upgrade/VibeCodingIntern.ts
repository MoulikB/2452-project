import Upgrade from "./Upgrade";
import Player from "../Player/Player";

export default class VibeCodingIntern extends Upgrade {
  constructor() {
    super();
    this.clickPowerIncrease = 1;
    this.cost = 20;
  }

  protected apply(player: Player): void {
    player.increaseClickPower(this.clickPowerIncrease);
  }
}

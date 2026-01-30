import Upgrade from "./Upgrade";
import Player from "../Player/Player";

export default class AIFacilitatedChatBot extends Upgrade {
  constructor() {
    super();
    this.cost = 50;
  }

  protected apply(player: Player): void {
    player.increaseClickPower(2);
  }
}

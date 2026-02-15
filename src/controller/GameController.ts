import Player from "../model/Player/Player";
import GameView from "../view/GameView";

// Controller responsible for coordinating the game.
// Creates model instances, connects them to the view,
// and exposes user actions to the UI.
export default class GameController {
  #player: Player;

  constructor() {
    this.#player = new Player();

    new GameView(this.#player, this);
  }

  // Simulate a click and increment bad code by click Power
  public click() {
    this.#player.increment();
  }

  // Buy a new intern upgrade
  public buyIntern() {
    this.#player.purchaseInternUpgrade();
  }

  // Buy a new AI Bot upgrade
  public buyAIBot() {
    this.#player.purchaseBotUpgrade();
  }
}

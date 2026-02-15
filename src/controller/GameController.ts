import Player from "../model/Player/Player";
import VibeCodingIntern from "../model/Upgrade/VibeCodingIntern";
import AIFacilitatedChatBot from "../model/Upgrade/AIFacilitatedChatBot";
import GameView from "../view/GameView";

// Controller responsible for coordinating the game.
// Creates model instances, connects them to the view,
// and exposes user actions to the UI.
export default class GameController {
  #player: Player;
  #intern: VibeCodingIntern;
  #aiBot: AIFacilitatedChatBot;

  constructor() {
    this.#player = new Player();
    this.#intern = new VibeCodingIntern();
    this.#aiBot = new AIFacilitatedChatBot();

    new GameView(this.#player, this.#intern, this.#aiBot, this);
  }

  // Simulate a click and increment bad code by click Power
  public click() {
    this.#player.increment();
  }

  // Buy a new intern upgrade
  public buyIntern() {
    this.#intern.purchase(this.#player);
  }

  // Buy a new AI Bot upgrade
  public buyAIBot() {
    this.#aiBot.purchase(this.#player);
  }
}

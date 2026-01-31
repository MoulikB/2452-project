import Player from "../model/Player/Player";
import VibeCodingIntern from "../model/Upgrade/VibeCodingIntern";
import AIFacilitatedChatBot from "../model/Upgrade/AIFacilitatedChatBot";
import GameView from "../view/gameView";

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

  click() {
    this.#player.increment();
  }

  buyIntern() {
    this.#intern.purchase(this.#player);
  }

  buyAIBot() {
    this.#aiBot.purchase(this.#player);
  }
}

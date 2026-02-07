import type Listener from "../model/listener";
import Player from "../model/Player/Player";
import GameController from "../controller/GameController";
import VibeCodingIntern from "../model/Upgrade/VibeCodingIntern";
import AIFacilitatedChatBot from "../model/Upgrade/AIFacilitatedChatBot";
import InsufficientBadCodeError from "../model/Player/InsufficientBadCodeError";

export default class GameView implements Listener {
  #player: Player;
  #intern: VibeCodingIntern;
  #aiBot: AIFacilitatedChatBot;
  #controller: GameController;

  constructor(
    player: Player,
    intern: VibeCodingIntern,
    aiBot: AIFacilitatedChatBot,
    controller: GameController,
  ) {
    this.#player = player;
    this.#intern = intern;
    this.#aiBot = aiBot;
    this.#controller = controller;

    this.#player.registerListener(this);

    document.querySelector("#app")!.innerHTML = `
      <button id="click-btn">Buy More Bad Code!</button>
      <div>Bad Code: <span id="bad-code"></span></div>

      <hr />

      <button id="intern-btn">
        Buy Vibe-Coding Intern (Cost: <span id="intern-cost"></span>)
      </button>
      <span>Owned: <span id="intern-count"></span></span>
      
      <br />

      <button id="ai-btn">
        Buy AI Facilitated Chat Bot (Cost: <span id="ai-cost"></span>)
      </button>
      <span>Owned: <span id="ai-count"></span></span>
    `;

    this.#wireEvents();
    this.notify();
  }

  #wireEvents(): void {
    document
      .querySelector("#click-btn")!
      .addEventListener("click", () => this.#controller.click());

    document.querySelector("#intern-btn")!.addEventListener("click", () => {
      try {
        this.#controller.buyIntern();
      } catch (e) {
        if (e instanceof InsufficientBadCodeError) {
          alert("Not enough bad code");
        }
      }
    });

    document.querySelector("#ai-btn")!.addEventListener("click", () => {
      try {
        this.#controller.buyAIBot();
      } catch (e) {
        if (e instanceof InsufficientBadCodeError) {
          alert("Not enough bad code");
        }
      }
    });
  }

  notify(): void {
    document.querySelector("#bad-code")!.textContent =
      this.#player.badCode.toString();

    document.querySelector("#intern-count")!.textContent =
      this.#intern.upgradeCount.toString();

    document.querySelector("#intern-cost")!.textContent =
      this.#intern.costValue.toString();

    document.querySelector("#ai-count")!.textContent =
      this.#aiBot.upgradeCount.toString();

    document.querySelector("#ai-cost")!.textContent =
      this.#aiBot.costValue.toString();
  }
}

import type Listener from "../model/listener";
import Player from "../model/Player/Player";
import GameController from "../controller/GameController";
import VibeCodingIntern from "../model/Upgrade/VibeCodingIntern";
import AIFacilitatedChatBot from "../model/Upgrade/AIFacilitatedChatBot";
import InsufficientBadCodeError from "../model/Player/InsufficientBadCodeError";

// View responsible for rendering the game UI and responding to model updates.
// Delegates user interactions to the controller.

export default class GameView implements Listener {
  #player: Player;
  #intern: VibeCodingIntern;
  #aiBot: AIFacilitatedChatBot;
  #controller: GameController;

  constructor(player: Player, controller: GameController) {
    this.#player = player;
    this.#intern = player.Intern;
    this.#aiBot = player.AIBot;
    this.#controller = controller;

    this.#player.registerListener(this);

    this.#renderIntro();
  }

  #renderIntro(): void {
    document.querySelector("#app")!.innerHTML = `
    <h1>Welcome to Bad Code Clicker</h1>
    <input id="name-input" type="text" placeholder="Enter your name" />
    <br /><br />
    <button id="start-btn">Start Game</button>
  `;

    document.querySelector("#start-btn")!.addEventListener("click", () => {
      const name = (
        document.querySelector("#name-input") as HTMLInputElement
      ).value.trim();

      if (name.length === 0) {
        alert("Please enter your name.");
        return;
      }

      this.#player.name = name;

      this.#renderGame();
    });
  }

  #renderGame(): void {
    document.querySelector("#app")!.innerHTML = `
    <h2>Welcome, <span id="name"></span>!</h2>

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

    document
      .querySelector("#intern-btn")!
      .addEventListener("click", () =>
        this.#attempt(() => this.#controller.buyIntern()),
      );

    document
      .querySelector("#ai-btn")!
      .addEventListener("click", () =>
        this.#attempt(() => this.#controller.buyAIBot()),
      );
  }

  // Avoids repetition of try/catch logic when attempting to buy new upgrades
  #attempt(action: () => void): void {
    try {
      action();
    } catch (e) {
      if (e instanceof InsufficientBadCodeError) {
        alert("Not enough bad code");
      }
    }
  }

  notify(): void {
    document.querySelector("#name")!.textContent = this.#player.name.toString();
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

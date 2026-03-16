import type Listener from "../model/listener";
import Player from "../model/Player/Player";
import GameController from "../controller/GameController";
import InsufficientBadCodeError from "../model/Player/InsufficientBadCodeError";
import IncorrectPasswordException from "../controller/IncorrectPasswordException";

export default class GameView implements Listener {
  #player!: Player;
  #controller: GameController;

  constructor(controller: GameController) {
    this.#controller = controller;
    this.#renderIntro();
  }

  startGame(player: Player) {
    this.#player = player;
    this.#player.registerListener(this);
    this.#renderGame();
  }

  #renderIntro() {
    document.querySelector("#app")!.innerHTML = `
      <h1>Bad Code Clicker</h1>

      <input id="name-input" placeholder="Enter name" />
      <br><br>

      <input id="password-input" placeholder="Enter password" />
      <br><br>

      <button id="start-btn">Start Game</button>
    `;

    document
      .querySelector("#start-btn")!
      .addEventListener("click", async () => {
        const name = (document.querySelector("#name-input") as HTMLInputElement)
          .value;
        const password = (
          document.querySelector("#password-input") as HTMLInputElement
        ).value;

        try {
          await this.#controller.login(name, password);
        } catch (e) {
          if (e instanceof IncorrectPasswordException) {
            alert(e.message);
          }
        }
      });
  }

  #renderGame() {
    document.querySelector("#app")!.innerHTML = `
      <h2>Welcome <span id="name"></span></h2>

      <button id="click-btn">Write Bad Code</button>
      <div>Bad Code: <span id="bad-code"></span></div>
      <div>Production Per Second: <span id="pps"></span></div>

      <hr>

      <h3>Upgrades</h3>

      <button id="intern-btn">
        Buy Intern (Cost: <span id="intern-cost"></span>)
      </button>
      Owned: <span id="intern-count"></span>

      <br><br>

      <button id="ai-btn">
        Buy AI Bot (Cost: <span id="ai-cost"></span>)
      </button>
      Owned: <span id="ai-count"></span>

      <hr>

      <h3>Buildings</h3>

      <button id="data-centre-btn">
        Buy Data Centre (Cost: <span id="data-centre-cost"></span>)
      </button>
      Owned: <span id="data-centre-count"></span>

      <br><br>

      <button id="memory-leak-btn">
        Buy Memory Leak (Cost: <span id="memory-leak-cost"></span>)
      </button>
      Owned: <span id="memory-leak-count"></span>
    `;

    document
      .querySelector("#click-btn")!
      .addEventListener("click", () => this.#controller.click());

    document
      .querySelector("#intern-btn")!
      .addEventListener(
        "click",
        async () => await this.#attempt(() => this.#controller.buyIntern()),
      );

    document
      .querySelector("#ai-btn")!
      .addEventListener(
        "click",
        async () => await this.#attempt(() => this.#controller.buyAIBot()),
      );

    document
      .querySelector("#data-centre-btn")!
      .addEventListener(
        "click",
        async () => await this.#attempt(() => this.#controller.buyDataCentre()),
      );

    document
      .querySelector("#memory-leak-btn")!
      .addEventListener(
        "click",
        async () => await this.#attempt(() => this.#controller.buyMemoryLeak()),
      );

    this.notify();
  }

  async #attempt(action: () => Promise<void> | void): Promise<void> {
    try {
      await action();
    } catch (e) {
      if (e instanceof InsufficientBadCodeError) {
        alert("Not enough bad code");
      }
    }
  }

  notify(): void {
    document.querySelector("#name")!.textContent = this.#player.name;
    document.querySelector("#bad-code")!.textContent =
      this.#player.badCode.toString();

    document.querySelector("#pps")!.textContent =
      this.#player.productionPerSecond.toString();

    document.querySelector("#intern-count")!.textContent =
      this.#player.Intern.upgradeCount.toString();

    document.querySelector("#intern-cost")!.textContent =
      this.#player.Intern.costValue.toString();

    document.querySelector("#ai-count")!.textContent =
      this.#player.AIBot.upgradeCount.toString();

    document.querySelector("#ai-cost")!.textContent =
      this.#player.AIBot.costValue.toString();

    document.querySelector("#data-centre-count")!.textContent =
      this.#player.dataCentre.buildingCount.toString();

    document.querySelector("#data-centre-cost")!.textContent =
      this.#player.dataCentre.costValue.toString();

    document.querySelector("#memory-leak-count")!.textContent =
      this.#player.memoryLeak.buildingCount.toString();

    document.querySelector("#memory-leak-cost")!.textContent =
      this.#player.memoryLeak.costValue.toString();
  }
}

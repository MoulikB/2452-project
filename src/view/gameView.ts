import type Listener from "../model/listener";
import Player from "../model/Player/Player";
import GameController from "../controller/GameController";
import InsufficientBadCodeError from "../model/Player/InsufficientBadCodeError";
import IncorrectPasswordException from "../controller/IncorrectPasswordException";

/**
 * View layer of the game (MVC).
 * Handles rendering UI and user interactions.
 */
export default class GameView implements Listener {
  #player!: Player; // current player being displayed
  #controller: GameController; // controller to handle actions
  #autoProductionTimer: number | null = null; // interval for passive production

  /**
   * Initializes the view and renders the intro screen.
   */
  constructor(controller: GameController) {
    this.#controller = controller;
    this.#renderIntro();
  }

  /**
   * Starts automatic bad code production every second.
   * Prevents multiple timers from being created.
   */
  public startAutoProduction(): void {
    let flag = false;
    if (this.#autoProductionTimer !== null) {
      flag = true;
    }
    if (!flag) {
      this.#autoProductionTimer = window.setInterval(() => {
        this.#controller.account.player.produceBadCode();
        // generates passive income each second
      }, 1000);

      this.#controller.account.player.saveAll();
      // persist state after starting production
    }
  }

  /**
   * Starts the game UI after login.
   */
  startGame(player: Player) {
    this.#player = player;
    this.#player.registerListener(this); // subscribe to player updates
    this.#renderGame();
  }

  /**
   * Renders login screen.
   */
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
          await this.#controller.login(name, password); // attempt login
        } catch (e) {
          if (e instanceof IncorrectPasswordException) {
            alert(e.message); // notify user of incorrect password
          }
        }
      });
  }

  /**
   * Renders main game UI.
   */
  #renderGame() {
    this.startAutoProduction();
    // start passive income loop

    let innerHTML = `
      <h2>Welcome <span id="name"></span></h2>

      <button id="click-btn">Write Bad Code</button>
      <div>Bad Code: <span id="bad-code"></span></div>
      <div>Click power: <span id="cpower"></span></div>
      <div>Production Per Second: <span id="pps"></span></div>
      <label class="switch">
        <input type="checkbox" id="robo-on">
        <span class="slider round"></span>
      </label>
      <span id="toggle-status">Off</span>


      <hr>
    `;

    let upgradesHTML = "<h3>Upgrades</h3>";

    for (const upgrade of this.#player.upgradesList) {
      const id = upgrade.upgradeName.replace(/\s+/g, "-").toLowerCase();

      upgradesHTML += ` 
    <button id="${id}-btn">
      Buy ${upgrade.upgradeName} (Cost: <span id="${id}-cost"></span>)
    </button>
    Owned: <span id="${id}-count"></span>
    <br><br>
  `;
    }

    let buildingHTML = "<h3>Buildings</h3>";

    for (const building of this.#player.buildingsList) {
      const id = building.buildingName.replace(/\s+/g, "-").toLowerCase();

      buildingHTML += `
    <button id="${id}-btn">
      Buy ${building.buildingName} (Cost: <span id="${id}-cost"></span>)
    </button>
    Owned: <span id="${id}-count"></span>
    <br><br>
  `;
    }
    document.querySelector("#app")!.innerHTML = `
  ${innerHTML}

  <div class="container">
    <div class="box">
      ${upgradesHTML}
    </div>

    <div class="box">
      ${buildingHTML}
    </div>
  </div>
`;

    // manual click button
    document
      .querySelector("#click-btn")!
      .addEventListener("click", () => this.#controller.click());

    // Toggle on off autobuy
    const checkbox = document.querySelector("#robo-on") as HTMLInputElement;

    checkbox.addEventListener("change", () => {
      this.#controller.toggleState();

      const status = document.querySelector("#toggle-status")!;
      status.textContent = checkbox.checked ? "On" : "Off";
    });

    // upgrade buttons
    for (const upgrade of this.#player.upgradesList) {
      const id = upgrade.upgradeName.replace(/\s+/g, "-").toLowerCase();

      document
        .querySelector(`#${id}-btn`)!
        .addEventListener(
          "click",
          async () =>
            await this.#attempt(() =>
              this.#controller.buyUpgrade(upgrade.upgradeName),
            ),
        );
    }

    // building buttons
    for (const building of this.#player.buildingsList) {
      const id = building.buildingName.replace(/\s+/g, "-").toLowerCase();

      document
        .querySelector(`#${id}-btn`)!
        .addEventListener(
          "click",
          async () =>
            await this.#attempt(() =>
              this.#controller.buyBuilding(building.buildingName),
            ),
        );
    }

    this.notify(); // initial render of values
  }

  /**
   * Attempts an action and handles insufficient resource errors.
   */
  async #attempt(action: () => Promise<void> | void): Promise<void> {
    try {
      await action();
    } catch (e) {
      if (e instanceof InsufficientBadCodeError) {
        alert("Not enough bad code"); // notify user if they cannot afford action
      }
    }
  }

  /**
   * Updates UI when player state changes.
   */
  notify(): void {
    document.querySelector("#name")!.textContent = this.#player.name;

    document.querySelector("#bad-code")!.textContent =
      this.#player.badCode.toString();

    document.querySelector("#cpower")!.textContent =
      this.#player.clickPower.toString();

    document.querySelector("#pps")!.textContent =
      this.#player.productionPerSecond.toString();

    // upgrades
    for (const upgrade of this.#player.upgradesList) {
      const id = upgrade.upgradeName.replace(/\s+/g, "-").toLowerCase();

      document.querySelector(`#${id}-count`)!.textContent =
        upgrade.upgradeCount.toString();

      document.querySelector(`#${id}-cost`)!.textContent =
        upgrade.costValue.toString();
    }

    // buildings
    for (const building of this.#player.buildingsList) {
      const id = building.buildingName.replace(/\s+/g, "-").toLowerCase();

      document.querySelector(`#${id}-count`)!.textContent =
        building.buildingCount.toString();

      document.querySelector(`#${id}-cost`)!.textContent =
        building.costValue.toString();
    }
  }
}

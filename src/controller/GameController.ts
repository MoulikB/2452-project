import Account from "../model/Account";
import GameView from "../view/GameView";

// Controller responsible for coordinating the game.
// Creates model instances, connects them to the view,
// and exposes user actions to the UI.
export default class GameController {
  #account!: Account;
  #view: GameView;
  constructor() {
    this.#view = new GameView(this);
  }

  // Called by the view after user enters username/password
  public login(username: string, password: string): void {
    this.#account = new Account(username, password);

    // give the player to the view once the account exists
    this.#view.startGame(this.#account.player);
  }

  // Simulate a click and increment bad code by click Power
  public click() {
    this.#account.player.increment();
  }

  // Buy a new intern upgrade
  public buyIntern() {
    this.#account.player.purchaseInternUpgrade();
  }

  // Buy a new AI Bot upgrade
  public buyAIBot() {
    this.#account.player.purchaseBotUpgrade();
  }

  get account(): Account {
    return this.#account;
  }
}

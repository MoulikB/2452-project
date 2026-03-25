import Player from "../model/Player/Player";
import Account from "../Account/Account";
import GameView from "../view/GameView";
import IncorrectPasswordException from "./IncorrectPasswordException";

/**
 * Controls the flow of the game.
 * Handles login, user actions, and connects model with view.
 */
export default class GameController {
  #account!: Account; // currently logged-in account
  #view: GameView; // UI layer

  constructor() {
    this.#view = new GameView(this);
  }

  /**
   * Handles login or account creation.
   * - Verifies password if account exists
   * - Loads player data
   * - Starts game session
   */
  public async login(username: string, password: string): Promise<void> {
    let flag = false;
    const existingAccount = await Account.loadAccount(username);
    // check if account already exists in DB

    if (existingAccount !== null) {
      const valid = await existingAccount.verifyPassword(password);
      // compare input password with stored hash

      if (!valid) {
        throw new IncorrectPasswordException();
        // stop login if password is incorrect
      }

      const loadedPlayer = await Player.loadPlayer(username);
      // load persisted player data

      if (loadedPlayer !== null) {
        existingAccount.player = loadedPlayer;
        // replace default player with stored one
      }

      this.#account = existingAccount;

      this.#view.startGame(this.#account.player);
      // initialize UI with player state
      flag = true;
    }

    if (!flag) {
      // If account does not exist → create new account
      this.#account = new Account(username, password);

      await Account.saveAccount(this.#account);
      // hash + store credentials

      await this.#account.player.saveAll();
      // save initial player state

      this.#view.startGame(this.#account.player);
    }
  }

  /**
   * Handles manual clicking action.
   */
  public click(): void {
    this.#account.player.increment();
    // increases bad code based on click power
  }

  /**
   * Purchases intern upgrade and saves state.
   */
  public async buyIntern(): Promise<void> {
    this.#account.player.purchaseInternUpgrade();
    await this.#account.player.saveAll();
    // persist upgrade
  }

  /**
   * Purchases AI bot upgrade and saves state.
   */
  public async buyAIBot(): Promise<void> {
    this.#account.player.purchaseBotUpgrade();
    await this.#account.player.saveAll();
  }

  /**
   * Purchases data centre upgrade and saves state.
   */
  public async buyDataCentre(): Promise<void> {
    this.#account.player.purchaseDataCentre();
    await this.#account.player.saveAll();
  }

  /**
   * Purchases memory leak upgrade and saves state.
   */
  public async buyMemoryLeak(): Promise<void> {
    this.#account.player.purchaseMemoryLeak();
    await this.#account.player.saveAll();
  }

  // Returns current account
  get account(): Account {
    return this.#account;
  }
}

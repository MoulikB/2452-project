import Player from "../model/Player/Player";
import Account from "../Account/Account";
import Upgrade from "../model/Upgrade/Upgrade";
import AIFacilitatedChatBot from "../model/Upgrade/AIFacilitatedChatBot";
import VibeCodingIntern from "../model/Upgrade/VibeCodingIntern";
import GameView from "../view/GameView";
import IncorrectPasswordException from "./IncorrectPasswordException";

// Controls the flow of the game.
// Connects the view with the model and handles user actions.
export default class GameController {
  #account!: Account;
  #view: GameView;

  constructor() {
    // Create the game view and give it access to this controller
    this.#view = new GameView(this);
  }

  // Runs setup code that should only happen once when the app starts
  public async initialize(): Promise<void> {
    await GameController.initializeUpgradeTypes();
  }

  public async login(username: string, password: string): Promise<void> {
    // Try to find an existing account with this username
    const existingAccount = await Account.loadAccount(username);

    // If the account already exists, try to log in
    if (existingAccount !== null) {
      // Reject the login if the password is wrong
      if (existingAccount.password !== password) {
        throw new IncorrectPasswordException();
      }

      // Load the saved player data for this account
      const loadedPlayer = await Player.loadPlayer(username, existingAccount);

      // If player data exists, replace the default player with the loaded one
      if (loadedPlayer !== null) {
        existingAccount.player = loadedPlayer;
      }

      // Set this as the current account and start the game
      this.#account = existingAccount;
      this.#view.startGame(this.#account.player);
      return;
    }

    // If the account does not exist, create a new one
    this.#account = new Account(username, password);

    // Save the new account
    await Account.saveAccount(this.#account);

    // Save the new player's starting data
    await this.#account.player.saveAll();

    // Start the game
    this.#view.startGame(this.#account.player);
  }

  // Handles a click from the user and increases bad code
  public click(): void {
    this.#account.player.increment();
  }

  // Buys one intern upgrade, then saves the new player state
  public async buyIntern(): Promise<void> {
    this.#account.player.purchaseInternUpgrade();
    await this.#account.player.saveAll();
  }

  // Buys one AI bot upgrade, then saves the new player state
  public async buyAIBot(): Promise<void> {
    this.#account.player.purchaseBotUpgrade();
    await this.#account.player.saveAll();
  }

  // Returns the current account
  get account(): Account {
    return this.#account;
  }

  // Saves the master upgrade types into the database
  // This should only be called once when the app starts
  public static async initializeUpgradeTypes(): Promise<void> {
    await Upgrade.saveUpgradeType(new AIFacilitatedChatBot());
    await Upgrade.saveUpgradeType(new VibeCodingIntern());
  }
}

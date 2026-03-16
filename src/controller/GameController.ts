import Player from "../model/Player/Player";
import Account from "../Account/Account";
import Upgrade from "../model/Upgrade/Upgrade";
import AIFacilitatedChatBot from "../model/Upgrade/AIFacilitatedChatBot";
import VibeCodingIntern from "../model/Upgrade/VibeCodingIntern";
import GameView from "../view/GameView";
import IncorrectPasswordException from "./IncorrectPasswordException";
import Building from "../model/Building/Building";
import DataCentre from "../model/Building/DataCentre";
import MemoryLeak from "../model/Building/MemoryLeak";

export default class GameController {
  #account!: Account;
  #view: GameView;
  #autoProductionTimer: number | null = null;

  constructor() {
    this.#view = new GameView(this);
  }

  public startAutoProduction(): void {
    if (this.#autoProductionTimer !== null) {
      return;
    }

    this.#autoProductionTimer = window.setInterval(() => {
      this.#account.player.produceBadCode();
    }, 1000);
  }

  public async initialize(): Promise<void> {
    await GameController.initializeUpgradeTypes();
    await GameController.initializeBuildingTypes();
  }

  public static async initializeBuildingTypes(): Promise<void> {
    await Building.saveBuildingType(new DataCentre());
    await Building.saveBuildingType(new MemoryLeak());
  }

  public async login(username: string, password: string): Promise<void> {
    const existingAccount = await Account.loadAccount(username);

    if (existingAccount !== null) {
      if (existingAccount.password !== password) {
        throw new IncorrectPasswordException();
      }

      const loadedPlayer = await Player.loadPlayer(username, existingAccount);

      if (loadedPlayer !== null) {
        existingAccount.player = loadedPlayer;
      }

      this.#account = existingAccount;
      this.#view.startGame(this.#account.player);
      this.startAutoProduction();
      return;
    }

    this.#account = new Account(username, password);
    await Account.saveAccount(this.#account);
    await this.#account.player.saveAll();

    this.#view.startGame(this.#account.player);
    this.startAutoProduction();
  }

  public click(): void {
    this.#account.player.increment();
  }

  public async buyIntern(): Promise<void> {
    this.#account.player.purchaseInternUpgrade();
    await this.#account.player.saveAll();
  }

  public async buyAIBot(): Promise<void> {
    this.#account.player.purchaseBotUpgrade();
    await this.#account.player.saveAll();
  }

  public async buyDataCentre(): Promise<void> {
    this.#account.player.purchaseDataCentre();
    await this.#account.player.saveAll();
  }

  public async buyMemoryLeak(): Promise<void> {
    this.#account.player.purchaseMemoryLeak();
    await this.#account.player.saveAll();
  }

  get account(): Account {
    return this.#account;
  }

  public static async initializeUpgradeTypes(): Promise<void> {
    await Upgrade.saveUpgradeType(new AIFacilitatedChatBot());
    await Upgrade.saveUpgradeType(new VibeCodingIntern());
  }
}

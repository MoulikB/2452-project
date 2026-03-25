import Upgrade from "./Upgrade";

/**
 * Represents an AI-facilitated chatbot upgrade.
 * Increases the player's click power when purchased.
 */
export default class AIFacilitatedChatBot extends Upgrade {
  static readonly COST = 50; // fixed cost of the upgrade
  static readonly CLICK_POWER_BONUS = 2; // click power increase provided

  /**
   * Initializes the chatbot upgrade with predefined values.
   */
  constructor(name: string, cost: number, clickPowerIncrease: number) {
    super();

    this.name = name;
    // display name used in UI and database

    this.clickPowerIncrease = clickPowerIncrease;
    // amount added to player's click power

    this.cost = cost;
    // cost required to purchase the upgrade
  }
}

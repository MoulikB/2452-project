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
  constructor() {
    super();

    this.name = "AI-facilitated chatbot";
    // display name used for identification in UI and database

    this.clickPowerIncrease = AIFacilitatedChatBot.CLICK_POWER_BONUS;
    // amount added to player's click power

    this.cost = AIFacilitatedChatBot.COST;
    // cost required to purchase upgrade
  }
}

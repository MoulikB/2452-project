import Upgrade from "./Upgrade";

/**
 * Represents an AI-facilitated chatbot upgrade.
 * Increases the player's click power when purchased.
 */
export default class AIFacilitatedChatBot extends Upgrade {
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

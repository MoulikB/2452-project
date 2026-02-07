import Upgrade from "./Upgrade";

// An upgrade that provides an AI-facilitated chatbot,
// increasing the player's click power by 2 and allowing them to generate more bad code
export default class AIFacilitatedChatBot extends Upgrade {
  private static readonly CLICK_POWER_BONUS = 2; // The amount of click power this upgrade increases
  private static readonly COST = 50; // The cost of the upgrade

  // Initializes the AI-facilitated chatbot upgrade with predefined cost and power increase
  constructor() {
    super();
    this.clickPowerIncrease = AIFacilitatedChatBot.CLICK_POWER_BONUS;
    this.cost = AIFacilitatedChatBot.COST;
  }
}

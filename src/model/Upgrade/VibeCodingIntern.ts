import Upgrade from "./Upgrade";

// An upgrade that provides a Vibe Coding Intern,
// increasing the player's click power by 1 and allowing them to generate more bad code
export default class VibeCodingIntern extends Upgrade {
  private static readonly CLICK_POWER_BONUS = 1; // The amount of click power this upgrade increases
  private static readonly COST = 20; // The cost of the upgrade

  // Initializes the Vibe Coding Intern upgrade with predefined cost and power increase
  constructor() {
    super();
    this.clickPowerIncrease = VibeCodingIntern.CLICK_POWER_BONUS;
    this.cost = VibeCodingIntern.COST;
  }
}

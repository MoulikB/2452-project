import Upgrade from "./Upgrade";

/**
 * Represents a Vibe Coding Intern upgrade.
 * Provides a small increase to the player's click power.
 */
export default class VibeCodingIntern extends Upgrade {
  static readonly COST = 20; // fixed cost of the upgrade
  static readonly CLICK_POWER_BONUS = 1; // click power increase provided

  /**
   * Initializes the Vibe Coding Intern with predefined values.
   */
  constructor() {
    super();

    this.name = "Vibe Coding Intern";
    // display name used in UI and database

    this.clickPowerIncrease = VibeCodingIntern.CLICK_POWER_BONUS;
    // amount added to player's click power

    this.cost = VibeCodingIntern.COST;
    // cost required to purchase the upgrade
  }
}

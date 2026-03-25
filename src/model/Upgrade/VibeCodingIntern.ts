import Upgrade from "./Upgrade";

/**
 * Represents a Vibe Coding Intern upgrade.
 * Provides a small increase to the player's click power.
 */
export default class VibeCodingIntern extends Upgrade {
  /**
   * Initializes the Vibe Coding Intern with predefined values.
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

import Building from "./Building";

/**
 * Represents a Memory Leak building.
 * Higher cost building that provides stronger passive production.
 */
export default class MemoryLeak extends Building {
  static readonly #COST = 200;
  // fixed cost for purchasing one Memory Leak

  static readonly #PRODUCTION_PER_SECOND = 15;
  // passive production generated per second

  /**
   * Initializes a Memory Leak with predefined cost and production values.
   */
  public constructor() {
    super();

    this.name = "Memory Leak";
    // display name shown in UI and database

    this.productionPerSecond = MemoryLeak.#PRODUCTION_PER_SECOND;
    // assign constant production value

    this.cost = MemoryLeak.#COST;
    // assign constant cost
  }
}

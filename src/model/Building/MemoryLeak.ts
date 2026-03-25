import Building from "./Building";

/**
 * Represents a Memory Leak building.
 * Higher cost building that provides stronger passive production.
 */
export default class MemoryLeak extends Building {
  /**
   * Initializes a Memory Leak with predefined cost and production values.
   */
  public constructor(name: string, cost: number, productionPerSecond: number) {
    super();

    this.name = name;
    // display name used in UI and database

    this.productionPerSecond = productionPerSecond;
    // assign constant production value

    this.cost = cost;
    // assign constant cost
  }
}

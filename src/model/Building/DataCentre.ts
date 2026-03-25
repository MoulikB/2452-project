import Building from "./Building";

/**
 * Represents a Data Centre building.
 * Provides moderate cost with steady passive production.
 */
export default class DataCentre extends Building {
  /**
   * Initializes a Data Centre with predefined cost and production values.
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

import Building from "./Building";

/**
 * Represents a Data Centre building.
 * Provides moderate cost with steady passive production.
 */
export default class DataCentre extends Building {
  static readonly #COST = 100;
  // fixed cost for purchasing one Data Centre

  static readonly #PRODUCTION_PER_SECOND = 5;
  // passive production generated per second

  /**
   * Initializes a Data Centre with predefined cost and production values.
   */
  public constructor() {
    super();

    this.name = "Data Centre";
    // display name used in UI and database

    this.productionPerSecond = DataCentre.#PRODUCTION_PER_SECOND;
    // assign constant production value

    this.cost = DataCentre.#COST;
    // assign constant cost
  }
}

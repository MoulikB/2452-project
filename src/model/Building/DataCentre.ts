import Building from "./Building";

// A building that provides a data centre (facilitating AI)
// increasing the player's auto click by 1 and allowing them to generate more bad code
export default class DataCentre extends Building {
  static readonly #COST = 100; // The cost of the upgrade
  static readonly #PRODUCTION_PER_SECOND = 5; // How often this building runs

  // Initializes the Date Centre Building with predefined cost and timer
  constructor() {
    super();
    this.ProductionPerSecond = DataCentre.#PRODUCTION_PER_SECOND;
    this.cost = DataCentre.#COST;
  }
}

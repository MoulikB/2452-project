import Building from "./Building";

export default class DataCentre extends Building {
  static readonly #COST = 100;
  static readonly #PRODUCTION_PER_SECOND = 5;

  public constructor() {
    super();
    this.name = "Data Centre";
    this.productionPerSecond = DataCentre.#PRODUCTION_PER_SECOND;
    this.cost = DataCentre.#COST;
  }
}

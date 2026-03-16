import Building from "./Building";

export default class MemoryLeak extends Building {
  static readonly #COST = 200;
  static readonly #PRODUCTION_PER_SECOND = 15;

  public constructor() {
    super();
    this.name = "Memory Leak";
    this.productionPerSecond = MemoryLeak.#PRODUCTION_PER_SECOND;
    this.cost = MemoryLeak.#COST;
  }
}

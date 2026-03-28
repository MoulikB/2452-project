import { assert } from "../../assertion";

/**
 * Abstract base class for all buildings in the game.
 * Defines shared properties like cost, production, and quantity owned.
 */
export default class Building {
  protected name!: string; // display name of the building
  protected cost!: number; // cost to purchase one unit
  protected productionPerSecond!: number; // passive production generated per second
  protected count: number = 0; // number of this building owned by the player

  public constructor(name: string, cost: number, productionPerSecond: number) {
    this.name = name;
    // display name used in UI and database

    this.productionPerSecond = productionPerSecond;
    // assign constant production value

    this.cost = cost;
    // assign constant cost
  }

  #checkInvariants(): void {
    assert(
      this.productionPerSecond >= 1,
      "Increase must be greater than or equal to 1",
    );
    assert(
      this.name != null || this.name != "",
      "Name of upgrade is null or empty",
    );
    assert(this.count >= 0, "Count must always be greater than or equal to 0");
    assert(this.cost >= 1, "Buildilng cannot be free");
  }

  // Returns the building name
  public get buildingName(): string {
    return this.name;
  }

  // Returns the cost of the building
  public get costValue(): number {
    return this.cost;
  }

  // Returns how many of this building the player owns
  public get buildingCount(): number {
    return this.count;
  }

  // Returns production generated per second
  public get productionValue(): number {
    return this.productionPerSecond;
  }

  /**
   * Increases building count when purchased.
   */
  public increaseCount(): void {
    this.count++; // increment total owned
    this.#checkInvariants();
  }

  /**
   * Loads building count from database.
   * Used when restoring saved game state.
   */
  public loadCount(quantity: number): void {
    this.count = quantity; // set count from persisted value
    this.#checkInvariants();
  }
}

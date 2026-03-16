import db from "../connection";

export default abstract class Building {
  protected name!: string;
  protected cost!: number;
  protected productionPerSecond!: number;
  protected count: number = 0;

  public get buildingName(): string {
    return this.name;
  }

  public get costValue(): number {
    return this.cost;
  }

  public get buildingCount(): number {
    return this.count;
  }

  public get productionValue(): number {
    return this.productionPerSecond;
  }

  public increaseCount(): void {
    this.count++;
  }

  public loadCount(quantity: number): void {
    this.count = quantity;
  }

  public static async saveBuildingType(building: Building): Promise<void> {
    await db().query(
      `insert into building_type(name, baseCost, productionPerSecond)
       values ($1, $2, $3)
       on conflict (name) do update set
         baseCost = excluded.baseCost,
         productionPerSecond = excluded.productionPerSecond`,
      [building.buildingName, building.costValue, building.productionValue],
    );
  }
}

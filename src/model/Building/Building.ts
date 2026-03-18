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
}

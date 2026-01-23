export class Counter {
  private value: number = 0;

  public increment(): void {
    this.value++;
  }

  public getValue(): number {
    return this.value;
  }
}

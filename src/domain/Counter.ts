// Invariant: value is always >= 0
export class Counter {
  private value: number = 0;

  private checkInvariant(): void {
    if (this.value < 0) {
      throw new Error("Invariant violated: value must be >= 0");
    }
  }

  public increment(): void {
    // precondition: none needed

    this.value++;

    // postcondition: invariant still holds
    this.checkInvariant();
  }

  public getValue(): number {
    return this.value;
  }
}

export abstract class Upgrade {
  abstract multiplier: number;
  abstract cost: number;
  count: number = 0;

  purchase(currentValue: number): void {
    if (currentValue < this.cost) {
      throw new Error("Precondition violated: not enough points");
    }
    this.count++;
  }
}

export class AIFacilitatedChatBot extends Upgrade {
  cost = 10;
  multiplier = 2;
}

export class VibeCodingIntern extends Upgrade {
  cost = 5;
  multiplier = 1.5;
}

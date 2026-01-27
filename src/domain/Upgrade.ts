export abstract class Upgrade {
  abstract multiplier: number;
  abstract cost: number;
  count: number = 0;

  purchase(): void {
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

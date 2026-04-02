import modelData from "../training/model.json";
import type Player from "./Player/Player";

type Model = Record<string, Record<string, number>>;

export class RoboBuy {
  #on: boolean;
  #previousState: string;
  private model: Model;

  private mapping: Record<string, string> = {
    a: "Vibe Coding Intern",
    b: "AI-facilitated chatbot",
    c: "Fifty if-else statement",
    d: "Implement backend in JavaScript",
    e: "Implement frontend in Brainrot python",
    f: "Buying more claude tokens",
    g: "Calling all variables var",
    h: "Copy paste from StackOverflow",
    i: "Turn off type checking",
    j: "Ignore all warnings",
  };
  private reverseMapping: Record<string, string> = {
    "Vibe Coding Intern": "a",
    "AI-facilitated chatbot": "b",
    "Fifty if-else statement": "c",
    "Implement backend in JavaScript": "d",
    "Implement frontend in Brainrot python": "e",
    "Buying more claude tokens": "f",
    "Calling all variables var": "g",
    "Copy paste from StackOverflow": "h",
    "Turn off type checking": "i",
    "Ignore all warnings": "j",
  };

  constructor() {
    this.#on = false;
    this.#previousState = "a";
    this.model = modelData as Model;
  }

  public toggle(): void {
    this.#on = !this.#on;
  }

  public setState(state: string): void {
    this.#previousState = this.reverseMapping[state];
  }

  public run(p: Player): void {
    let next = this.#previousState;

    if (this.#on) {
      let success = false;

      while (!success) {
        next = this.getNextState(this.#previousState);
        const itemName = this.mapping[next];

        try {
          p.purchaseUpgrade(itemName);
          this.#previousState = next;
          success = true;
        } catch {
          //ignore if we can not afford it
        }
      }
    }

    return;
  }

  private getNextState(current: string): string {
    const transitions = this.model[current];

    let result = current;

    if (transitions) {
      const rand = Math.random();
      let cumulative = 0;
      let found = false;

      for (const next in transitions) {
        if (!found) {
          cumulative += transitions[next];

          if (rand <= cumulative) {
            result = next;
            found = true;
          }
        }
      }
    }

    return result;
  }
}

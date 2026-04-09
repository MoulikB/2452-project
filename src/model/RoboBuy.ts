import modelData from "../training/model.json";
import InsufficientBadCodeError from "./Player/InsufficientBadCodeError";
import type Player from "./Player/Player";

type Model = Record<string, Record<string, number>>;

/**
 * Automated buyer that uses a Markov chain model to decide which upgrade to purchase next.
 */
export class RoboBuy {
  #on: boolean;
  #previousState: string;
  private model: Model;
  readonly defaultStartingValue = "a";

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

  /**
   * Creates a RoboBuy instance starting from a given previous purchase state.
   *
   * @param previousPurchase the key (string) of the last purchased upgrade
   */
  constructor() {
    this.#on = false;
    this.#previousState = this.defaultStartingValue;
    this.model = modelData as Model;
  }

  /**
   * Toggles the auto-buyer on or off.
   */
  public toggle(): void {
    this.#on = !this.#on;
  }

  /**
   * Updates the previous state to reflect a manually purchased upgrade.
   *
   * @param state the display name of the purchased upgrade
   */
  public setState(state: string): void {
    this.#previousState = this.reverseMapping[state];
  }

  /**
   * If the auto-buyer is on, repeatedly picks the next upgrade via the Markov
   * model and attempts to purchase it until one succeeds.
   *
   * @param player the player whose upgrades will be purchased
   */
  public run(player: Player): void {
    if (this.#on) {
      let success = false;

      while (!success) {
        const next = this.getNextState(this.#previousState);
        const itemName = this.mapping[next];

        try {
          player.purchaseUpgrade(itemName);
          this.#previousState = next;
          success = true;
        } catch (error) {
          if (error instanceof InsufficientBadCodeError) return;
          // ignore if we cannot afford this upgrade — try the next one
        }
      }
    }
  }

  /**
   * Samples the next state from the transition probabilities using a
   * cumulative distribution (roulette-wheel selection).
   *
   * @param current the current state key (letter)
   * @return the chosen next state key
   */
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

import fs from "fs";

/**
 * Builds a Markov chain transition model from CSV training data
 * and serializes it to a JSON file.
 */
export default class TrainingModel {
  static readonly SIZE = 10; // number of upgrade states (a–j)
  static readonly ASCII_LOWERCASE_OFFSET = 97; // 'a'.charCodeAt(0)

  #tableNumerator: number[][];
  #tableDenominator: number[];

  public constructor() {
    this.#tableNumerator = Array.from({ length: TrainingModel.SIZE }, () =>
      new Array(TrainingModel.SIZE).fill(0),
    );
    this.#tableDenominator = new Array(TrainingModel.SIZE).fill(0);
  }

  /**
   * Converts a lowercase letter to a zero-based index.
   *
   * @param letter a single lowercase letter (a–j)
   * @return the corresponding index (a=0, b=1, ...)
   */
  static letterToIndex(letter: string): number {
    return letter.charCodeAt(0) - TrainingModel.ASCII_LOWERCASE_OFFSET;
  }

  /**
   * Reads the training CSV file and populates the transition count tables.
   */
  public fillTable(): void {
    const file = fs.readFileSync("src/training/data.csv", "utf-8");

    const lines = file.trim().split("\n");

    const data = lines.map((line) => line.split(","));

    this.processData(data);
  }

  /**
   * Counts transitions between states from the parsed CSV rows.
   *
   * @param data array of rows, each row being an ordered sequence of state keys
   */
  private processData(data: string[][]): void {
    for (const row of data) {
      let k = 0;
      while (k < row.length - 1) {
        const from = row[k];
        const to = row[k + 1];

        if (from && to) {
          const i = TrainingModel.letterToIndex(from);
          const j = TrainingModel.letterToIndex(to);

          // increment transition count from state i to state j
          this.#tableNumerator[i][j] += 1;
          this.#tableDenominator[i] += 1;
        }

        k++;
      }
    }

    this.buildModel();
  }

  /**
   * Computes transition probabilities from counts and triggers save.
   */
  private buildModel(): void {
    const model: Record<string, Record<string, number>> = {};

    let i = 0;
    while (i < TrainingModel.SIZE) {
      if (this.#tableDenominator[i] !== 0) {
        const fromLetter = String.fromCharCode(
          TrainingModel.ASCII_LOWERCASE_OFFSET + i,
        );
        model[fromLetter] = {};

        let j = 0;
        while (j < TrainingModel.SIZE) {
          const count = this.#tableNumerator[i][j];

          if (count > 0) {
            const toLetter = String.fromCharCode(
              TrainingModel.ASCII_LOWERCASE_OFFSET + j,
            );
            model[fromLetter][toLetter] = count / this.#tableDenominator[i];
          }

          j++;
        }
      }

      i++;
    }

    this.saveModel(model);
  }

  /**
   * Writes the model object to a JSON file.
   *
   * @param model the transition probability table to persist
   */
  private saveModel(model: object): void {
    fs.writeFileSync("src/training/model.json", JSON.stringify(model, null, 2));
    console.log("Model saved to model.json");
  }
}
new TrainingModel().fillTable();

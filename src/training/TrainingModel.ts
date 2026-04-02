import fs from "fs";

export default class TrainingModel {
  size = 10;
  #TableNumerator: number[][];
  #TableDenominator: number[];

  public constructor() {
    this.#TableNumerator = Array.from({ length: this.size }, () =>
      new Array(this.size).fill(0),
    );
    this.#TableDenominator = new Array(this.size).fill(0);
  }

  static letterToIndex(letter: string): number {
    return letter.charCodeAt(0) - 97; // a=0, b=1, ...
  }

  public fillTable(): void {
    const file = fs.readFileSync("src/training/data.csv", "utf-8");

    const lines = file.trim().split("\n");

    const data = lines.map((line) => line.split(","));

    this.processData(data);
  }

  private processData(data: any[]) {
    for (const row of data) {
      for (let k = 0; k < row.length - 1; k++) {
        const from = row[k];
        const to = row[k + 1];

        if (!from || !to) continue;

        const i = TrainingModel.letterToIndex(from);
        const j = TrainingModel.letterToIndex(to);

        // increment count
        this.#TableNumerator[i][j] += 1;
        this.#TableDenominator[i] += 1;
      }
    }

    this.buildModel();
  }

  private buildModel(): void {
    const model: Record<string, Record<string, number>> = {};

    for (let i = 0; i < this.size; i++) {
      if (this.#TableDenominator[i] === 0) continue;

      const fromLetter = String.fromCharCode(97 + i);
      model[fromLetter] = {};

      for (let j = 0; j < this.size; j++) {
        const count = this.#TableNumerator[i][j];

        if (count > 0) {
          const toLetter = String.fromCharCode(97 + j);
          model[fromLetter][toLetter] = count / this.#TableDenominator[i];
        }
      }
    }

    this.saveModel(model);
  }

  private saveModel(model: object): void {
    fs.writeFileSync("src/training/model.json", JSON.stringify(model, null, 2));
    console.log("Model saved to model.json");
  }
}
new TrainingModel().fillTable();

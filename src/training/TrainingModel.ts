import fs from "fs";
import * as path from "path";
import Papa from "papaparse";

export default class TrainingModel {
  size = 10;
  #TableNumerator: number[][];
  #TableDenominator: number[];

  public constructor() {
    this.#TableNumerator = Array.from({ length: this.size }, () =>
      new Array(this.size).fill(0),
    );
    this.#TableDenominator = new Array(this.size).fill(0);
    this.fillTable();
  }

  private letterToIndex(letter: string): number {
    return letter.charCodeAt(0) - 97; // a=0, b=1, ...
  }

  private fillTable(): void {
    const file = fs.readFileSync("src/training/data.csv", "utf8");

    Papa.parse(file, {
      header: false, // Assumes first row is header (a,b,c...)
      dynamicTyping: false, // Automatically converts numbers
      complete: (results) => {
        // results.data contains the array of row objects
        this.processData(results.data);
      },
      error: (error: any) => {
        console.error("Error parsing CSV:", error.message);
      },
    });
  }

  private processData(data: any[]) {
    for (const row of data) {
      for (let k = 0; k < row.length - 1; k++) {
        const from = row[k];
        const to = row[k + 1];

        if (!from || !to) continue;

        const i = this.letterToIndex(from);
        const j = this.letterToIndex(to);

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
new TrainingModel();

import { Counter } from "./domain/Counter";

const counter = new Counter();

const valueEl = document.getElementById("value")!;
const button = document.getElementById("inc")!;

button.addEventListener("click", () => {
  counter.increment();
  valueEl.textContent = counter.getValue().toString();
});

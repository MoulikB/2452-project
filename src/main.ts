import { Counter } from "./domain/Counter";
import { AIFacilitatedChatBot, VibeCodingIntern } from "./domain/Upgrade";

// Create upgrades
const chatbot = new AIFacilitatedChatBot();
const intern = new VibeCodingIntern();

// Create counter with upgrades
const counter = new Counter([chatbot, intern]);

// Grab view elements
const valueEl = document.getElementById("value")!;
const clickBtn = document.getElementById("click")!;
const chatbotBtn = document.getElementById("chatbot")!;
const internBtn = document.getElementById("intern")!;

// View update helper
function render(): void {
  valueEl.textContent = counter.getValue().toString();
}

// Click handler
clickBtn.addEventListener("click", () => {
  counter.increment();
  render();
});

// Upgrade handlers
chatbotBtn.addEventListener("click", () => {
  try {
    counter.spend(chatbot.cost);
    chatbot.purchase();
    render();
  } catch (e) {
    alert((e as Error).message);
  }
});

internBtn.addEventListener("click", () => {
  try {
    counter.spend(intern.cost);
    intern.purchase();
    render();
  } catch (e) {
    alert((e as Error).message);
  }
});

// Initial render
render();

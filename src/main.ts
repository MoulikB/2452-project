import GameController from "./controller/GameController";
import "./style.css";
import ddl from "../create-tables.sql?raw";
import db from "./model/connection.ts";
import TrainingModel from "./training/TrainingModel.ts";

// load the tables into the database:
db().exec(ddl);

new TrainingModel().fillTable;
// Everything has been delegated to the MVC model to keep the main as concise as possible.
// It creates a new instance of game controller which handles the rest
new GameController();

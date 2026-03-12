import Player from "./Player/Player";
export default class Account {
  #username: string;
  #password: string;
  #player: Player;

  constructor(username: string, password: string) {
    this.#username = username;
    this.#password = password;
    this.#player = new Player();
  }

  get username(): string {
    return this.#username;
  }

  get player(): Player {
    return this.#player;
  }
}

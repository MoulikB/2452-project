import Player from "../model/Player/Player.ts";
import db from "../model/connection.ts";
export default class Account {
  #username: string;
  #password: string;
  #player: Player;

  constructor(username: string, password: string) {
    this.#username = username;
    this.#password = password;
    this.#player = new Player(username, this);
  }

  get username(): string {
    return this.#username;
  }

  get player(): Player {
    return this.#player;
  }

  public static async saveAccount(account: Account): Promise<Account> {
    const existing = await db().query(
      "select username from account where username = $1",
      [account.username],
    );

    if (existing.rows.length === 0) {
      await db().query(
        "insert into account(username,password) values ($1,$2)",
        [account.username, account.#password],
      );
    }

    return account;
  }
}

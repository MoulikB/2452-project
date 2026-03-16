export class AccountService {
  private currentUser: string | null;

  public constructor() {
    this.currentUser = null;
  }

  public getCurrentUser(): string | null {
    return this.currentUser;
  }

  public isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  public logout(): void {
    this.currentUser = null;
  }

  public async register(username: string, password: string): Promise<boolean> {
    const existingUser = await db.query(
      "select username from account where username = $1",
      [username],
    );

    if (existingUser.length > 0) {
      return false;
    }

    const passwordHash = await hashPassword(password);

    await db.query(
      "insert into account (username, passwordHash) values ($1, $2)",
      [username, passwordHash],
    );

    await db.query("insert into player (username) values ($1)", [username]);

    return true;
  }

  public async login(username: string, password: string): Promise<boolean> {
    const rows = await db.query(
      "select passwordHash from account where username = $1",
      [username],
    );

    if (rows.length === 0) {
      return false;
    }

    const storedHash = rows[0].passwordhash;
    const matches = await verifyPassword(password, storedHash);

    if (!matches) {
      return false;
    }

    this.currentUser = username;
    return true;
  }
}

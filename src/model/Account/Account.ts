import Player from "../Player/Player.ts";
import db from "../connection.ts";

/**
 * Represents a user account in the system.
 * Handles authentication, password hashing, and persistence.
 */
export default class Account {
  #username: string;
  #password: string; // raw password (only used temporarily)
  #passwordHash!: string; // stored hashed password
  #player!: Player;
  salt!: string; // stored salt (hex format)

  /**
   * Creates a new Account instance.
   * Also initializes a Player tied to this account.
   */
  private constructor(username: string, password: string) {
    this.#username = username;
    this.#password = password;
  }

  public static async create(
    username: string,
    password: string,
  ): Promise<Account> {
    const account = new Account(username, password);

    account.#player = await Player.create(username);

    return account;
  }

  // Returns the username of the account
  get username(): string {
    return this.#username;
  }

  // Returns the player associated with this account
  get player(): Player {
    return this.#player;
  }

  // Returns the raw password (used only before hashing)
  get password(): string {
    return this.#password;
  }

  // Updates the player reference
  set player(player: Player) {
    this.#player = player;
  }

  /**
   * Saves the account to the database.
   * - Hashes the password
   * - Stores hash + salt
   * - Inserts only if account does not already exist
   */
  public static async saveAccount(account: Account): Promise<Account> {
    const { hash, salt } = await account.hashPassword(account.#password);

    const hashHex = account.#toHex(hash);
    const saltHex = account.#toHex(salt);

    account.#passwordHash = hashHex;
    account.salt = saltHex;

    // Check if account already exists
    const existing = await db().query(
      "select username from account where username = $1",
      [account.username],
    );

    // Insert only if not found
    if (existing.rows.length === 0) {
      await db().query(
        "insert into account(username,password,salt) values ($1,$2,$3)",
        [account.username, hashHex, saltHex],
      );
    }

    return account;
  }

  /**
   * Converts byte array to hex string (for storage in DB)
   */
  #toHex(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  /**
   * Converts hex string back to byte array (for hashing verification)
   */
  fromHex(hex: string): Uint8Array {
    const bytes = new Uint8Array(
      hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
    );

    return new Uint8Array(bytes.buffer);
  }

  /**
   * Loads an account from the database using username.
   * Returns null if account does not exist.
   */
  public static async loadAccount(username: string): Promise<Account | null> {
    const results = await db().query<{
      username: string;
      password: string;
      salt: string;
    }>(
      `select username, password, salt
       from account
       where username = $1`,
      [username],
    );

    if (results.rows.length === 0) {
      return null;
    }

    const row = results.rows[0];

    // Create account with empty password (we only store hash)
    const account = new Account(row.username, "");
    account.#passwordHash = row.password;
    account.salt = row.salt;

    return account;
  }

  /**
   * Hashes a password using PBKDF2 with a random salt.
   * Returns both the hash and the salt.
   */
  async hashPassword(password: string) {
    const enc = new TextEncoder(); // converts string → bytes for crypto API

    // Convert password into a key format usable by PBKDF2
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password), // encode password into byte array
      { name: "PBKDF2" },
      false,
      ["deriveBits"],
    );

    const salt = crypto.getRandomValues(new Uint8Array(16));
    // generate random salt (prevents same passwords having same hash)

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt, // unique salt for this password
        iterations: 100000, // slows down brute-force attacks
        hash: "SHA-256",
      },
      keyMaterial,
      256, // output length in bits
    );

    return {
      hash: new Uint8Array(derivedBits), // convert result to byte array
      salt,
    };
  }

  /**
   * Verifies if the input password matches the stored password.
   * Recomputes hash using stored salt and compares.
   */
  async verifyPassword(inputPassword: string): Promise<boolean> {
    const enc = new TextEncoder(); // encode input password

    // Recreate key from user input password
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(inputPassword),
      { name: "PBKDF2" },
      false,
      ["deriveBits"],
    );

    const rawSalt = this.fromHex(this.salt);
    // convert stored hex salt back into bytes

    const saltBytes = new Uint8Array([...rawSalt]);
    // ensure it's a proper Uint8Array for crypto API

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: saltBytes, // must use SAME salt as when password was created
        iterations: 100000, // must match original hashing settings
        hash: "SHA-256",
      },
      keyMaterial,
      256,
    );

    const hashHex = this.#toHex(new Uint8Array(derivedBits));
    // convert computed hash to hex for comparison

    return hashHex === this.#passwordHash;
    // check if computed hash matches stored hash
  }
}

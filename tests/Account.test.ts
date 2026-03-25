import { test, expect } from "vitest";
import Account from "../src/model/Account/Account";
import db from "../src/model/connection";
import Player from "../src/model/Player/Player";

test("account initializes with username and password", async () => {
  const account = await Account.create("user1", "pw");

  expect(account.username).toBe("user1");
  expect(account.password).toBe("pw");
  expect(account.player).toBeDefined();
});

test("saveAccount inserts account into database", async () => {
  const username = "test_" + Math.random();

  const account = await Account.create(username, "pw");

  await Account.saveAccount(account);

  const result = await db().query(
    "select username from account where username = $1",
    [username],
  );

  expect(result.rows.length).toBe(1);
  expect(result.rows[0].username).toBe(username);
});

test("set player updates the account player reference", async () => {
  const account = await Account.create("user1", "pw");

  const newPlayer = await Player.create("name");

  account.player = newPlayer;

  expect(account.player).toBe(newPlayer);
});

test("saveAccount does not duplicate existing accounts", async () => {
  const username = "test_" + Math.random();

  const account = await Account.create(username, "pw");

  await Account.saveAccount(account);
  await Account.saveAccount(account);

  const result = await db().query(
    "select username from account where username = $1",
    [username],
  );

  expect(result.rows.length).toBe(1);
});

test("loadAccount returns account if it exists", async () => {
  const username = "test_" + Math.random();

  const account = await Account.create(username, "pw");
  await Account.saveAccount(account);

  const loaded = await Account.loadAccount(username);

  expect(loaded).not.toBeNull();
  expect(loaded!.username).toBe(username);
  const valid = await loaded!.verifyPassword("pw");
  expect(valid).toBe(true);
});

test("verifyPassword returns true for correct password", async () => {
  const username = "test_" + Math.random();

  const account = await Account.create(username, "pw");
  await Account.saveAccount(account);

  const loaded = await Account.loadAccount(username);

  const valid = await loaded!.verifyPassword("pw");

  expect(valid).toBe(true);
});

test("verifyPassword returns false for incorrect password", async () => {
  const username = "test_" + Math.random();

  const account = await Account.create(username, "pw");
  await Account.saveAccount(account);

  const loaded = await Account.loadAccount(username);

  const valid = await loaded!.verifyPassword("wrong");

  expect(valid).toBe(false);
});

test("loadAccount returns null for non-existent account", async () => {
  const loaded = await Account.loadAccount("does_not_exist");

  expect(loaded).toBeNull();
});

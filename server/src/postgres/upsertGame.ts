import { Game } from "@fishbowl/common";
import { pool } from "./db";
import { sql } from "slonik";

export async function upsertGame(game: Game) {
  const { gameCode } = game;
  if (!gameCode || typeof gameCode !== "string") {
    throw new Error("game state must have a gameCode and it must be a string");
  }

  const serializedGame = JSON.stringify(game);

  await pool.any(sql`
    INSERT INTO games (game_code, state)
    VALUES (${gameCode}, ${serializedGame})
    ON CONFLICT (game_code) DO UPDATE
    SET state = ${serializedGame};
  `);
}

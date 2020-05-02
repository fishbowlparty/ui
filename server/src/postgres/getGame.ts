import { Game } from "@fishbowl/common";
import { pool } from "./db";
import { sql } from "slonik";

interface Row {
  game_code: string;
  state: Game;
}

export async function getGame(id: string) {
  const row = await pool.maybeOne<Row>(
    sql`select * from games where game_code = ${id};`
  );
  return row?.state;
}

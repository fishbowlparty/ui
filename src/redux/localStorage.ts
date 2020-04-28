import { v4 } from "uuid";
import { Player } from "./types";

export const initializePlayerId = () => {
  if (localStorage.getItem("PLAYER_ID") == null) {
    localStorage.setItem("PLAYER_ID", v4());
  }
};

export const setPlayerName = (name: string) => {
  localStorage.setItem("PLAYER_NAME", name);
};

export const getPlayer = (): Player => ({
  id: localStorage.getItem("PLAYER_ID") || "",
  name: localStorage.getItem("PLAYER_NAME") || "",
});

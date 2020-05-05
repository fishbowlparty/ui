import { v4 } from "uuid";

export const initializePlayerId = () => {
  if (localStorage.getItem("PLAYER_ID") == null) {
    localStorage.setItem("PLAYER_ID", id);
  }
};

export const setPlayerName = (name: string) => {
  localStorage.setItem("PLAYER_NAME", name);
};

export const getPlayer = (): { id: string; name: string } => ({
  id: localStorage.getItem("PLAYER_ID") || "",
  name: localStorage.getItem("PLAYER_NAME") || "",
});

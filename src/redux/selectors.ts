import { Card, Game, Player } from "./types";

export const selectHost = (game: Game): Player => {
  const { hostId, players } = game;

  return players[hostId];
};

export const selectCards = (game: Game): Record<string, Card> => {
  return Object.values(game.playerCards)
    .flatMap((cards) => cards)
    .reduce((cardMap, card) => {
      return {
        ...cardMap,
        [card.id]: card,
      };
    }, {} as Record<string, Card>);
};

export const selectNumberOfPlayers = (game: Game): number => {
  return Object.keys(game.players).length;
};

export const selectOrderedPlayers = (game: Game): Player[] =>
  Object.values(game.players).sort((a, b) => a.joinOrder - b.joinOrder);

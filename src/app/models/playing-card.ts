import { CardSuit } from "./card-suit";
import { CardRank } from "./card-rank";

export class PlayingCard {
    suit: CardSuit = CardSuit.Club;
    rank: CardRank = CardRank.Ace;
    flipped = false;
}
import { Injectable } from '@angular/core';
import { PlayingCard } from '../models/playing-card';
import { CardRank } from '../models/card-rank';
import { CardSuit } from '../models/card-suit';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor() { }

  get52Cards(): PlayingCard[] {
    const cards = [];

    for (const suit in CardSuit) {
      if (isNaN(Number(suit))) {
        for (const rank in CardRank) {
          if (isNaN(Number(rank))) {
            const card = new PlayingCard();
            card.suit = CardSuit[suit as keyof typeof CardSuit];
            card.rank = CardRank[rank as keyof typeof CardRank];
            cards.push(card);
          }
        }
      }
    }
    return cards;
  }

  shuffleCards(cards: PlayingCard[]): PlayingCard[] {
    return cards.sort(() => Math.random() - 0.5)
  }

  getRankText(rank: CardRank | undefined): string {
    switch (rank) {
      case CardRank.Ace:
        return "A";
      case CardRank.Two:
        return "2";
      case CardRank.Three:
        return "3";
      case CardRank.Four:
        return "4";
      case CardRank.Five:
        return "5";
      case CardRank.Six:
        return "6";
      case CardRank.Seven:
        return "7";
      case CardRank.Eight:
        return "8";
      case CardRank.Nine:
        return "9";
      case CardRank.Ten:
        return "10";
      case CardRank.Jack:
        return "D";
      case CardRank.Queen:
        return "D";
      case CardRank.King:
        return "R";
      default:
        return "";
    }
  }

  getSuitText(suit: CardSuit | undefined) {
    switch (suit) {
      case CardSuit.Club:
        return "club";
      case CardSuit.Diamond:
        return "diamond";
      case CardSuit.Heart:
        return "heart";
      case CardSuit.Spade:
        return "spade";
      default:
        return "";
    }
  }

}

import { Component, Input } from '@angular/core';
import { PlayingCard } from '../../models/card';
import { CardRank } from '../../models/card-rank';
import { CardSuit } from '../../models/card-suit';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() card: PlayingCard | undefined;
  

  getCartSuit(suit: CardSuit | undefined): string {
    switch (suit) {
      case CardSuit.Club:
        return "C";
      case CardSuit.Diamond:
        return "D";
      case CardSuit.Heart:
        return "H";
      case CardSuit.Spade:
        return "S";
      default:
        return "";
    }
  }

  getCardRank(rank: CardRank | undefined): string {
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
        return "J";
      case CardRank.Queen:
        return "Q";
      case CardRank.King:
        return "K";
      default:
        return "";
    }
  }
}

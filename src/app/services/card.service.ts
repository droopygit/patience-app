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

    // Get groups of cards
    let groupsOfCards = this.createGroupsOfCards(cards);
  
    let currentIndex = groupsOfCards.length
    let randomIndex = 0;
  
    // While there remain elements to shuffle
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element
      [groupsOfCards[currentIndex], groupsOfCards[randomIndex]] = [
        groupsOfCards[randomIndex], groupsOfCards[currentIndex]];
    }
  
    return groupsOfCards.flat();
  }

  createGroupsOfCards(cards: PlayingCard[]): PlayingCard[][] {
    
    // Create groups of cards
    const groups: PlayingCard[][] = [];
    let currentGroup: PlayingCard[] = [];

    // Randomly select a group length
    let currentGroupLength = Math.floor(Math.random() * 4) + 2;

    // Create groups
    for (let i = 0; i < cards.length; i++) {

      currentGroup.push(cards[i]);

      if (currentGroup.length === currentGroupLength) {
        groups.push([...currentGroup]);
        currentGroup = [];

        // Randomly select a new group length
        currentGroupLength = Math.floor(Math.random() * 4) + 2;
      }
    }

    if (currentGroup.length > 0) {
      groups.push([...currentGroup]);
    }

    return groups;
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
        return "V";
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

  getSuitColor(suit: CardSuit | undefined) {
    switch (suit) {
      case CardSuit.Club:
        return "black";
      case CardSuit.Diamond:
        return "red";
      case CardSuit.Heart:
        return "red";
      case CardSuit.Spade:
        return "black";
      default:
        return "";
    }
  }

}

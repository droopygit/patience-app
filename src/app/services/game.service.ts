import { Injectable } from '@angular/core';
import { PlayingCard } from '../models/card';
import { CardRank } from '../models/card-rank';
import { CardSuit } from '../models/card-suit';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  draw: PlayingCard[] = [];
  revealed: PlayingCard[] = [];

  constructor() { }

  startGame() {

    // Clear
    this.draw = [];
    this.revealed = [];

    // Add 2 x 52 card decks
    this.draw.push(...this.get52Cards(), ...this.get52Cards());

    // Shuffle the cards
    this.shuffleCards();
  }

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

  createCards() {

    this.draw.push(...this.get52Cards(), ...this.get52Cards());
  }

  shuffleCards() {
    this.draw = this.draw.sort(() => Math.random() - 0.5);
  }

  revealCard() {
    if (this.draw.length > 0) { 
      this.revealed.push(this.draw.pop()!);
    }
  }
}

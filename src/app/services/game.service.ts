import { Injectable } from '@angular/core';
import { PlayingCard } from '../models/playing-card';
import { CardRank } from '../models/card-rank';
import { CardSuit } from '../models/card-suit';
import { CardService } from './card.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  draw: PlayingCard[] = [];
  revealed: PlayingCard[] = [];

  constructor(
    private cardService: CardService
  ) { }

  startGame() {

    // Clear the game
    this.draw = [];
    this.revealed = [];

    // Add 2 x 52 card decks
    this.createCards();

    // Shuffle the cards
    this.shuffleCards();
  }

  createCards() {
    this.draw.push(...this.cardService.get52Cards(), ...this.cardService.get52Cards());
  }

  shuffleCards() {
    this.draw = this.cardService.shuffleCards(this.draw).map(c => {
      c.flipped = true;
      return c;
    });
  }

  revealCard() {
    if (this.draw.length > 0) { 
      const card = this.draw.pop()!;
      card.flipped = false;
      this.revealed.push(card);
    }
  }
  
}

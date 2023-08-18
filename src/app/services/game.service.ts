import { Injectable } from '@angular/core';
import { PlayingCard } from '../models/playing-card';
import { CardService } from './card.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  draw: PlayingCard[] = [];
  revealed: PlayingCard[] = [];
  selectedCard: PlayingCard | undefined;
  headerColumnCards: PlayingCard[][] = [[], [], [], [], [], [], [], []];
  columnCards: PlayingCard[][] = [[], [], [], [], [], [], [], []];

  constructor(
    private cardService: CardService
  ) { }

  startGame() {

    // Clear the game
    this.draw = [];
    this.revealed = [];
    this.headerColumnCards = [[], [], [], [], [], [], [], []];
    this.columnCards = [[], [], [], [], [], [], [], []];
    this.selectedCard = undefined;

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

  selectOrDeselectCard(card: PlayingCard | undefined) {
    if (this.selectedCard && this.selectedCard === card) {
      this.selectedCard = undefined;
    } else if (this.selectedCard === undefined) {
      this.selectedCard = card;

    }
  }

  revealCard() {
    if (this.draw.length > 0) {
      this.selectedCard = undefined;
      const card = this.draw.pop()!;
      card.flipped = false;
      this.revealed.push(card);
    }
  }

  moveSelectedCardToColumn(index: number) {

    if (this.selectedCard === undefined) {
      return
    }

    // Check if it's possible to move the card here
    if (this.columnCards[index].length > 0) {
      const lastCard = this.columnCards[index][this.columnCards[index].length - 1];
      if (this.revealed.length > 0 && lastCard === undefined) {
        return;
      }

      // Card must be of the other color
      if (this.cardService.getSuitColor(lastCard.suit) === this.cardService.getSuitColor(this.selectedCard.suit)) {
        return;
      }

      // Card must be just one rank higher
      if (lastCard.rank - 1 !== this.selectedCard.rank) {
        return;
      }
    }

    // Remove from source
    if (this.revealed.includes(this.selectedCard)) {
      this.revealed.pop();
    } else {
      for (const cards of this.columnCards) {
        if (cards.includes(this.selectedCard)) {
          cards.pop();
          break;
        }
      }
    }

    // Add to target
    this.columnCards[index].push(this.selectedCard);

    // Remove selection
    this.selectedCard = undefined;
  }
}
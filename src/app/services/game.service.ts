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
      console.log("card selected");
      
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
    if (this.selectedCard) {
      
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

}

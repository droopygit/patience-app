import { Injectable } from '@angular/core';
import { PlayingCard } from '../models/playing-card';
import { CardService } from './card.service';
import { CardRank } from '../models/card-rank';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  draw: PlayingCard[] = [];
  selectedCard: PlayingCard | undefined;
  headerColumnCards: PlayingCard[][] = [[], [], [], [], [], [], [], []];
  columnCards: PlayingCard[][] = [[], [], [], [], [], [], [], []];

  constructor(
    private cardService: CardService
  ) { }

  startGame() {

    // Clear the game
    this.draw = [];
    this.headerColumnCards = [[], [], [], [], [], [], [], []];
    this.columnCards = [[], [], [], [], [], [], [], []];
    this.selectedCard = undefined;

    // Add 2 x 52 card decks
    this.createCards();

    // Shuffle the cards
    this.shuffleCards();

    // Deal cards
    this.dealCards();
  }

  dealCards() {
    for (let i = 0; i < 8; i++) {
      const newCard = this.draw.pop()!;
      newCard.flipped = false;
      this.columnCards[i].push(newCard);
    }
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

      // Remove selection
      this.selectedCard = undefined;

    } else if (this.selectedCard === undefined && card !== undefined) {

      // Check if it's possible to select this card
      for (const cards of this.columnCards) {
        const index = cards.indexOf(card);
        
        // if no card found we continue
        if (index === -1) {
          continue;
        }
        
        // if the card found is the last one in the column
        // we can select
        if (index === cards.length - 1) {
          this.selectedCard = card;
          break;

          // else we check rule for all cards after the one found
        } else {

          const canSelect = cards.slice(index).every((c, i) => {
            const nextCard = cards[index + i + 1];
            if (nextCard === undefined) {
              return true;
            }
            return this.checkColumnRule(c, nextCard);
          });

          if (canSelect) {
            this.selectedCard = card;
          }
          break;
        }
      }
    }
  }

  checkColumnRule(card: PlayingCard, nextCard: PlayingCard): boolean {

    // Card must be of the other color
    if (this.cardService.getSuitColor(card.suit) === this.cardService.getSuitColor(nextCard.suit)) {
      return false;
    }

    // Card must be just one rank higher
    if (card.rank - 1 !== nextCard.rank) {
      return false;
    }

    return true;
  }

  moveSelectedCardToColumn(index: number) {

    if (this.selectedCard === undefined) {
      return
    }

    // Check if it's possible to move the card here
    if (this.columnCards[index].length > 0) {
      const lastCard = this.columnCards[index][this.columnCards[index].length - 1];

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
    let target: PlayingCard[] = [];

    // The card is in a column
    for (const cards of this.columnCards) {
      const index = cards.indexOf(this.selectedCard);
      if (index > -1) {

        // Remove all cards from index to end
        target.push(...cards.splice(index, cards.length));
        break;
      }
    }

    // Add to target
    this.columnCards[index].push(...target);

    // Remove selection
    this.selectedCard = undefined;
  }

  moveSelectedCardToHeaderColumn(index: number) {

    // Check if there is a selected card
    if (this.selectedCard === undefined) {
      return;
    }

    // Check if the card is the last card in the column
    let sourceIndex: number | undefined = undefined;
    for (let i = 0; i < this.columnCards.length; i++) {
      const cards = this.columnCards[i];
      if (cards[cards.length - 1] === this.selectedCard) {
        sourceIndex = i;
        break;
      }
    }

    // Check if we can move it
    let lastCard: PlayingCard | undefined = undefined;
    if (this.headerColumnCards[index].length > 0) {
      lastCard = this.headerColumnCards[index][this.headerColumnCards[index].length - 1];
    }
    if (this.checkHeaderColumnRule(lastCard, this.selectedCard)) {
        
      // Move the card
      this.headerColumnCards[index].push(this.columnCards[sourceIndex!].pop()!);
      this.selectedCard = undefined;
    }
  }

  checkHeaderColumnRule(card: PlayingCard | undefined, nextCard: PlayingCard): boolean {

    // If it's the first card it must be an Ace
    if (card === undefined && nextCard.rank === CardRank.Ace) {
      return true;
    }

    // if it's not the first card, it must be of the same suit 
    // and just one rank higher
    if (card !== undefined && card.suit === nextCard.suit && card.rank === nextCard.rank - 1) {
      return true;
    }

    return false;
  }
}
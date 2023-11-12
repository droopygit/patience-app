import { Injectable } from '@angular/core';
import { PlayingCard } from '../models/playing-card';
import { CardService } from './card.service';
import { CardRank } from '../models/card-rank';
import { HistoryService } from './state.service';
import { State } from '../models/state';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  selectedCard: PlayingCard | undefined;
  state: State = new State();

  constructor(
    private cardService: CardService,
    private historyService: HistoryService
  ) {

    // Try to restore a game
    const state = this.historyService.restore();
    if (state) {
      this.state = state;
    } else {
      this.startGame();
    }
  }

  startGame() {

    // Clear the history
    this.historyService.clear();

      // If there is already a game we use it to create the new draw
    if (this.state.columnCards.flat().length > 0 || this.state.headerColumnCards.flat().length > 0) {

      // We append the column cards and the header column cards to the draw
      this.state.draw.push(...this.state.headerColumnCards.flat(), ...this.state.columnCards.flat());
      
      // Clear the columns
      this.state.columnCards = [[], [], [], [], [], [], [], []];
      this.state.headerColumnCards = [[], [], [], [], [], [], [], []];
    
    } else {

      // Clear the game
      this.state = new State();

      // Add 2 x 52 card decks
      this.createCards();
    }

    // Remove selected card
    this.selectedCard = undefined;

    // Shuffle the cards two times
    this.shuffleCards();
    this.shuffleCards();

    // Deal cards
    this.dealCards();
  }

  sleep() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }

  async dealCards() {

    // Remove selection
    this.selectedCard = undefined;

    for (let i = 0; i < 8; i++) {
      const newCard = this.state.draw.pop()!;
      if (newCard === undefined) {
        break;
      }
      newCard.flipped = false;
      await this.sleep();
      this.state.columnCards[i].push(newCard);
    }

    // Save the game
    this.historyService.save(this.state);
  }

  createCards() {
    this.state.draw.push(...this.cardService.get52Cards(), ...this.cardService.get52Cards());
  }

  shuffleCards() {
    this.state.draw = this.cardService.shuffleCards(this.state.draw).map(c => {
      c.flipped = true;
      return c;
    });
  }

  selectOrDeselectCard(card: PlayingCard | undefined): boolean {

    if (this.selectedCard && this.selectedCard === card) {

      // Remove selection
      this.selectedCard = undefined;
      return true;

    } else if (this.selectedCard === undefined && card !== undefined) {

      // Check if it's possible to select this card from column
      for (const cards of this.state.columnCards) {
        const index = cards.indexOf(card);

        // if no card found we continue
        if (index === -1) {
          continue;
        }

        // if the card found is the last one in the column
        // we can select
        if (index === cards.length - 1) {
          this.selectedCard = card;
          return true;

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
          return true;
        }
      }

      // Check if it's possible to select this card from header column
      for (const cards of this.state.headerColumnCards) {
        if (cards[cards.length - 1] === card) {
          this.selectedCard = card;
          return true;
        }
      }
    }

    return false;
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
    if (this.state.columnCards[index].length > 0) {

      // Get last card of the column
      const lastCard = this.state.columnCards[index][this.state.columnCards[index].length - 1];

      // Card must be of the other color
      if (this.cardService.getSuitColor(lastCard.suit) === this.cardService.getSuitColor(this.selectedCard.suit)) {
        return;
      }

      // Card must be just one rank higher
      if (lastCard.rank - 1 !== this.selectedCard.rank) {
        return;
      }
    } else {

      // The first card of the column must be a king
      if (this.selectedCard.rank !== CardRank.King) {
        return;
      }
    }

    // Remove from source
    let target: PlayingCard[] = [];

    // The card is in a column
    for (const cards of this.state.columnCards) {
      const index = cards.indexOf(this.selectedCard);
      if (index > -1) {

        // Remove all cards from index to end
        target.push(...cards.splice(index, cards.length));
        break;
      }
    }

    // If not found on columns, see if it's in a header column 
    if (target.length === 0) {

      for (const cards of this.state.headerColumnCards) {
        if (cards[cards.length - 1] === this.selectedCard) {
          target.push(...cards.splice(cards.length - 1, cards.length));
          break;
        }
      }
    }

    // Add to target
    this.state.columnCards[index].push(...target);

    // Remove selection
    this.selectedCard = undefined;

    // Save the state
    this.historyService.save(this.state);
  }

  moveSelectedCardToHeaderColumn(index: number) {

    // Check if there is a selected card
    if (this.selectedCard === undefined) {
      return;
    }

    // Check if the card is the last card in one column
    let sourceIndex: number | undefined = undefined;
    for (let i = 0; i < this.state.columnCards.length; i++) {
      const cards = this.state.columnCards[i];
      if (cards[cards.length - 1] === this.selectedCard) {
        sourceIndex = i;
        break;
      }
    }

    // Check if we can move it
    let lastCard: PlayingCard | undefined = undefined;
    if (this.state.headerColumnCards[index].length > 0) {
      lastCard = this.state.headerColumnCards[index][this.state.headerColumnCards[index].length - 1];
    }
    if (this.checkHeaderColumnRule(lastCard, this.selectedCard)) {

      // Move the card
      this.state.headerColumnCards[index].push(this.state.columnCards[sourceIndex!].pop()!);
      this.selectedCard = undefined;

      // Save the state
      this.historyService.save(this.state);
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

  undo() {
    const previousState = this.historyService.undo();
    if (previousState) {
      console.log(previousState);

      this.state = previousState;
    }
  }
}
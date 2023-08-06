import { Component, Input } from '@angular/core';
import { PlayingCard } from '../../models/playing-card';
import { CardRank } from '../../models/card-rank';
import { CardSuit } from '../../models/card-suit';
import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input() card: PlayingCard | undefined;

  cardSuit = CardSuit;
  cardRank = CardRank;

  constructor(public cardService: CardService) { }
}

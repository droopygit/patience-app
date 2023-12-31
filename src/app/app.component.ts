import { Component } from '@angular/core';
import { faPlus, faUndo, faSquareCaretUp } from '@fortawesome/free-solid-svg-icons';
import 'playing-card';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  faPlus = faPlus;
  faUndo = faUndo;
  faSquareCaretUp = faSquareCaretUp;

  constructor(public gameService: GameService) {
  }

  startNewGame() {
    if (confirm("Êtes-vous sûr de vouloir commencer une nouvelle partie ?")) {
      this.gameService.startGame();
    }
  }

  undo() {
    if (confirm("Êtes-vous sûr de vouloir annuler votre dernier coup ?")) {
      this.gameService.undo();
    }
  }
  
}

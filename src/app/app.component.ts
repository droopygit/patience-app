import { Component } from '@angular/core';
import { faPlus, faUndo } from '@fortawesome/free-solid-svg-icons';
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

  constructor(public gameService: GameService) {
    gameService.startGame();
  }

  startNewGame() {
    if (confirm("Êtes-vous sûr de vouloir commencer une nouvelle partie ?")) {
      this.gameService.startGame();
    }
  }
  

}

import { Component } from '@angular/core';
import 'playing-card';
import { faPlus, faUndo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  faPlus = faPlus;
  faUndo = faUndo;
}

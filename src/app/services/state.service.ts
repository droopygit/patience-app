import { Injectable } from '@angular/core';
import { GameService } from './game.service';
import { State } from '../models/state';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private stateKey = "states";
  private states: State[] = [];

  constructor() {
  }

  saveState(state: State) {
    const stateAsString = JSON.stringify(state);
    this.states.push(JSON.parse(stateAsString));
    localStorage.setItem(this.stateKey, JSON.stringify(this.states));
  }

  restoreState(): State | undefined {
    const statesAsString = localStorage.getItem(this.stateKey);
    if (statesAsString) {
      this.states = JSON.parse(statesAsString);
      return this.states[this.states.length - 1];
    }
    return undefined;
  }

  clearState() {
    this.states = [];
    localStorage.removeItem(this.stateKey);
  }

  undo(): State | undefined {
    this.states.pop();
    localStorage.setItem(this.stateKey, JSON.stringify(this.states));
    if (this.states.length > 0) {
      return this.states[this.states.length - 1];
    }
    return undefined;
  }
}

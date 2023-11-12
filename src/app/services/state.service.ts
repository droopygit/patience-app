import { Injectable } from '@angular/core';
import { State } from '../models/state';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private stateKey = "states";
  private history: State[] = [];

  constructor() {
  }

  save(state: State) {
    const stateAsString = JSON.stringify(state);
    this.history.push(JSON.parse(stateAsString));
    localStorage.setItem(this.stateKey, JSON.stringify(this.history));
  }

  restore(): State | undefined {
    const statesAsString = localStorage.getItem(this.stateKey);
    if (statesAsString) {      
      this.history = JSON.parse(statesAsString);
      return this.history[this.history.length - 1];
    }
    return undefined;
  }

  clear() {
    this.history = [];
    localStorage.removeItem(this.stateKey);
  }

  undo(): State | undefined {
    this.history.pop();
    localStorage.setItem(this.stateKey, JSON.stringify(this.history));
    if (this.history.length > 0) {
      return this.history[this.history.length - 1];
    }
    return undefined;
  }
}

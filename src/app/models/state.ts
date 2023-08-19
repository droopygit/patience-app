import { PlayingCard } from "./playing-card";

export class State {
    draw: PlayingCard[] = [];
    headerColumnCards: PlayingCard[][] = [[], [], [], [], [], [], [], []];
    columnCards: PlayingCard[][] = [[], [], [], [], [], [], [], []];
}
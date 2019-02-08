
export interface Message {
    key: string;
    body: any;
}

export interface Coord {
    x: number;
    y: number;
}

export interface Task {
    start: Coord;
    end: Coord;
}

export interface Macro {
    id: number;
    name: string;
    tasks: Task[];
}

export interface Pawn {
    position: Coord;

    obstacle: boolean;
    id: number;

    name: string;
    color: string;
    shape: string[];
}
export interface RootState { }

export interface MacroState {
    macro: Macro;
    editing: boolean;
}

export interface PawnState {
    pawns: { [coord: string]: Pawn };
    adding: boolean;
    selected: Coord;
    hover: Coord;
}

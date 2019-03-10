
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
    owner: string;
}

export interface Macro {
    id: number;
    name: string;
    tasks: Task[];
}

export interface Group {
    name: string;
    pawns: { [id: string]: Pawn };
}

export interface DisplayGroup extends Group {
    minimized: boolean;

    order: number;
    initiative: number;
}

// The position and meta information related to an object on the board
export interface Pawn {
    id: string; // Unchangeable unique identifier 
    name: string; // User changeable unique identifier
    group: string;
    position: Coord;

    obstacle: boolean;

    color: string;
    shape: string[];
}

export enum PawnTabs {
    Pawns = 'Pawns',
    Obstacles = 'Obstacles'
}

export interface RootState { }

export interface MacroState {
    macro: Macro;
    editing: boolean;
}

export interface PawnState {
    groups: { [name: string]: DisplayGroup };
    tab: PawnTabs;
    adding: boolean;
    selected: Coord;
    hover: Coord;
}

export interface SettingsState {
    name: string;
}

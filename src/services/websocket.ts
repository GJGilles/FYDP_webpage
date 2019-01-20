
interface Message {
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

export const ENDPOINTS = {
    CONNECT: 'connection',
    ADD_MOVE: 'add_move',
    REMOVE_MOVE: 'remove_move',
    GET_COORDS: 'get_coords',

    PAUSE_QUEUE: 'pause_queue',
    PLAY_QUEUE: 'play_queue',
    REORDER_QUEUE: 'reorder_queue',
    GET_QUEUE: 'get_queue',

    SCAN_GRID: 'scan_grid',

    CREATE_MACRO: 'create_macro',
    UPDATE_MACRO: 'update_macro',
    REMOVE_MACRO: 'remove_macro',
    GET_MACROS: 'get_macros',
};

export const SIGNALS = {
    UPDATED_COORDS: 'updated_coords',
    UPDATED_QUEUE: 'updated_queue',
    UPDATED_QUEUE_STATE: 'updated_queue_state',
    UPDATED_MACROS: 'updated_macros',

    SCANNING_GRID: 'scanning_grid',
    SCANNED_GRID: 'scanned_grid',

    ERROR: 'error', // General error signal, may add more specific errors later
};

class DataService {
    private ws: WebSocket = new WebSocket('ws://localhost:8080'); // Server path
    private connected: Promise<any> = Promise.resolve();

    private callbacks: { [key: string]: Array<(...params: any[]) => void> } = {};

    constructor() {
        this.connected = new Promise((resolve) => {
            this.ws.onopen = () => resolve();
        });
        this.ws.onmessage = this.alert;
    }

    public addMove = (start: Coord, end: Coord) => {
        return this.send(ENDPOINTS.ADD_MOVE, { start, end });
    }

    public removeMove = (index: number) => {
        return this.send(ENDPOINTS.REMOVE_MOVE, index);
    }

    public getCoords = () => {
        return this.send(ENDPOINTS.GET_COORDS);
    }

    public pauseQueue = () => {
        return this.send(ENDPOINTS.PAUSE_QUEUE);
    }

    public playQueue = () => {
        return this.send(ENDPOINTS.PLAY_QUEUE);
    }

    public reorderQueue = (start: number, stop: number) => {
        return this.send(ENDPOINTS.REORDER_QUEUE, { start, stop });
    }

    public getQueue = () => {
        return this.send(ENDPOINTS.GET_QUEUE);
    }

    public scanGrid = () => {
        return this.send(ENDPOINTS.SCAN_GRID);
    }

    public createMacro = (name: string, tasks: Task[]) => {
        return this.send(ENDPOINTS.CREATE_MACRO, { name, tasks });
    }

    public updateMacro = (macro: Macro) => {
        return this.send(ENDPOINTS.UPDATE_MACRO, macro);
    }

    public removeMacro = (id: number) => {
        return this.send(ENDPOINTS.REMOVE_MACRO, id);
    }

    public getMacros = () => {
        return this.send(ENDPOINTS.GET_MACROS);
    }

    public register = (key: string, callback: (...params: any[]) => void) => {
        if (!this.callbacks[key]) {
            this.callbacks[key] = [];
        }

        this.callbacks[key].push(callback);
    }

    private alert = (msg: MessageEvent) => {
        const data: Message = JSON.parse(msg.data);

        console.info('Message Recieved: ', data.body);
        if (this.callbacks[data.key]) {
            for (const callback of this.callbacks[data.key]) {
                callback(data.body);
            }
        }
    }

    private send = (key: string, body?: any) => {
        this.connected.then(() => {
            this.ws.send(JSON.stringify({ key, body }));
        });
    }
}

export default new DataService();

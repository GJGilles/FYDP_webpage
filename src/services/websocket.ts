import { Message, Coord, Task, Macro, Group } from "../interfaces";

export const ENDPOINTS = {
    CONNECT: 'connection',
    ADD_MOVE: 'add_move',
    REMOVE_MOVE: 'remove_move',

    PAUSE_QUEUE: 'pause_queue',
    PLAY_QUEUE: 'play_queue',
    REORDER_QUEUE: 'reorder_queue',
    GET_QUEUE: 'get_queue',

    CALIBRATE: 'calibrate',
    GET_COORDS: 'get_coords',
    SCAN_GRID: 'scan_grid',
    ADD_PAWN: 'add_pawn',
    REMOVE_PAWN: 'remove_pawn',
    UPDATE_PAWN: 'update_pawn',

    CREATE_MACRO: 'create_macro',
    UPDATE_MACRO: 'update_macro',
    REMOVE_MACRO: 'remove_macro',
    GET_MACROS: 'get_macros',

    SET_IMAGE: 'set_image',
};

export const SIGNALS = {
    UPDATED_TASK: 'updated_task',
    UPDATED_COORDS: 'updated_coords',
    UPDATED_QUEUE: 'updated_queue',
    UPDATED_QUEUE_STATE: 'updated_queue_state',
    UPDATED_MACROS: 'updated_macros',
    UPDATED_IMAGE: 'updated_image',

    SCANNING_GRID: 'scanning_grid',
    SCANNED_GRID: 'scanned_grid',
    
    CALIBRATING: 'calibrating',
    CALIBRATED: 'calibrated',

    ERROR: 'error', // General error signal, may add more specific errors later
};

export const WS_SERVER = 'ws://localhost:8080';
export const HTTP_SERVER = 'http://localhost:8090';

class DataService {
    private ws: WebSocket = new WebSocket(WS_SERVER); // Server path
    private connected: Promise<any> = Promise.resolve();

    private callbacks: { [key: string]: Array<(...params: any[]) => void> } = {};

    constructor() {
        this.connected = new Promise((resolve) => {
            this.ws.onopen = () => resolve();
        });
        this.ws.onmessage = this.alert;
    }
    
    public addTask = (start: Coord, end: Coord, owner: string) => {
        return this.send(ENDPOINTS.ADD_MOVE, { start, end, owner });
    }

    public removeMove = (index: number) => {
        return this.send(ENDPOINTS.REMOVE_MOVE, index);
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

    public calibrate = () => {
        return this.send(ENDPOINTS.CALIBRATE);
    }

    public getCoords = () => {
        return this.send(ENDPOINTS.GET_COORDS);
    }

    public scanGrid = () => {
        return this.send(ENDPOINTS.SCAN_GRID);
    }

    public addPawn = (position: Coord, obstacle: boolean) => {
        return this.send(ENDPOINTS.ADD_PAWN, { position, obstacle });
    }

    public removePawn = (id: string) => {
        return this.send(ENDPOINTS.REMOVE_PAWN, id);
    }

    public updatePawn = (id: string, group: string, name: string, color: string, shape: string[]) => {
        return this.send(ENDPOINTS.UPDATE_PAWN, { id, group, name, color, shape });
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

    public setImage = (raw: any) => {
        return this.send(ENDPOINTS.SET_IMAGE, raw, false);
    }

    public register = (key: string, callback: (...params: any[]) => void) => {
        if (!this.callbacks[key]) {
            this.callbacks[key] = [];
        }

        this.callbacks[key].push(callback);
    }

    private alert = (msg: MessageEvent) => {
        const data: Message = JSON.parse(msg.data);

        console.info('Message Recieved: ', data.key, data.body);
        if (this.callbacks[data.key]) {
            for (const callback of this.callbacks[data.key]) {
                callback(data.body);
            }
        }
    }

    private send = (key: string, body?: any, log: boolean = true) => {
        this.connected.then(() => {
            this.ws.send(JSON.stringify({ key, body }));
            if (log) {
                console.info('Message Sent: ', key, body);
            } else {
                console.info('Message Sent: ', key);
            }
        });
    }
}

export default new DataService();


interface Message {
    key: string;
    body: any;
}

export const ENDPOINTS = {
    CONNECT: 'connection',
    ADD_MOVE: 'add_move',
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
    CONNECTED: 'connected',
    ADDED_MOVE: 'added_move',

    GET_COORDS: 'get_coords',
    GET_QUEUE: 'get_queue',
    GET_MACROS: 'get_macros',

    UPDATED_COORDS: 'updated_coords',
    UPDATED_QUEUE: 'updated_queue',
    UPDATED_QUEUE_STATE: 'updated_queue_state',
    UPDATED_MACROS: 'updated_macros',

    SCANNING_GRID: 'scanning_grid',
    SCANNED_GRID: 'scanned_grid',

    ERROR: 'error' // General error signal, may add more specific errors later
}

class DataService {

    private ws: WebSocket = new WebSocket('ws://localhost:8080'); // Server path
    private resolve: () => void = () => { };
    private connected: Promise<any> = new Promise((resolve) => { this.resolve = resolve; });

    private callbacks: { [key: string]: ((...params: any[]) => void)[] } = {};

    constructor() {
        this.ws.onopen = this.connect;
        this.ws.onmessage = this.alert;
    }

    private connect = () => {
        this.resolve();
    }

    private alert = (msg: MessageEvent) => {
        let data: Message = JSON.parse(msg.data);

        console.log("Message Recieved: ", data.body);
        if (this.callbacks[data.key]) {
            for (let callback of this.callbacks[data.key]) {
                callback(data.body);
            }
        }
    }

    private send = (key: string, data?: any) => {
        this.connected.then(() => {
            this.ws.send(JSON.stringify({ key: key, data: data }));
        })
    }

    public addMove = () => {
        return this.send(ENDPOINTS.ADD_MOVE);
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

    public reorderQueue = () => {
        return this.send(ENDPOINTS.REORDER_QUEUE);
    }

    public getQueue = () => {
        return this.send(ENDPOINTS.GET_QUEUE, { stuff: ["cheese", "lettuce", "tomato", "pickle 0.5"] });
    }

    public scanGrid = () => {
        return this.send(ENDPOINTS.SCAN_GRID);
    }

    public createMacro = () => {
        return this.send(ENDPOINTS.CREATE_MACRO);
    }

    public updateMacro = () => {
        return this.send(ENDPOINTS.UPDATE_MACRO);
    }

    public removeMacro = () => {
        return this.send(ENDPOINTS.REMOVE_MACRO);
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

}

export default new DataService();

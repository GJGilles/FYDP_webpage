import Websocket from 'ws';

export class DataService {

    private ws = new Websocket(''); // Server path

    constructor() {

    }

    private connect = () => {
        this.ws.send('connect');
    }

    public register = (key: string, callback: (...params: any[]) => void) => {
        this.ws.on(key, callback);
    }

}
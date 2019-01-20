import data, { Macro, Task } from './websocket';

class MacroEditService {
    private macro: Macro = { name: '', tasks: [], id: -1 };
    private editing: boolean = false;

    constructor() { }

    public isEditing = () => {
        return this.editing;
    }

    public edit = (macro: Macro) => {
        this.macro = { id: macro.id, name: macro.name, tasks: macro.tasks };
        this.editing = true;
    }

    public getTasks = () => {
        return this.macro.tasks;
    }

    public reorderTasks = (start: number, stop: number) => {
        if (start < stop) {
            this.macro.tasks.splice(stop + 1, 0, this.macro.tasks[start]);
            this.macro.tasks.splice(start, 1);
        } else {
            this.macro.tasks.splice(stop, 0, this.macro.tasks[start]);
            this.macro.tasks.splice(start + 1, 1);
        }
    }
    
    public addTask = (task: Task) => {
        this.macro.tasks.push(task);
    }

    public removeTask = (index: number) => {
        this.macro.tasks.splice(index, 1);
    }

    public getName = () => {
        return this.macro.name;
    }

    public setName = (name: string) => {
        this.macro.name = name;
    }

    public save = () => {
        if (this.macro.id === -1) {
            data.createMacro(this.macro.name, this.macro.tasks);
        } else {
            data.updateMacro(this.macro);
        }
    }

    public exit = () => {
        this.editing = false;
    }

}

export default new MacroEditService();

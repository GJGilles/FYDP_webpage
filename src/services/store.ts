import Vue from 'vue';
import Vuex, { ActionContext } from 'vuex';
import { getStoreAccessors } from "vuex-typescript";
import data, { Macro, Task } from './websocket';


interface RootState {
    macro: Macro,
    editing: boolean
}

const state: RootState = {
    macro: { name: '', tasks: [], id: -1 },
    editing: false
};

const mutations = {
    edit: (state: RootState, macro: Macro) => {
        state.macro = { id: macro.id, name: macro.name, tasks: macro.tasks };
        state.editing = true;
    },

    reorderTasks: (state: RootState, params: { start: number, stop: number }) => {
        if (params.start < params.stop) {
            state.macro.tasks.splice(params.stop + 1, 0, state.macro.tasks[params.start]);
            state.macro.tasks.splice(params.start, 1);
        } else {
            state.macro.tasks.splice(params.stop, 0, state.macro.tasks[params.start]);
            state.macro.tasks.splice(params.start + 1, 1);
        }
    },
    
    addTask: (state: RootState, task: Task) => {
        state.macro.tasks.push(task);
    },

    removeTask: (state: RootState, index: number) => {
        state.macro.tasks.splice(index, 1);
    },

    setName: (state: RootState, name: string) => {
        state.macro.name = name;
    },

    exit: (state: RootState) => {
        state.editing = false;
    }
}

const getters = {
    isEditing: (state: RootState) => {
        return state.editing;
    },

    getTasks: (state: RootState) => {
        return state.macro.tasks;
    },

    getName: (state: RootState) => {
        return state.macro.name;
    }
};

const actions = {
    save: (context: ActionContext<RootState, RootState>) => {
        if (context.state.macro.id === -1) {
            data.createMacro(context.state.macro.name, context.state.macro.tasks);
        } else {
            data.updateMacro(context.state.macro);
        }
    }
};

Vue.use(Vuex);
const { commit, read, dispatch } = getStoreAccessors<RootState, RootState>('');
const store = new Vuex.Store({ state, mutations, getters, actions });
export default store;


export const edit = (macro: Macro) => commit(mutations.edit)(store, macro);
export const reorderTasks = (start: number, stop: number) => commit(mutations.reorderTasks)(store, { start, stop });
export const addTask = (task: Task) => commit(mutations.addTask)(store, task);
export const removeTask = (index: number) => commit(mutations.removeTask)(store, index);
export const setName = (name: string) => commit(mutations.setName)(store, name);
export const exit = () => commit(mutations.exit)(store);

export const isEditing = () => read(getters.isEditing)(store);
export const getTasks = () => read(getters.getTasks)(store);
export const getName = () => read(getters.getName)(store);

export const save = () => dispatch(actions.save)(store);

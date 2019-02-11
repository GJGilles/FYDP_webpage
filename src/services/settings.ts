import { ActionContext } from 'vuex';
import { getStoreAccessors } from "vuex-typescript";
import { store } from '../main';
import { RootState, SettingsState } from '../interfaces';

const STORAGE_KEY = 'merlin_table_data';

const state: SettingsState = {
    name: process.env.IS_MASTER ? 'Game Master' : 'New Player'
};

const mutations = {
    setName: (state: SettingsState, name: string) => {
        state.name = name;
    },
    load: (state: { [key: string]: any }) => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            const params = JSON.parse(data);
            for (const key of Object.keys(params)) {
                if (state[key] !== undefined) {
                    state[key] = params[key];
                }
            }
        }
    }
}

const getters = {
    getName: (state: SettingsState) => {
        return state.name;
    }
};

const actions = {
    save: (context: ActionContext<SettingsState, RootState>) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(context.state));
    }
};

export default { state, mutations, getters, actions, namespaced: true };

const { commit, read, dispatch } = getStoreAccessors<SettingsState, RootState>('settings');

export const setName = (name: string) => { commit(mutations.setName)(store, name); dispatch(actions.save)(store); }
export const load = () => commit(mutations.load)(store);
export const getName = () => read(getters.getName)(store);

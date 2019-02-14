import { ActionContext } from 'vuex';
import { getStoreAccessors } from "vuex-typescript";
import { store } from '../main';
import { RootState, PawnState, Macro, Task, Pawn, Coord, Group, DisplayGroup } from '../interfaces';
import data from './websocket';

const getCoordKey = (coord: Coord) => {
    return `(${coord.x},${coord.y})`;
}

const state: PawnState = {
    groups: {},
    adding: false,
    selected: { x: -1, y: -1 },
    hover: { x: -1, y: -1 }
};

const mutations = {
    setPawns: (state: PawnState, groups: { [name: string]: Group }) => {
        const dGroups: { [name: string]: DisplayGroup } = { };
        for (const key of Object.keys(groups)) {
            dGroups[key] = {
                name: groups[key].name,
                pawns: groups[key].pawns,
                minimized: false
            }

            if (state.groups[key]) {
                dGroups[key].minimized = state.groups[key].minimized;
            }
        }
        state.groups = dGroups;
    },
    // addPawn: (state: PawnState, pawn: Pawn) => {
    //     state.pawns[getCoordKey(pawn.position)] = pawn;
    // },
    setAdding: (state: PawnState, adding: boolean) => {
        state.adding = adding;
    },
    setSelected: (state: PawnState, selected: Coord) => {
        state.selected = selected;
    },
    setHover: (state: PawnState, hover: Coord) => {
        state.hover = hover;
    }
}

const getters = {
    getGroups: (state: PawnState) => {
        return state.groups;
    },
    getPawns: (state: PawnState) => {
        const pawns: { [coord: string]: Pawn} = {};
        for (let name of Object.keys(state.groups)) {
            for (let key of Object.keys(state.groups[name].pawns)) {
                const pawn = state.groups[name].pawns[key]
                pawns[getCoordKey(pawn.position)] = pawn;
            }
        }
        return pawns;
    },
    isAdding: (state: PawnState) => {
        return state.adding;
    },
    getSelected: (state: PawnState) => {
        return state.selected;
    },
    getHover: (state: PawnState) => {
        return state.hover;
    }
};

const actions = {
};

export default { state, mutations, getters, actions, namespaced: true };

const { commit, read, dispatch } = getStoreAccessors<PawnState, RootState>('pawns');

export const setPawns = (groups: { [name: string]: Group }) => commit(mutations.setPawns)(store, groups);
export const setAdding = (adding: boolean) => commit(mutations.setAdding)(store, adding);
export const setSelected = (selected: Coord) => commit(mutations.setSelected)(store, selected);
export const setHover = (hover: Coord) => commit(mutations.setHover)(store, hover);

export const getGroups = () => read(getters.getGroups)(store);
export const getPawns = () => read(getters.getPawns)(store);
export const isAdding = () => read(getters.isAdding)(store);
export const getSelected = () => read(getters.getSelected)(store);
export const getHover = () => read(getters.getHover)(store);

export const isSelected = (coord: Coord) => getSelected().x === coord.x && getSelected().y === coord.y;
export const isHover = (coord: Coord) => getHover().x === coord.x && getHover().y === coord.y;
export const getPawn = (coord: Coord) => getPawns()[getCoordKey(coord)];
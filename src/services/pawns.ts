import { ActionContext } from 'vuex';
import { getStoreAccessors } from "vuex-typescript";
import { store } from '../main';
import { RootState, PawnState, Macro, Task, Pawn, Coord } from '../interfaces';
import data from './websocket';

const getCoordKey = (coord: Coord) => {
    return `(${coord.x},${coord.y})`;
}

const state: PawnState = {
    pawns: {},
    adding: false,
    selected: { x: -1, y: -1 },
    hover: { x: -1, y: -1 }
};

const mutations = {
    setPawns: (state: PawnState, pawns: Pawn[]) => {
        state.pawns = {};
        for (const pawn of pawns) {
            state.pawns[getCoordKey(pawn.position)] = pawn;
        }
    },
    addPawn: (state: PawnState, pawn: Pawn) => {
        state.pawns[getCoordKey(pawn.position)] = pawn;
    },
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
    getPawns: (state: PawnState) => {
        return state.pawns;
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

export default { state, mutations, getters, actions };

const { commit, read, dispatch } = getStoreAccessors<PawnState, RootState>('');

export const setPawns = (pawns: Pawn[]) => commit(mutations.setPawns)(store, pawns);
export const setAdding = (adding: boolean) => commit(mutations.setAdding)(store, adding);
export const setSelected = (selected: Coord) => commit(mutations.setSelected)(store, selected);
export const setHover = (hover: Coord) => commit(mutations.setHover)(store, hover);

export const getPawns = () => read(getters.getPawns)(store);
export const isAdding = () => read(getters.isAdding)(store);
export const getSelected = () => read(getters.getSelected)(store);
export const getHover = () => read(getters.getHover)(store);

export const isSelected = (coord: Coord) => getSelected().x === coord.x && getSelected().y === coord.y;
export const isHover = (coord: Coord) => getHover().x === coord.x && getHover().y === coord.y;
export const getPawn = (coord: Coord) => getPawns()[getCoordKey(coord)];
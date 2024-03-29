<template>
    <div>
        <div id="position-row" class="row">
            <div class="col-8">Selected Space:</div>
            <div class="col-4">{{ selectedText() }}</div>
            <div class="col-8">Current Space:</div>
            <div class="col-4">{{ hoverText() }}</div>
        </div>
        <ul class="nav nav-tabs">
            <li v-for="tab in getTabs" :key="tab" class="nav-item">
                <a v-on:click="tabSelect(tab)" v-bind:class="tabClass(tab)" href="#">{{ tab }}</a>
            </li>
        </ul>
        <ul id="canvas-sidebar" v-show="!isEditing()" class="list-group">
            <template v-for="group in pawnArray" class="list-group-item row">
                <li :key="group.name" class="list-group-item bg-light text-dark row">
                    <input v-show="!showObstacle" v-model="group.initiative" type="number" class="input-form col-4">
                    <div class="d-inline-block col-5"><h5>{{ group.name }}</h5></div>
                    <button v-on:click="minimize(group)" v-show="!isMinimized(group)" type="button" class="btn btn-dark float-right col-2"><i class="fas fa-caret-down"></i></button>
                    <button v-on:click="maximize(group)" v-show="isMinimized(group)" type="button" class="btn btn-dark float-right col-2"><i class="fas fa-caret-right"></i></button>
                </li>
                <li v-on:click="pawnSelect(pawn)" v-show="!isMinimized(group) && showPawn(pawn)" v-for="pawn in group.pawns" :key="pawn.id" v-bind:class="pawnClass(pawn)" class="pawn-row list-group-item row">
                    <div class="d-inline-block col-1"></div>
                    <div class="d-inline-block col-6">{{ pawn.name }}</div>
                    <button v-on:click="remove(pawn)" type="button" class="btn btn-danger float-right col-2"><i class="fas fa-times fa-sm"></i></button>
                    <button v-on:click="edit(pawn)" type="button" class="btn btn-warning float-right col-2"><i class="fas fa-pencil-alt fa-sm"></i></button>
                </li>
            </template>
            <li class="pawn-row list-group-item row">
                <button v-show="!isAdding()" v-on:click="setAdding(true)" class="btn btn-success col-2 float-right"><i class="fas fa-plus fa-sm"></i></button>
                <button v-show="isAdding()" v-on:click="setAdding(false)" class="btn btn-danger col-2 float-right"><i class="fas fa-minus fa-sm"></i></button>
            </li>
        </ul>
        <div id="canvas-editor" class="row" v-show="isEditing()">
            <div class="col-12">Pawn Edit Mode</div>
            <div class="col-12">
                <button v-on:click="save()" class="col-4 btn btn-success"><i class="fas fa-save"></i></button>
                <button v-on:click="exit()" class="col-4 float-right btn btn-danger"><i class="fas fa-times"></i></button>
            </div>
            <div class="col-12"><input v-model="name" type="text" class="form-control"></div>
            <div class="col-12"><input v-model="group" type="text" class="form-control"></div>
            <div class="col-12"><input v-model="color" type="color" class="form-control"></div>
            <div id="icon-area" class="col-11">
                <div v-for="(icon, index) in ICONS" :key="index" class="d-inline-block col-3">
                    <button v-on:click="iconSelect(icon)" v-bind:class="iconClass(icon)"><font-awesome-icon v-bind:icon="icon"/></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import data, { SIGNALS, ENDPOINTS, HTTP_SERVER } from '../services/websocket';
import * as macros from '../services/macros';
import { Coord, Pawn, Group, DisplayGroup, PawnTabs } from '../interfaces';
import * as pawns from '../services/pawns';

@Component({})
export default class PawnComponent extends Vue {
    private ICONS = [['fas', 'anchor'],['fas', 'ankh'],['fas', 'paw'],['fas', 'hiking'],['fas', 'shield-alt'],['fas', 'user-secret'],['fas', 'crosshairs'],['fas', 'hat-wizard'],['fas', 'mask'],['fas', 'fist-raised'],['fas', 'praying-hands'],['fas', 'gavel'],['fas', 'dice'],['fas', 'gem'],['fas', 'user-ninja'],['fas', 'user-shield'],['fas', 'moon'],['fas', 'icicles'],['fas', 'dice-d20'], ['fas', 'dice-d6'], ['fas', 'dragon'], ['fas', 'ring'], ['fas', 'hat-wizard']];

    private editing: Coord = { x: -1, y: -1 };
    private name: string = '';
    private group: string = '';
    private color: string = '#000000';
    private icon: string[] = ['', ''];

    constructor() {
        super();
    }

    private get getTabs() {
        return Object.keys(PawnTabs);
    }

    private get pawnArray() {
        return pawns.getGroups();
    }

    private get showObstacle() {
        return pawns.getTab() === PawnTabs.Obstacles;
    }

    private getCoordKey(coord: Coord) {
        return `(${coord.x},${coord.y})`;
    }

    public tabClass(tab: PawnTabs) {
        if (tab === pawns.getTab()) {
            return 'active nav-link';
        } else {
            return 'nav-link';
        }
    }

    public pawnClass(pawn: Pawn) {
        if (pawns.isSelected(pawn.position)) {
            return 'active';
        } else {
            return '';
        }
    }

    public iconClass(icon: string[]) {
        if (this.icon[1] === icon[1]) {
            return 'btn btn-primary';
        } else {
            return 'btn btn-secondary';
        }
    }

    private showPawn(pawn: Pawn) {
        return (pawns.getTab() === PawnTabs.Pawns && !pawn.obstacle) || (pawns.getTab() === PawnTabs.Obstacles && pawn.obstacle);
    }

    private isMinimized(group: DisplayGroup) {
        return group.minimized;
    }

    private isEditing() {
        return this.editing.x !== -1 && this.editing.y !== -1;
    }

    private isAdding() {
        return pawns.isAdding();
    }

    public iconSelect(icon: string[]) {
        this.icon = icon;
    }

    public selectedText() {
        if (pawns.isSelected({ x: -1, y: -1 })) {
            return `(-, -)`;
        } else {
            const selected = pawns.getSelected();
            return `(${selected.x + 1}, ${selected.y + 1})`;
        }
    }

    public hoverText() {
        if (pawns.isHover({ x: -1, y: -1 })) {
            return `(-, -)`;
        } else {
            const hover = pawns.getHover();
            return `(${hover.x + 1}, ${hover.y + 1})`;
        }
    }

    private tabSelect(tab: PawnTabs) {
        pawns.setTab(tab);
    }

    private pawnSelect(pawn: Pawn) {
        if (pawns.isSelected(pawn.position)) {
            pawns.setSelected({ x: -1, y: -1 });
        } else {
            pawns.setSelected(pawn.position);
        }
    }

    private setAdding(adding: boolean) {
        pawns.setAdding(adding);
    }

    private minimize(group: DisplayGroup) {
        group.minimized = true;
    }

    private maximize(group: DisplayGroup) {
        group.minimized = false;
    }

    private edit(pawn: Pawn) {
        this.editing = pawn.position;
        this.group = pawn.group;
        this.name = pawn.name;
        this.color = pawn.color;
        this.icon = pawn.shape;
    }

    private remove(pawn: Pawn) {
        data.removePawn(pawn.id);
    }

    private save() {
        data.updatePawn(pawns.getPawn(this.editing).id, this.group, this.name, this.color, this.icon);
    }

    private exit() {
        this.editing = { x: -1, y: -1 };
    }

}
</script>

<style>
#canvas-sidebar {    
    border: 1px solid black;
    overflow-x: hidden;
    height: calc(100% - 120px);
    color: white;
}

#canvas-sidebar li {
    border: 1px solid grey;
}

.pawn-row button {
    line-height: 0.5;
}

#canvas-editor {
    border: 1px solid black;
    overflow-x: hidden;
    height: calc(100% - 120px);
    color: white;
}

#position-row {
    color: white;
}

#icon-area {
    height: calc(100% - 165px);
    border: 1px solid black;
    margin: 0.75rem;
    padding: 0px;
    overflow-y: auto;
}

#icon-area div {
    padding: 0.5rem;
}

</style>


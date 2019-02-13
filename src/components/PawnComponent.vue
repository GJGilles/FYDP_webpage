<template>
    <div>
        <div id="palette-row" class="row">
            <button v-on:click="add()" type="button" class="btn btn-dark col-4">Static</button>
            <button type="button" class="btn btn-primary col-4" data-toggle="modal" data-target="#upload-modal">Upload</button>
            <Modal></Modal>
            <button v-on:click="scan()" type="button" class="btn btn-info col-4">Scan</button>
        </div>
        <div id="position-row" class="row">
            <div class="col-8">Selected Space:</div>
            <div class="col-4">{{ selectedText() }}</div>
            <div class="col-8">Current Space:</div>
            <div class="col-4">{{ hoverText() }}</div>
        </div>
        <ul id="canvas-sidebar" v-show="!isEditing()" class="list-group">
            <template v-for="group in pawnArray" class="list-group-item row">
                <li :key="group.name">{{ group.name }}</li>
                <li v-on:click="pawnSelect(pawn)" v-for="pawn in group.pawns" :key="pawn.id" v-bind:class="pawnClass(pawn)" class="list-group-item row">
                    <div class="d-inline-block col-9">{{ pawn.name }}</div>
                    <button v-on:click="edit(pawn)" type="button" class="btn btn-warning float-right col-3"><i class="fas fa-pencil-alt"></i></button>
                </li>
            </template>
        </ul>
        <div id="canvas-editor" class="row" v-show="isEditing()">
            <div class="col-12">Pawn Edit Mode</div>
            <div class="col-12">
                <button v-on:click="save()" class="col-4 btn btn-success"><i class="fas fa-save"></i></button>
                <button v-on:click="exit()" class="col-4 float-right btn btn-danger"><i class="fas fa-times"></i></button>
            </div>
            <div class="col-12"><input v-model="name" type="text" class="form-control"></div>
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
import Modal from './ModalComponent.vue';
import data, { SIGNALS, ENDPOINTS, HTTP_SERVER } from '../services/websocket';
import * as macros from '../services/macros';
import { Coord, Pawn } from '../interfaces';
import * as pawns from '../services/pawns';

@Component({
    components: {
        Modal
    }
})
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

    private get pawnArray() {
        return pawns.getGroups();
    }

    private getCoordKey(coord: Coord) {
        return `(${coord.x},${coord.y})`;
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

    private isEditing() {
        return this.editing.x !== -1 && this.editing.y !== -1;
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

    private pawnSelect(pawn: Pawn) {
        pawns.setSelected(pawn.position);
    }

    private add() {
        pawns.setAdding(true);
    }

    private scan() {
        data.scanGrid();
    }

    private edit(pawn: Pawn) {
        this.editing = pawn.position;
        this.name = pawn.name;
        this.color = pawn.color;
        this.icon = pawn.shape;
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

#canvas-editor {
    border: 1px solid black;
    overflow-x: hidden;
    height: calc(100% - 120px);
    color: white;
}

#palette-row {
    padding: 0.75rem 1.25rem;
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


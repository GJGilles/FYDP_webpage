<template>
    <div>
        <div id="canvas-grid" class="col-10">
            <div v-for="row in items" :key="row.id" class="canvas-row">
                <div v-for="col in row.cols" :key="col.id" class="canvas-col">
                    <!-- TODO: Move so there is only one tooltip outside of the overflow container -->
                    <div v-on:click="contentSelect(col.id, row.id)" v-on:mouseover="contentHover(col.id, row.id)" v-bind:class="contentClass(col.id, row.id)">
                        <div v-if="isPawn(col.id, row.id)"  v-bind:style="pawnColor(col.id, row.id)"><font-awesome-icon v-bind:icon="pawnShape(col.id, row.id)"/></div>
                        <!-- <span class="hovertext">{{ contentText(row.id, col.id) }}</span> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="col-2">
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
                <li v-on:click="pawnSelect(pawn)" v-for="pawn in pawns" :key="pawn.id" v-bind:class="pawnClass(pawn)" class="list-group-item row">
                    <div class="d-inline-block col-9">{{ pawn.name }}</div>
                    <button v-on:click="edit(pawn)" type="button" class="btn btn-warning float-right col-3"><i class="fas fa-pencil-alt"></i></button>
                </li>
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
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Modal from './ModalComponent.vue';
import data, { Coord, SIGNALS, ENDPOINTS, Pawn } from '../services/websocket';
import { isEditing, addTask } from '../services/store';

interface IRow {
    id: number;
    cols: ICol[];
}

interface ICol {
    id: number;
}

@Component({
    components: {
        Modal
    }
})
export default class CanvasComponent extends Vue {
    private ICONS = [['fas', 'anchor'],['fas', 'ankh'],['fas', 'paw'],['fas', 'hiking'],['fas', 'shield-alt'],['fas', 'user-secret'],['fas', 'crosshairs'],['fas', 'hat-wizard'],['fas', 'mask'],['fas', 'fist-raised'],['fas', 'praying-hands'],['fas', 'gavel'],['fas', 'dice'],['fas', 'gem'],['fas', 'user-ninja'],['fas', 'user-shield'],['fas', 'moon'],['fas', 'icicles'],['fas', 'dice-d20'], ['fas', 'dice-d6'], ['fas', 'dragon'], ['fas', 'ring'], ['fas', 'hat-wizard']];
    private NUM_ROWS = 27;
    private NUM_COLS = 48;

    private items: IRow[] = [];
    private selected: Coord = { x: -1, y: -1 };
    private hover: Coord = { x: -1, y: -1 };
    private head: Coord = { x: 0, y: 0 };

    private pawns: { [coord: string]: Pawn } = {};
    private pawn: string = '';
    private adding: boolean = false;

    private editing: string = '';
    private name: string = '';
    private color: string = '#000000';
    private icon: string[] = ['', ''];

    constructor() {
        super();
        data.register(SIGNALS.UPDATED_COORDS, this.updateCoords);
        data.register(ENDPOINTS.GET_COORDS, this.updateCoords);
        data.getCoords();
    }

    private getCoordKey = (coord: Coord) => {
        return `(${coord.x},${coord.y})`;
    }

    public contentClass(x: number, y: number) {
        const classes = ['content'];
        if (this.selected.x === x && this.selected.y === y) {
            classes.push('selected');
        }
        if (this.head.x === x && this.head.y === y) {
            classes.push('head');
        }
        if (this.isPawn(x, y) && this.pawns[this.getCoordKey({ x, y })].obstacle) {
            classes.push('obstacle');
        }

        return classes.join(' ');
    }

    public pawnClass(pawn: Pawn) {
        if (this.pawn === this.getCoordKey(pawn.position)) {
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
        return this.editing !== '';
    }

    public contentSelect(x: number, y: number) {
        if (this.adding && !this.isPawn(x, y)) {
            this.adding = false;
            data.addPawn({ x, y });
        } else if (this.selected.x === x && this.selected.y === y) {
            this.selected = { x: -1, y: -1 };
        } else if (this.selected.x !== -1 && this.selected.y !== -1) {
            this.addMove({ x: this.selected.x, y: this.selected.y }, { x, y });
            this.selected = { x: -1, y: -1 };
        } else {
            this.selected = { x, y };
        }
    }

    public contentHover(x: number, y: number) {
        this.hover = { x, y };
    }

    public iconSelect(icon: string[]) {
        this.icon = icon;
    }

    public selectedText() {
        if (this.selected.x === -1 && this.selected.y === -1) {
            return `(-, -)`;
        } else {
            return `(${this.selected.x + 1}, ${this.selected.y + 1})`;
        }
    }

    public hoverText() {
        if (this.hover.x === -1 && this.hover.y === -1) {
            return `(-, -)`;
        } else {
            return `(${this.hover.x + 1}, ${this.hover.y + 1})`;
        }
    }

    private created() {
        for (let i = 0; i < this.NUM_ROWS; i++) {
            const row: IRow = { id: i, cols: [] };
            for (let j = 0; j < this.NUM_COLS; j++) {
                const col: ICol = { id: j };
                row.cols.push(col);
            }
            this.items.push(row);
        }
    }

    private pawnSelect(pawn: Pawn) {
        this.pawn = this.getCoordKey(pawn.position);
    }

    private addMove(start: Coord, end: Coord) {
        if (isEditing()) {
            addTask({ start, end });
        } else {
            data.addMove(start, end);
        }
    }

    private isPawn(x: number, y: number) {
        return !!this.pawns[this.getCoordKey({ x, y })];
    }

    private pawnColor(x: number, y: number) {
        if (this.isPawn(x, y)) {
            return 'color: ' + this.pawns[this.getCoordKey({ x, y })].color;
        }
    }

    private pawnShape(x: number, y: number) {
        if (this.isPawn(x, y)) {
            return this.pawns[this.getCoordKey({ x, y })].shape;
        }
    }

    private updateCoords(params: { head: Coord, pawns: Pawn[] }) {
        this.head = params.head;
        this.pawns = {};
        for (const pawn of params.pawns) {
            this.pawns[this.getCoordKey(pawn.position)] = pawn;
        }
    }

    private add() {
        this.adding = true;
    }

    private scan() {
        data.scanGrid();
    }

    private edit(pawn: Pawn) {
        this.editing = this.getCoordKey(pawn.position);
        this.name = this.pawns[this.editing].name;
        this.color = this.pawns[this.editing].color;
        this.icon = this.pawns[this.editing].shape;
    }

    private save() {
        data.updatePawn(this.pawns[this.editing].id, this.name, this.color, this.icon);
    }

    private exit() {
        this.editing = '';
    }

}
</script>

<style>
#canvas-area {
    height: 100%;
}

#canvas-grid {
    overflow: auto;
    margin: 0.75rem 0rem;
    height: calc(100% - 0.75rem);
    padding: 0px;
    max-width: 1440px;
}

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
    height: 10%;
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

#canvas-grid .canvas-row {
    height: 30px;
    white-space: nowrap;
}

#canvas-grid .canvas-col {
    display: inline-block;
    height: 100%;
    width: 30px;
    border: 1px solid black;
}

#canvas-grid .content {
    display: inline-block;
    height: 100%;
    width: 100%;
    background-color: gray;
    position: relative;
    vertical-align: top;
    text-align: center;
}

#canvas-grid .content div {
    background: white;
    display: inline-block;
    vertical-align: middle;
    height: 22px;
    width: 22px;
    border-radius: 10px;
}

#canvas-grid .obstacle div {
    background: black;
}

#canvas-grid .selected {
    border: 2px solid limegreen;
}

#canvas-grid .head {
    background: tomato;
}

#canvas-grid .hovertext {
    visibility: hidden;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 1px 5px;
    border-radius: 6px;
    position: absolute;
    left: 15px;
    top: -15px;
    z-index: 1;
}

#canvas-grid .content:hover .hovertext {
    visibility: visible;
}

</style>


<template>
    <div>
        <div id="palette-row" class="d-flex flex-row justify-content-between">
            <span class="p-2">
                <button type="button" class="p-2 btn btn-dark">Static</button>
            </span>
        </div>
        <div id="canvas-grid">
            <div v-for="row in items" :key="row.id" class="canvas-row">
                <div v-for="col in row.cols" :key="col.id" class="canvas-col">
                    <!-- TODO: Move so there is only one tooltip outside of the overflow container -->
                    <div v-on:click="contentSelect(col.id, row.id)" v-bind:class="contentClass(col.id, row.id)">
                        <div v-if="isPawn(col.id, row.id)"  v-bind:style="pawnColor(col.id, row.id)"><font-awesome-icon v-bind:icon="pawnShape(col.id, row.id)"/></div>
                        <!-- <span class="hovertext">{{ contentText(row.id, col.id) }}</span> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import data, { Coord, SIGNALS, ENDPOINTS, Pawn } from '../services/websocket';
import { isEditing, addTask } from '../services/store';

interface IRow {
    id: number;
    cols: ICol[];
}

interface ICol {
    id: number;
}

@Component({})
export default class CanvasComponent extends Vue {
    private NUM_ROWS = 27;
    private NUM_COLS = 48;

    private items: IRow[] = [];
    private selected: Coord = { x: -1, y: -1 };
    private head: Coord = { x: 0, y: 0 };
    private pawns: { [coord: string]: Pawn } = {};

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
        return classes.join(' ');
    }

    public contentSelect(x: number, y: number) {
        if (this.selected.x === x && this.selected.y === y) {
            this.selected = { x: -1, y: -1 };
        } else if (this.selected.x !== -1 && this.selected.y !== -1) {
            this.addMove({ x: this.selected.x, y: this.selected.y }, { x, y });
            this.selected = { x: -1, y: -1 };
        } else {
            this.selected = { x, y };
        }
    }

    // public contentText(x: number, y: number) {
    //     return `(${y}, ${x})`;
    // }

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
            return ['fas', this.pawns[this.getCoordKey({ x, y })].shape];
        }
    }

    private updateCoords(params: { head: Coord, pawns: Pawn[] }) {
        this.head = params.head;
        this.pawns = {};
        for (const pawn of params.pawns) {
            this.pawns[this.getCoordKey(pawn.position)] = pawn;
        }
    }

}
</script>

<style>
#palette-row {
    height: 10%;
}
#canvas-grid {
    overflow: auto;
    width: 100%;
    max-width: 1440px;
    height: 90%;
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


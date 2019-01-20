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
                    <div v-on:click="contentSelect(row.id, col.id)" v-bind:class="contentClass(row.id, col.id)">
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
import data from '../services/websocket';

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
    private selected: { rowID: number, colID: number } = { rowID: -1, colID: -1 };

    constructor() {
        super();
    }

    public contentClass(rowID: number, colID: number) {
        const classes = ['content'];
        if (this.selected && this.selected.rowID === rowID && this.selected.colID === colID) {
            classes.push('selected');
        }
        return classes.join(' ');
    }

    public contentSelect(rowID: number, colID: number) {
        if (this.selected.rowID === rowID && this.selected.colID === colID) {
            this.selected = { rowID: -1, colID: -1 };
        } else if (this.selected.rowID !== -1 && this.selected.colID !== -1) {
            data.addMove({ x: this.selected.colID, y: this.selected.rowID }, { x: colID, y: rowID });
            this.selected = { rowID: -1, colID: -1 };
        } else {
            this.selected = { rowID, colID };
        }
    }

    public contentText(rowID: number, colID: number) {
        return `(${colID}, ${rowID})`;
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
    height: 22px;
    white-space: nowrap;
}

#canvas-grid .canvas-col {
    display: inline-block;
    height: 100%;
    width: 22px;
    border: 1px solid black;
}

#canvas-grid .content {
    display: inline-block;
    height: 100%;
    width: 100%;
    background-color: gray;
    position: relative;
}

#canvas-grid .selected {
    border: 2px solid limegreen;
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


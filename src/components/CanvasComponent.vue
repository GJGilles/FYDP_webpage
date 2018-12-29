<template>
    <div>
        <div id="palette-row">
            <div class="static-obstacle"></div>
        </div>
        <div id="canvas-grid">
            <div v-for="row in items" :key="row.id" class="row">
                <div v-for="col in row.cols" :key="col.id" class="col">
                    <div class="content"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

interface IRow {
    id: number;
    cols: ICol[];
}

interface ICol {
    id: number;
}

@Component({})
export default class CanvasComponent extends Vue {

    private NUM_ROWS = 36;
    private NUM_COLS = 48;

    private items: IRow[] = [];

    constructor() {
        super();
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
    overflow-x: scroll;
    width: 100%;
    height: 90%;
    padding-top: 5px;
}

#canvas-grid .row {
    height: 30px;
    white-space: nowrap;
    margin-top: -5px;
    display: inline-block;
}

#canvas-grid .col {
    display: inline-block;
    height: 100%;
    width: 30px;
    border: 1px solid black;
}
</style>


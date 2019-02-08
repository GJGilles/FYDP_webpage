<template>
    <div>
        <div id="canvas-grid" v-on:mouseleave="contentHover(-1, -1)">
            <div v-bind:style="background()">
                <div v-for="row in items" :key="row.id" class="canvas-row">
                    <div v-for="col in row.cols" :key="col.id" class="canvas-col">
                        <div v-on:click="contentSelect(col.id, row.id)" v-on:mouseover="contentHover(col.id, row.id)" v-bind:class="contentClass(col.id, row.id)">
                            <div v-if="isPawn(col.id, row.id)" >
                                <div class="pawn" v-bind:style="pawnColor(col.id, row.id)"><font-awesome-icon v-bind:icon="pawnShape(col.id, row.id)"/></div>
                            </div>
                        </div>
                    </div>
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
import * as pawns from '../services/pawns';
import { Coord, Pawn } from '../interfaces';

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
    private head: Coord = { x: 0, y: 0 };
    private backV: number = 0;

    constructor() {
        super();
        data.register(SIGNALS.UPDATED_IMAGE, this.updateBack);
        data.register(SIGNALS.UPDATED_COORDS, this.updateCoords);
        data.register(ENDPOINTS.GET_COORDS, this.updateCoords);
        data.getCoords();
    }

    private getCoordKey = (coord: Coord) => {
        return `(${coord.x},${coord.y})`;
    }

    public contentClass(x: number, y: number) {
        const classes = ['content'];
        if (pawns.getSelected().x === x && pawns.getSelected().y === y) {
            classes.push('selected');
        }
        if (this.head.x === x && this.head.y === y) {
            classes.push('head');
        }
        if (this.isPawn(x, y) && pawns.getPawns()[this.getCoordKey({ x, y })].obstacle) {
            classes.push('obstacle');
        }

        return classes.join(' ');
    }

    public pawnClass(pawn: Pawn) {
        if (pawns.isSelected(pawn.position)) {
            return 'active';
        } else {
            return '';
        }
    }

    public background() {
        return `background-image: url(${HTTP_SERVER}?v=${this.backV})`;
    }

    public contentSelect(x: number, y: number) {
        if (pawns.isAdding() && !this.isPawn(x, y)) {
            pawns.setAdding(false);
            data.addPawn({ x, y });
        } else if (pawns.getSelected().x === x && pawns.getSelected().y === y) {
            pawns.setSelected({ x: -1, y: -1 });
        } else if (!pawns.isSelected({ x: -1, y: -1 })) {
            this.addMove(pawns.getSelected(), { x, y });
            pawns.setSelected({ x: -1, y: -1 });
        } else {
            pawns.setSelected({ x, y });
        }
    }

    public contentHover(x: number, y: number) {
        pawns.setHover({ x, y });
    }

    public selectedText() {
        if (pawns.isSelected({ x: -1, y: -1 })) {
            return `(-, -)`;
        } else {
            const selected = pawns.getSelected();
            return `(${selected.x + 1}, ${selected.y + 1})`;
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
        pawns.setSelected(pawn.position);
    }

    private addMove(start: Coord, end: Coord) {
        if (macros.isEditing()) {
            macros.addTask({ start, end });
        } else {
            data.addMove(start, end);
        }
    }

    private isPawn(x: number, y: number) {
        return !!pawns.getPawn({ x, y });
    }

    private pawnColor(x: number, y: number) {
        if (this.isPawn(x, y)) {
            return 'color: ' + pawns.getPawn({ x, y }).color;
        }
    }

    private pawnShape(x: number, y: number) {
        if (this.isPawn(x, y)) {
            return pawns.getPawn({ x, y }).shape;
        }
    }

    private updateCoords(params: { head: Coord, pawns: Pawn[] }) {
        this.head = params.head;
        pawns.setPawns(params.pawns);
    }

    private updateBack() {
        this.backV +=1;
    }

    private add() {
        pawns.setAdding(true);
    }

    private scan() {
        data.scanGrid();
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
}

#canvas-grid > div {
    background-size: 100% 100%;
    display: inline-block;
}

#canvas-grid .canvas-row {
    white-space: nowrap;
}

#canvas-grid .canvas-col {
    display: inline-block;
    border: 1px solid black;
}

#canvas-grid .content {
    display: inline-block;
    height: 50px;
    width: 50px;
    vertical-align: top;
}

#canvas-grid .content > div {
    position: relative;
    height: 100%;
}

#canvas-grid .content .pawn {
    background: white;
    position: absolute;
    text-align: center;
    top: 10%;
    left: 12%;
    height: 40px;
    width: 40px;
    border-radius: 20px;
}

.pawn svg {
    height: 100%;
    width: 100%;
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


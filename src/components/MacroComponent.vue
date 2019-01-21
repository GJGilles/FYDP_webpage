<template>
    <div>
        <ul id="macro-list" class="list-group">
            <li v-for="(macro, index) in macros" :key="macro.id" class="list-group-item row">
                <span class="col-6">{{ macro.name }}</span>
                <button v-on:click="remove(macro.id)" type="button" class="btn btn-danger float-right col-2"><i class="fas fa-trash"></i></button>
                <button v-on:click="edit(index)" type="button" class="btn btn-warning float-right col-2"><i class="fas fa-pencil-alt"></i></button>
                <button v-on:click="run(index)" type="button" class="btn btn-success float-right col-2"><i class="fas fa-play"></i></button>
            </li>
            <li class="list-group-item row">
                <button v-on:click="create()" type="button" class="btn btn-success float-right"><i class="fas fa-plus"></i></button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import data, { SIGNALS, Macro, ENDPOINTS } from '../services/websocket';
import { edit } from '../services/store';

@Component({})
export default class MacroComponent extends Vue {
    private macros: Macro[] = [];

    constructor() {
        super();
        data.register(SIGNALS.UPDATED_MACROS, this.updateMacros);
        data.register(ENDPOINTS.GET_MACROS, this.updateMacros);
        data.getMacros();
    }

    private create() {
        edit({ name: 'New Macro', tasks: [], id: -1 });
    }

    private remove(id: number) {
        data.removeMacro(id);
    }

    private edit(index: number) {
        edit(this.macros[index]);
    }

    private run(index: number) {
        for (const task of this.macros[index].tasks) {
            data.addMove(task.start, task.end);
        }
    }

    private updateMacros(macros: Macro[]) {
        this.macros = macros;
    }
}
</script>

<style>
    #macro-buttons {
        height: 10%;
    }

    #macro-list {
        height: 90%;
        border: 1px solid black;
        width: calc(100% - 2px);
        color: white;
        overflow-x: hidden;
    }

    #macro-list li {
        border: 1px solid gray;
    }
</style>


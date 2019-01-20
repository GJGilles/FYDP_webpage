<template>
    <div>
        <div id="macro-buttons" class="d-flex flex-row justify-content-between">
            <span class="p-2">
                <button v-on:click="create()" type="button" class="p-2 btn btn-success">Create</button>
            </span>
            <span class="p-2">
                <button v-on:click="save()" type="button" class="p-2 btn btn-info">Save</button>
            </span>
            <span class="p-2">
                <button v-on:click="exit()" type="button" class="p-2 btn btn-danger">Exit</button>
            </span>
        </div>
        <ul id="macro-list" class="list-group">
            <li class="list-group-item"></li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { edit, save, exit } from '../services/store';

@Component({})
export default class MacroComponent extends Vue {

    constructor() {
        super();
    }

    private create() {
        edit({ name: 'New Macro', tasks: [], id: -1 });
    }

    private save() {
        save();
    }

    private exit() {
        exit();
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
    }
</style>


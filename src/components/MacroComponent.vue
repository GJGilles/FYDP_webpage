<template>
    <div>
        <div id="macro-buttons" class="d-flex flex-row justify-content-between">
            <span class="p-2">
                <button type="button" class="p-2 btn btn-success">Create</button>
            </span>
            <span class="p-2">
                <button type="button" class="p-2 btn btn-primary">Edit</button>
            </span>
            <span class="p-2">
                <button type="button" class="p-2 btn btn-danger">Delete</button>
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

@Component({})
export default class MacroComponent extends Vue {

    constructor() {
        super();
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


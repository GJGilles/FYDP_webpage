<template>
    <div>
        <ul id="queue-area" class="list-group">
            <li v-for="row in queue" :key="row.id" class="row list-group-item">{{ row.text }}</li>
        </ul>
        <div id="button-area">
            <div class="d-flex flex-row justify-content-between">
                <span class="p-2">
                    <button v-if="!isPlaying" v-on:click="play" type="button" class="btn btn-success">Play</button>
                    <button v-if="isPlaying" v-on:click="pause" type="button" class="btn btn-primary">Pause</button>
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class QueueComponent extends Vue {

    private queue = [];
    private isPlaying = true;

    constructor() {
        super();
    }

    private play() {
        this.isPlaying = true;
    }

    private pause() {
        this.isPlaying = false;
    }
}
</script>

<style>

#queue-area {
    width: calc(80% - 2px);
    height: 100%;
    display: inline-block;
    border: 1px solid black;
}

#button-area {
    width: 20%;
    height: 100%;
    display: inline-block;
    vertical-align: top;
}

</style>


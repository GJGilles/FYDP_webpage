<template>
    <div>
        <div id="queue-area">
            <div v-for="row in queue" :key="row.id" class="row"></div>
        </div>
        <div id="button-area">
            <button>Play</button>
            <button>Pause</button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class QueueComponent extends Vue {

    private queue = [];

    constructor() {
        super();
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


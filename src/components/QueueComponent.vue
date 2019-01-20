<template>
    <div class="row">
        <ul id="queue-area">
            <!-- Playing item -->
            <li class="list-group-item task">
                <span class="p-2">
                    <button v-show="!isPlaying" v-on:click="play" type="button" class="p-2 btn btn-success"><i class="fas fa-play"></i></button>
                    <button v-show="isPlaying" v-on:click="pause" type="button" class="p-2 btn btn-primary"><i class="fas fa-pause"></i></button>
                </span>
                <span v-if="isQueue">{{ playing }}</span>
            </li>
            <!-- Later Tasks -->
            <li v-for="row in queue" :key="row.id" class="row list-group-item task">
                <span>
                    <div><i class="fa fa-chevron-up"></i></div>
                    <div><i class="fa fa-chevron-down"></i></div>
                </span>
                <span>{{ row }}</span>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import data, { Task, SIGNALS, ENDPOINTS } from '../services/websocket';

@Component({})
export default class QueueComponent extends Vue {

    private playing: string | undefined;
    private queue: string[] = [];
    private isPlaying = true;

    constructor() {
        super();
        data.register(ENDPOINTS.GET_QUEUE, this.updateQueue);
        data.register(SIGNALS.UPDATED_QUEUE, this.updateQueue);
        data.getQueue();
    }

    private get isQueue() {
        return !!this.playing;
    }

    private play() {
        this.isPlaying = true;
        data.playQueue();
    }

    private pause() {
        this.isPlaying = false;
        data.pauseQueue();
    }

    private updateQueue(queue: Task[]) {
        const playing = queue.shift();
        if (playing) {
            this.playing = `FROM (${playing.start.x}, ${playing.start.y}) TO (${playing.end.x}, ${playing.end.y})`;
        } else {
            this.playing = undefined;
        }
        
        this.queue = [];
        for (const task of queue) {
            this.queue.unshift(`FROM (${task.start.x}, ${task.start.y}) TO (${task.end.x}, ${task.end.y})`);
        }
    }
}
</script>

<style>

#queue-area {
    padding-left: 0px;
    height: 100%;
    border: 1px solid black;
    overflow-x: hidden;
    overflow-y: auto;
}

#queue-area .task {
    border: 1px solid gray;
}

</style>


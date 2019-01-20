<template>
    <div class="row">
        <ul id="queue-area">
            <!-- Playing item -->
            <li v-show="!isEdit" class="list-group-item task row">
                <button v-show="!isPlaying" v-on:click="play" type="button" class="btn btn-success col-2"><i class="fas fa-play"></i></button>
                <button v-show="isPlaying" v-on:click="pause" type="button" class="btn btn-primary col-2"><i class="fas fa-pause"></i></button>
                <span v-if="isQueue" class="col-9">{{ getTaskName(playing) }}</span>
                <span v-if="!isQueue" class="col-9">No tasks queued</span>
                <button v-show="isQueue" type="button" class="btn btn-danger col-1 float-right"><i class="fas fa-times"></i></button>
            </li>
            <!-- Later Tasks -->
            <li v-for="(row, index) in queue" :key="index" v-show="!isEdit" class="row list-group-item task">
                <button :disabled="isFirst(index)" v-on:click="moveUp(index)" type="button" class="btn btn-info col-1"><i class="fas fa-chevron-up"></i></button>
                <button :disabled="isLast(index)" v-on:click="moveDown(index)" type="button" class="btn btn-info col-1"><i class="fas fa-chevron-down"></i></button>
                <span>{{ getTaskName(row) }}</span>
                <button v-on:click="remove(index)" type="button" class="btn btn-danger col-1 float-right"><i class="fas fa-times"></i></button>
            </li>

            <li v-show="isEdit" class="list-group-item task row">
                <span class="col-9">Currently Editing A Macro</span>
            </li>
            <li v-for="(row, index) in editQueue" :key="index" v-show="isEdit" class="row list-group-item task">
                <button :disabled="isFirst(index)" v-on:click="moveUp(index)" type="button" class="btn btn-info col-1"><i class="fas fa-chevron-up"></i></button>
                <button :disabled="isLast(index)" v-on:click="moveDown(index)" type="button" class="btn btn-info col-1"><i class="fas fa-chevron-down"></i></button>
                <span>{{ getTaskName(row) }}</span>
                <button v-on:click="remove(index)" type="button" class="btn btn-danger col-1 float-right"><i class="fas fa-times"></i></button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import data, { Task, SIGNALS, ENDPOINTS } from '../services/websocket';
import { isEditing, getTasks, reorderTasks, removeTask } from '../services/store';

@Component({})
export default class QueueComponent extends Vue {
    private isQueue: boolean = false;
    private playing: Task = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
    private queue: Task[] = [];
    private isPlaying = true;

    constructor() {
        super();
        data.register(SIGNALS.UPDATED_QUEUE, this.updateQueue);
        data.register(SIGNALS.UPDATED_QUEUE_STATE, this.updateState);

        data.register(ENDPOINTS.GET_QUEUE, (data: { playing: boolean, queue: Task[] }) => {
            this.updateState(data.playing);
            this.updateQueue(data.queue);
        });
        data.getQueue();
    }

    private get isEdit() {
        return isEditing();
    }

    private get editQueue() {
        return getTasks();
    }

    private play() {
        this.isPlaying = true;
        data.playQueue();
    }

    private pause() {
        this.isPlaying = false;
        data.pauseQueue();
    }

    private isFirst(i: number) {
        return i === 0;
    }

    private isLast(i: number) {
        return i === this.queue.length - 1;
    }

    private moveUp(i: number) {
        if (this.isEdit) {
            reorderTasks(i, i - 1);
        } else {
            data.reorderQueue(i, i - 1);
        }
    }

    private moveDown(i: number) {
        if (this.isEdit) {
            reorderTasks(i, i + 1);
        } else {
            data.reorderQueue(i, i + 1);
        }
    }

    private remove(i: number) {
        if (this.isEdit) {
            removeTask(i);
        } else {
            data.removeMove(i);
        }
    }

    private getTaskName = (task: Task) => {
        return `FROM (${task.start.x}, ${task.start.y}) TO (${task.end.x}, ${task.end.y})`;
    }

    private updateQueue(queue: Task[]) {
        const playing = queue.shift();
        if (playing) {
            this.playing = playing;
            this.isQueue = true;
        } else {
            this.isQueue = false;
        }
        this.queue = queue;
    }

    private updateState(playing: boolean) {
        this.isPlaying = playing;
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
    color: white;
}

</style>


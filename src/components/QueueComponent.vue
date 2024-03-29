<template>
    <div>
        <ul v-show="!isEdit" class="queue-area">
            <!-- Playing item -->
            <li id="current-task" class="list-group-item task row">
                <div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" v-bind:aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100" v-bind:style="progressStyle"></div>
                </div>
                <button v-show="!isPlaying" v-on:click="play()" type="button" class="btn btn-success col-2"><i class="fas fa-play"></i></button>
                <button v-show="isPlaying" v-on:click="pause()" type="button" class="btn btn-primary col-2"><i class="fas fa-pause"></i></button>
                <div class="col-2 d-inline-block">{{ playing.owner }}</div>
                <div v-if="isQueue" class="col-6 d-inline-block">{{ getTaskName(playing) }}</div>
                <div v-if="!isQueue" class="col-6 d-inline-block">No tasks queued</div>
                <button v-on:click="remove(-1)" v-show="isQueue" type="button" class="btn btn-danger col-1 float-right"><i class="fas fa-trash"></i></button>
            </li>
            <!-- Later Tasks -->
            <li v-for="(row, index) in queue" :key="index" class="row list-group-item task">
                <button :disabled="isFirst(index)" v-on:click="moveUp(index)" type="button" class="btn btn-info col-1"><i class="fas fa-chevron-up"></i></button>
                <button :disabled="isLast(index)" v-on:click="moveDown(index)" type="button" class="btn btn-info col-1"><i class="fas fa-chevron-down"></i></button>
                <div class="col-2 d-inline-block">{{ row.owner }}</div>
                <div class="col-6 d-inline-block">{{ getTaskName(row) }}</div>
                <button v-on:click="remove(index)" type="button" class="btn btn-danger col-1 float-right"><i class="fas fa-trash"></i></button>
            </li>
        </ul>
        
        <ul v-show="isEdit" class="queue-area">
            <li class="list-group-item task row">
                <button v-on:click="save()" type="button" class="btn btn-success col-1"><i class="fas fa-save"></i></button>
                <button v-on:click="close()" type="button" class="btn btn-danger col-1"><i class="fas fa-times"></i></button>
                <div class="col-2 d-inline-block">{{ getOwner }}</div>
                <div class="col-4 d-inline-block"><input v-model="name" type="text" class="form-control"></div>
                <div class="col-4 d-inline-block float-right">Macro Edit Mode</div>
            </li>
            <li v-for="(row, index) in editQueue" :key="index" class="row list-group-item task">
                <button :disabled="isFirst(index)" v-on:click="moveUp(index)" type="button" class="btn btn-info col-1"><i class="fas fa-chevron-up"></i></button>
                <button :disabled="isLast(index)" v-on:click="moveDown(index)" type="button" class="btn btn-info col-1"><i class="fas fa-chevron-down"></i></button>
                <div class="col-2 d-inline-block">{{ row.owner }}</div>
                <div class="col-6 d-inline-block">{{ getTaskName(row) }}</div>
                <button v-on:click="remove(index)" type="button" class="btn btn-danger col-1 float-right"><i class="fas fa-trash"></i></button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import data, { SIGNALS, ENDPOINTS } from '../services/websocket';
import { isEditing, getTasks, reorderTasks, removeTask, save, exit, setName, getName } from '../services/macros';
import * as settings from '../services/settings';
import { Task } from '../interfaces';

@Component({})
export default class QueueComponent extends Vue {
    private isQueue: boolean = false;
    private playing: Task = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, owner: '' };
    private queue: Task[] = [];
    private isPlaying = true;
    private progress: number = 0;

    private name: string = 'New Macro';

    constructor() {
        super();
        data.register(SIGNALS.UPDATED_TASK, this.updatedProgress);
        data.register(SIGNALS.UPDATED_QUEUE, this.updateQueue);
        data.register(SIGNALS.UPDATED_QUEUE_STATE, this.updateState);

        data.register(ENDPOINTS.GET_QUEUE, (data: { playing: boolean, queue: Task[] }) => {
            this.updateState(data.playing);
            this.updateQueue(data.queue);
        });
        data.getQueue();
    }

    private get progressStyle() {
        return `width: ${this.progress}%;`;
    }

    private get isEdit() {
        this.name = getName();
        return isEditing();
    }

    private get editQueue() {
        return getTasks();
    }

    private get getOwner() {
        return settings.getName();
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
        if (this.isEdit) {
            return i === this.editQueue.length - 1;
        } else {
            return i === this.queue.length - 1;
        }
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

    private save() {
        setName(this.name);
        save();
    }

    private close() {
        exit();
    }

    private getTaskName = (task: Task) => {
        return `FROM (${task.start.x + 1}, ${task.start.y + 1}) TO (${task.end.x + 1}, ${task.end.y + 1})`;
    }

    private updatedProgress(percentage: number) {
        this.progress = percentage;
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

.queue-area {
    padding-left: 0px;
    height: 100%;
    border: 1px solid black;
    overflow-x: hidden;
    overflow-y: auto;
}

.queue-area .task {
    border: 1px solid gray;
    color: white;
}

#current-task {
    position: relative;
}

#current-task .progress {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
}

</style>


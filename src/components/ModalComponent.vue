<template>
    <div class="modal fade" id="upload-modal" tabindex="-1" role="dialog" aria-labelledby="upload-modal-label" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="upload-modal-label">Upload a Background Image</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input id="file-input" type="file" accept=".png,.jpg,.jpeg" class="form-control-file">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button v-on:click="upload()" type="button" class="btn btn-primary" data-dismiss="modal">Upload</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import data from '../services/websocket';

export default class ModalComponent extends Vue{
    constructor() {
        super();
    }

    public upload() {
        const elem = <HTMLInputElement>document.getElementById('file-input');
        if (elem && elem.files) {
            const file = elem.files[0];
            const reader = new FileReader();        

            reader.onload = (e) => {
                // @ts-ignore
                const raw = e.target ? e.target.result : '';
                data.setImage(raw);
            }

            reader.readAsBinaryString(file);
        }
    }
}
</script>

<style>

#upload-modal {
    color: white;
}

</style>

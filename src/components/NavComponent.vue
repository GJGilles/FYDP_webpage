<template>
    <div>
        <nav class="navbar navbar-dark bg-dark">
            <a class="navbar-brand" href="#">Merlin</a>
            <div id="palette-row" class="row">
                <button type="button" class="btn btn-primary col-6" data-toggle="modal" data-target="#upload-modal">Upload</button>
                <Modal></Modal>
                <button v-on:click="scan()" type="button" class="btn btn-info col-6">Scan</button>
            </div>
            <div id="login">
                <span class="col-2">{{ getName }}</span>
                <button v-on:click="editName()" class="btn btn-primary" type="button" data-toggle="modal" data-target="#name-modal"><i class="fas fa-sign-in-alt"></i></button>
            </div>
        </nav>
        <div class="modal fade" id="name-modal" tabindex="-1" role="dialog" aria-labelledby="name-modal-label" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="name-modal-label">Change Display Name</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <input v-model="name" type="text" class="form-control">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button v-on:click="setName()" type="button" class="btn btn-primary" data-dismiss="modal">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import Modal from './ModalComponent.vue';
import * as local from '../services/settings';

@Component({
    components: {
        Modal
    }
})
export default class NavComponent extends Vue {
    private name: string = this.getName;

    constructor() {
        super();
        local.load();
    }

    public editName() {
        this.name = this.getName;
    }

    public get getName() {
        return local.getName();
    }

    public setName() {
        local.setName(this.name);
    }

}
</script>

<style>
#login {
    margin-right: 5%;
    color: white;
}

#name-modal {
    color: white;
}

</style>

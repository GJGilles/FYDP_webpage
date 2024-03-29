<template>
  <div id="app"> 
    <Nav></Nav>
    <div id="body" class="row">
      <Canvas id="canvas"  v-bind:class="canvasClass()"></Canvas>
      <Pawn v-if="isMaster" id="pawn" class="col-12 col-lg-2"></Pawn>
      <Queue v-if="isMaster" id="queue" class="col-12 col-lg-6"></Queue>
      <Macro v-if="isMaster" id="macro" class="col-12 col-lg-6"></Macro>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Nav from './components/NavComponent.vue';
import Canvas from './components/CanvasComponent.vue';
import Pawn from './components/PawnComponent.vue';
import Macro from './components/MacroComponent.vue';
import Queue from './components/QueueComponent.vue';
import data,{ SIGNALS } from './services/websocket';

@Component({
  components: {
    Nav,
    Canvas,
    Pawn,
    Macro,
    Queue,
  },
})
export default class App extends Vue {
  private isMaster: boolean = process.env.IS_MASTER === 'true';

  constructor() {
    super();

    data.register(SIGNALS.CALIBRATING, this.calibrating);
    data.register(SIGNALS.CALIBRATED, this.calibrated);
    data.register(SIGNALS.SCANNING, this.scanning);
    data.register(SIGNALS.SCANNED, this.scanned);
  }

  private canvasClass() {
    return this.isMaster ? 'col-12 col-lg-10' : 'col-12 full-height';
  }

  private calibrating() {
    this.$toasted.info('Calibrating...');
  }

  private calibrated() {
    this.$toasted.success('Calibrated!');
  }

  private scanning() {
    this.$toasted.info('Scanning...');
  }

  private scanned() {
    this.$toasted.success('Scanned!');
  }

}
</script>

<style>

html, body { 
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

#body {
  vertical-align: top;
  height: calc(98% - 42px); /* TODO: Fix this */
  margin: auto;
  width: 90%;
}

#canvas {
  display: flex;
  height: 70%;
}

#canvas.full-height {
  height: 100%;
}

#pawn {
  height: 70%;
}

#macro {
  height: 30%;
  vertical-align: top;
}

#queue {
  height: 30%;
}

input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
 
input[type="number"] {
    -moz-appearance: textfield;
}

</style>

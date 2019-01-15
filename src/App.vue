<template>
  <div id="app" class="row">
        <Canvas id="canvas" class="col-12 col-lg-10 order-1"></Canvas>
        <Macro id="macro" class="col-10 col-lg-2 order-3 order-lg-2"></Macro>
        <Queue id="queue" class="col-12 col-lg-10 order-2 order-lg-3"></Queue>
        <Scan id="scan" class="col-2 order-4"></Scan>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import data, { SIGNALS } from './services/websocket';
import Canvas from './components/CanvasComponent.vue';
import Macro from './components/MacroComponent.vue';
import Queue from './components/QueueComponent.vue';
import Scan from './components/ScanComponent.vue';

@Component({
  components: {
    Canvas,
    Macro,
    Queue,
    Scan,
  },
})
export default class App extends Vue {
  constructor() {
    super();

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
  vertical-align: top;
  height: 100%;
  width: 90%;
  margin: auto;
}

#canvas {
  width: 80%;
  height: 70%;
  display: inline-block;
}

#macro {
  width: 20%;
  height: 70%;
  vertical-align: top;
  display: inline-block;
}

#queue {
  width: 80%;
  height: 30%;
  display: inline-block;
}

#scan {
  width: 20%;
  height: 30%;
  vertical-align: top;
  display: inline-block;
}
</style>

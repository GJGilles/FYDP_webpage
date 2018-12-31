<template>
  <div id="app">
    <Canvas id="canvas"></Canvas>
    <Macro id="macro"></Macro>
    <Queue id="queue"></Queue>
    <Scan id="scan"></Scan>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
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
export default class App extends Vue {}
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
  height: 95%;
  width: 90%;
  margin: auto;
  overflow: hidden;
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

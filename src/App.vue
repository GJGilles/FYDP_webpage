<template>
  <div id="app">
    <Canvas id="canvas"></Canvas>
    <Macro id="macro"></Macro>
    <Queue id="queue"></Queue>
    <Scan></Scan>
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
  height: 100%;
}

#canvas {
  width: 80%;
  height: 70%;
  display: inline-block;
}

#macro {
  width: 20%;
  height: 70%;
  display: inline-block;
}

#queue {
  width: 80%;
  height: 30%;
  display: inline-block;
}
</style>

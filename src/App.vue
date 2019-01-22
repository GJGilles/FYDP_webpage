<template>
  <div id="app" class="row"> 
    <Canvas id="canvas" class="col-12"></Canvas>
    <Queue id="queue" class="col-12 col-lg-6"></Queue>
    <Macro id="macro" class="col-12 col-lg-6"></Macro>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Canvas from './components/CanvasComponent.vue';
import Macro from './components/MacroComponent.vue';
import Queue from './components/QueueComponent.vue';

@Component({
  components: {
    Canvas,
    Macro,
    Queue,
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
  height: 98%;
  width: 90%;
  margin: auto;
}

#canvas {
  height: 70%;
  display: flex;
}

#macro {
  height: 30%;
  vertical-align: top;
}

#queue {
  height: 30%;
}

</style>

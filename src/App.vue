<template>
  <div id="app">
    <div>
      <la-drag v-for="n in items" :key="n" class="drag" :data="n">{{
        n
      }}</la-drag>
    </div>
    <la-drop class="outside" @drop="outside">
      <span class="dropped" v-if="outsideDropped">drop</span>
      <template v-slot:drag-image="{ data }">
        <div class="circle-outside">
          <span class="text">{{ data }}</span>
        </div>
      </template>
      <la-drop class="inside" @drop="inside">
        <span class="dropped" v-if="insideDropped">drop</span>
        <template v-slot:drag-image="{ data }">
          <div class="circle-inside">
            <span class="text">{{ data }}</span>
          </div>
        </template>
        <la-drop-mask class="mask"></la-drop-mask>
      </la-drop>
    </la-drop>
  </div>
</template>

<script>
import LaDrag from "./components/LaDrag";
import LaDrop from "./components/LaDrop";
import LaDropMask from "./components/LaDropMask";

export default {
  name: "App",
  components: {
    LaDrag,
    LaDrop,
    LaDropMask,
  },
  data: function () {
    return {
      items: [1, 2, 3, 4],
      insideDropped: false,
      outsideDropped: false,
    };
  },
  methods: {
    inside(e) {
      this.insideDropped = true;
    },
    outside(e) {
      this.outsideDropped = true;
    },
  },
};
</script>

<style>
html,
body {
  height: 100%;
  font-family: "Roboto";
}

.drag {
  width: 50px;
  height: 50px;
  background-color: rgb(220, 220, 255);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 10px 10px 0 10px;
  font-size: 20px;
}

.circle-outside,
.circle-inside {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  transform: translate(-50%, -50%);
}

.circle-inside {
  background-color: rgb(150, 150, 150);
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.circle-outside {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 30px 52px 30px;
  border-color: transparent transparent rgb(255, 200, 200) transparent;
  position: relative;
}

.circle-outside .text {
  position: absolute;
  top: 25px;
  transform: translate(0, -50%);
}

.outside {
  border: 1px solid black;
  height: 500px;
  width: 800px;
  margin: 20px auto;
  position: relative;
  padding: 10px;
}

.inside {
  position: absolute;
  border: 1px solid black;
  top: 100px;
  left: 130px;
  bottom: 100px;
  right: 130px;
  padding: 10px;
}

.mask {
  position: absolute;
  border: 1px solid black;
  top: 100px;
  left: 130px;
  bottom: 100px;
  right: 130px;
  background-color: rgba(255, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mask::before {
  content: "MASK";
  color: rgba(0, 0, 0, 0.4);
  font-size: 30px;
  font-weight: bold;
}

.drop-allowed {
  background-color: rgba(0, 255, 0, 0.2);
}

.drop-forbidden {
  background-color: rgba(255, 0, 0, 0.2);
}

.drop-in {
  box-shadow: 0 0 5px rgba(0, 0, 255, 0.4);
}
</style>

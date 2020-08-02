<template>
  <div class="container">
    <!-- <div class="subtitle"> -->
      <!-- <router-link to="/" v-if="!loading">Go to back</router-link> -->
    <!-- </div> -->
    <div class="title" v-if="loading" id="loading">Generating...</div>
    <div id="square" ref="square"><div>
  </div>
</template>

<style scoped lang="scss">
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .subtitle { 
    margin-bottom: 0;
    margin-top: 10px;
  }

  #square {
    canvas {
      outline: 1px solid #fbf8f8;
    }
  }
}
</style>

<script>
import Vue from "vue";
import { makeArt } from './art';

export default Vue.extend({
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    setTimeout(() => {
      makeArt(this.$refs.square);
      this.loading = false;
    }, 100);
  }
});
</script>
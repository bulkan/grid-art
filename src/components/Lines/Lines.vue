<template>
  <div class="container">
    <div class="title" v-if="loading" id="loading">Generating...</div>
    <div id="canvasContainer" ref="canvasContainer"><div>
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
import { makeArt } from './makeLinesArt';

export default Vue.extend({
  data() {
    return {
      loading: true,
      backgroundColor: 'white'
    }
  },
  computed: {
    seed() {
      return this.$route.query.seed;
    },
    paletteId() {
      return this.$route.query.pid;
    },

    force() {
      return this.$route.query.force;
    }
  },

  destroyed() {
    document.body.bgColor = 'white';
  },

  mounted() {
    setTimeout(() => {
      let makeArtProps = {
        node: this.$refs.canvasContainer
      };

      if(!this.force) {
        makeArtProps = {
          ...makeArtProps,
          seed: this.seed,
          paletteId: this.paletteId,
        };
      }

      const { seed, paletteId: pid, backgroundColor} = makeArt(makeArtProps);

      const query = {
        seed,
        pid
      };

      if(this.force) {
        query.force = true;
      }

      this.$router.replace({
        path: '/lines',
        query
      }).catch(() => {});

      document.body.bgColor = backgroundColor;

      this.loading = false;
    }, 100);
  }
});
</script>
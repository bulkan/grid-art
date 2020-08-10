<template>
  <div class="container">
    <div class="title" v-if="loading" id="loading">Generating...</div>
    <div id="canvasOutlet" ref="canvasOutlet"><div>
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

  #canvasOutlet {
    canvas {
      outline: 1px solid #fbf8f8;
    }
  }
}
</style>

<script>
import Vue from "vue";

export default Vue.extend({
  props: {
    artFn: Function,
    name: String
  },
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
        node: this.$refs.canvasOutlet
      };

      if(!this.force) {
        makeArtProps = {
          ...makeArtProps,
          seed: this.seed,
          paletteId: this.paletteId,
        };
      }

      const { seed, paletteId: pid, backgroundColor} = this.artFn(makeArtProps);

      const query = {
        seed,
        pid
      };

      if(this.force) {
        query.force = true;
      }

      this.$router.replace({
        path: `/${this.name}`,
        query
      }).catch(() => {});

      document.body.bgColor = backgroundColor;

      this.loading = false;
    }, 100);
  }
});
</script>
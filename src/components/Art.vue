<template>
  <div class="container">
    <div class="title" v-if="loading" id="loading">Generating...</div>
    <div id="canvasOutlet" ref="canvasOutlet"><div>
  </div>
  </div>
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

<script lang="ts">


export default {
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
    random() {
      return this.$route.query.random;
    }
  },

  destroyed() {
    document.body.style.backgroundColor = 'white';
  },

  mounted() {
    setTimeout(() => {
      const makeArtProps = {
        node: this.$refs.canvasOutlet,
        ...(!this.random && {seed: this.seed, paletteId: this.paletteId} )
      };

      const { seed, paletteId: pid, backgroundColor} = this.artFn && this.artFn(makeArtProps);

      const query = {
        seed,
        pid
      };

      if(this.random) {
        // @ts-ignore
        query.random = true;
      }

      this.$router.replace({
        path: `/${this.name}`,
        query
      }).catch(() => {});

      document.body.style.backgroundColor = backgroundColor;

      this.loading = false;
    }, 100);
  }
};
</script>
<template>
  <div class="container">
    <div class="content is-medium">
      <h1>Generative Art</h1>
      <p>Reloading an artwork will create a new seed for random. It will then randomly select a palette from <a href="https://github.com/mattdesl/nice-color-palettes/blob/master/200.json">nice-color-palettes.</a></p>
      <p>These paramaters are set in the url. You can remove <span class="is-italic has-text-weight-bold">random=true</span> as a parameter to regenerate the current art.</p>
      <p>Pressing cmd+s will save the canvas</p>
    </div>

    <div class="columns">
      <div class="column">
        <div class="columns is-multiline is-desktop">
          <div v-for="piece in artPieces" :key="piece.name" class="column is-one-third">
            <div class="card">
              <div class="card-image">
                <figure class="image is-1by1">
                  <router-link :to="piece.route" >
                    <img :src="piece.thumbnail" alt="Placeholder image" />
                  </router-link>
                </figure>
              </div>

              <div class="card-content">
                <div class="content">
                  <p class="title">
                    <router-link :to="piece.route" >{{piece.name}}</router-link>
                  </p>
                  <p>{{piece.blurb}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { name as squareRoute } from './Square/Square.vue';
import { name as linesRoute} from './Lines/Lines.vue';
import { name as linesRoute2} from './Lines2/Lines.vue';
import squaresPng from "./screenshots/squares.png";
import linesPng from "./screenshots/lines.png";
import squigglePng from "./screenshots/squiggle.png";

interface ArtPiece {
  name: string;
  thumbnail: string;
  route: object;
  blurb?: string;
}

interface Data {
  artPieces: ArtPiece[];
}

export default Vue.extend({
  data(): Data {
    return {
      artPieces: [
        {
          name: squareRoute,
          blurb: "Use dots to draw squares",
          thumbnail: squaresPng,
          route: {
            name: squareRoute, query: { random: true } 
          }
        },
        {
          name: linesRoute,
          blurb: "Toss a coin draw a diagonal",
          thumbnail: linesPng,
          route: { name: linesRoute, query: { random: true } }
        },
        {
          name: linesRoute2,
          blurb: "Toss a coin draw a squiggle",
          thumbnail: squigglePng,
          route: { name: linesRoute2, query: { random: true } }
        },
      ],
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  margin-top: 10px;

  .columns {
    .is-desktop {
      margin: 0;
    }
  }

  .is-vcentered {
    height: 100vh;
  }
}
</style>
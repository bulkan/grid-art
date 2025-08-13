<template>
  <div class="container">
    <div class="content is-medium has-text-black">
      <h1 class="title has-text-black">Generative Art</h1>
      <p>
        Reloading an artwork will create a new seed for random. It will then
        randomly select a palette from
        <a
          href="https://github.com/mattdesl/nice-color-palettes/blob/master/200.json"
          >nice-color-palettes.</a
        >
      </p>
      <p>
        These paramaters are set in the url. You can remove
        <span class="is-italic has-text-weight-bold">random=true</span> as a
        parameter to regenerate the current art.
      </p>
      <p>Pressing cmd+s will save the canvas</p>
    </div>

    <div class="columns">
      <div class="column">
        <div class="columns is-multiline is-desktop">
          <div
            v-for="piece in artPieces"
            :key="piece.name"
            class="column is-one-third"
          >
            <div class="card">
              <div class="card-image">
                <figure class="image is-1by1">
                  <router-link :to="piece.route">
                    <img :src="piece.thumbnail" alt="Placeholder image" />
                  </router-link>
                </figure>
              </div>

              <div class="card-content">
                <div class="content">
                  <p class="title">
                    <router-link :to="piece.route">{{
                      piece.name
                    }}</router-link>
                  </p>
                  <p>{{ piece.blurb }}</p>
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
import { name as squareRouteName } from "./Square/Square.vue";
import { name as lineRouteName } from "./Lines/Lines.vue";
import { name as squigglesRouteName } from "./Squiggles/Squiggles.vue";
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

export default {
  mounted() {
    document.body.style.backgroundColor = "white";
  },

  data(): Data {
    return {
      artPieces: [
        {
          name: squareRouteName,
          blurb: "Use dots to draw squares",
          thumbnail: squaresPng,
          route: {
            name: squareRouteName,
            query: { random: true },
          },
        },
        {
          name: lineRouteName,
          blurb: "Toss a coin draw a diagonal",
          thumbnail: linesPng,
          route: { name: lineRouteName, query: { random: true } },
        },
        {
          name: squigglesRouteName,
          blurb: "Toss a coin draw a squiggle",
          thumbnail: squigglePng,
          route: { name: squigglesRouteName, query: { random: true } },
        },
      ],
    };
  },
};
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
<template>
  <div class="container">
    <div class="content is-medium">
      <h1>grid art</h1>
      <p>Generative art based using a grid</p>
      <p>Pressing cmd+s will save the canvas</p>
    </div>

    <div class="columns">
      <div class="column">
        <div class="columns is-multiline is-desktop">
          <div v-for="piece in artPieces" :key="piece.name" class="column is-one-third">
            <div class="card">
              <div class="card-image">
                <figure class="image is-1by1">
                  <router-link :to="{ name: piece.name, query: { force: true } }" >
                    <img :src="piece.thumbnail" alt="Placeholder image" />
                  </router-link>
                </figure>
              </div>

              <div class="card-content">
                <div class="content">
                  <p class="title">
                    <router-link :to="{ name: piece.name }" >{{piece.name}}</router-link>
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
import squaresPng from "./screenshots/squares.png";

interface ArtPiece {
  name: string;
  thumbnail: string;
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
          name: "squares",
          blurb: "Use dots to draw squares",
          thumbnail: squaresPng,
        },
        {
          name: "lines",
          blurb: "Toss a coin draw a diagonal",
          thumbnail: "https://via.placeholder.com/200",
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
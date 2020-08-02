<template>
  <div class="container is-fluid">
    <div class="columns">
      <div class="column">
        <div class="columns is-multiline">
          <div v-for="piece in artPieces" :key="piece.name" class="column is-one-third">
            <div class="card">
              <div class="card-image">
                <figure class="image is-1by1">
                  <img :src="piece.thumbnail" alt="Placeholder image" />
                </figure>
              </div>

              <div class="card-content">
                <div class="content">
                  <p class="title">
                    <router-link to="/squares">{{piece.name}}</router-link>
                  </p>
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

interface ArtPieces {
  name: string;
  thumbnail: string;
}

interface Data {
  artPieces: ArtPieces[];
}

export default Vue.extend({
  data(): Data {
    return {
      artPieces: [
        {
          name: "squares",
          thumbnail: squaresPng,
        },
        {
          name: "lines",
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
  margin-top: 100px;

  .is-vcentered {
    height: 100vh;
  }
}
</style>
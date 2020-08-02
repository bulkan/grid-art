<template>
  <div class="container">
    <div class="columns is-vcentered">
      <div class="column">
        <div class="columns is-multiline">
          <div v-for="piece in artPieces" :key="piece.name" class="column is-one-third">
            <div class="card">
              <div class="card-image">
                <figure class="image is-1by1">
                  <img
                    src="https://via.placeholder.com/200"
                    alt="Placeholder image"
                  />
                </figure>
              </div>

              <div class="card-content">
                <div class="content">
                  <p class="title">{{piece.name}}</p>
                  <a href="#">#css</a>
                  <a href="#">#responsive</a>
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
          thumbnail: "",
        },
        {
          name: "grid",
          thumbnail: "",
        }
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
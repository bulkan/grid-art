<template>
  <div>
    <div v-for="piece in artPieces" :key="piece.name">{{ piece.name }}</div>
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
          name: 'squres',
          thumbnail: '',
        }
      ]
    };
  }
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
}
</style>
<template>
  <Art :art-fn="makeArt" :name="name" />
</template>

<script lang="ts">
import { makeArt } from "./art";

export const name = "square";

export default {
  data() {
    return {
      name,
      makeArt
    }
  }  
};

</script>
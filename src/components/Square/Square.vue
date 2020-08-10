<template>
  <Art :art-fn="makeArt" :name="name" />
</template>

<script>
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
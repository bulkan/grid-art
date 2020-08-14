<template>
  <Art :art-fn="makeArt" :name="name" />
</template>

<script>
import { makeArt } from "./makeLinesArt";

export const name = "squiggles";

export default {
  data() {
    return {
      name,
      makeArt
    }
  }  
}
</script>
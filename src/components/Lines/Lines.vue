<template>
  <Art :art-fn="makeArt" :name="name" />
</template>

<script lang="ts">
import { makeArt } from "./makeLinesArt";

export const name = "lines";

export default {
  data() {
    return {
      name,
      makeArt
    }
  }  
}
</script>
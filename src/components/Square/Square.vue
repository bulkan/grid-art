<template>
  <Art :art-fn="makeArt" name="squares" />
</template>

<script>
import { makeArt } from "./art";

export default {
  data() {
    return {
      makeArt
    }
  }  
}
</script>
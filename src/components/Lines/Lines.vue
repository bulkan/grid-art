<template>
  <Art :art-fn="makeArt" name="lines" />
</template>

<script>
import { makeArt } from "./makeLinesArt";

export default {
  data() {
    return {
      makeArt
    }
  }  
}
</script>
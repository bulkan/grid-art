<template>
  <Art :art-fn="makeArt" :name="name" />
</template>

<script>
import { makeArt } from "./makeArt";

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
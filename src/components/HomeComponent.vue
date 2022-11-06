<!-- eslint-disable prettier/prettier -->
<template>
  <h1>Bienvenue</h1>
  <img src="../assets/img/medical.jpg" alt="">
</template>

<!-- eslint-disable prettier/prettier -->
<script>
export default {
    name: "HomeComponent",
}
</script>

<!-- eslint-disable prettier/prettier -->
<style scoped>
h1 {
    position: relative;
    width: 50%;
    left: 50%;
    transform: translateX(-50%);
    margin: 0.5em 0;
    opacity: 50%;
    text-align: center;
  }
  img {
    position: relative;
    width: max(40vw, 20rem);
    left: 50%;
    transform: translateX(-50%);
    z-index: 99;
    box-shadow: 10px 10px 12px rgba(0, 0, 0, 0.2);
  }
</style>
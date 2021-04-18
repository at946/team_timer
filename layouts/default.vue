<template>
  <div style="display: flex; flex-direction: column; height: 100vh;">
    <main style="flex: 1;"><nuxt /></main>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue'

export default {
  components: {
    Footer
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap');
@import '@/assets/css/_color.scss';

html, body {
  font-family: 'Quicksand' !important;
  text-align: center;
  color: $black;
  background-color: $back;
  margin: 0;
}
</style>

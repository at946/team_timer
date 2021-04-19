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
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

@import '@/assets/css/_color.scss';

html, body {
  font-family: 'Quicksand' !important;
  text-align: center;
  color: $black;
  background: $primary;
  margin: 0;
  padding: 0 .5rem;
}

.button {
  padding: 1rem 2rem;
  background: $primary;
  border-width: 0;
  border-radius: 3rem;
  box-shadow: 3px 3px 5px darken($primary, 20%), -3px -3px 5px lighten($primary, 10%);

  &:hover, &:focus {
    background: darken($primary, 10%);

    &:disabled {
      background: $primary;
    }
  }

  &:active {
    box-shadow: inset 3px 3px 5px darken($primary, 20%), inset -3px -3px 5px lighten($primary, 10%);
  }

  &:disabled {
    box-shadow: inset 3px 3px 5px darken($primary, 20%), inset -3px -3px 5px lighten($primary, 10%);
    color: lighten($black, 50%);
  }
}

a {
  &:focus {
    outline: none;
    text-decoration: underline;
  }
}

.wrapper-icons {
  display: inline-flex;
  align-items: center;
}
</style>

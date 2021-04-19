<template>
  <footer>
    <div class="mb-1">
      <button class="button wrapper-icons p-1" @click="shareToTwitter">
        <fa :icon="faTwitter" class="text-twitter" />
      </button>
    </div>
    <div>created by <a href="https://twitter.com/at_946" target="_blank" class="text-twitter">at946</a></div>
  </footer>
</template>

<script>
import { faTwitter } from '@fortawesome/free-brands-svg-icons';

export default {
  computed: {
    faTwitter() { return faTwitter }
  },

  methods: {
    shareToTwitter() {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent('Team Timer #teamtimer\n')}&url=${encodeURIComponent(window.location.origin)}`,
        "_blank"
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_color.scss';

footer {
  margin: 1rem 0;
}
</style>
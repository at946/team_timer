<template>
  <footer class="py-2">
    <div class="mb-2">
      <button class="button wrapper-icons p-1" @click="shareToTwitter">
        <fa :icon="faTwitter" class="text-twitter" />
      </button>
    </div>
    <div class="mb-1">
      <nuxt-link to="/terms_of_service" class="mx-1">利用規約</nuxt-link>
      <nuxt-link to="/privacy_policy" class="mx-1">プライバシーポリシー</nuxt-link>
    </div>
    <div>
      created by <a href="https://twitter.com/at_946" target="_blank" class="text-twitter">at946</a>
    </div>
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
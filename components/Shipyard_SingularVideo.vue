<template>
  <section
    v-if="project.video && embedUrl"
    id="section-video">
    <div class="video-wrapper">
      <iframe
        :src="embedUrl"
        class="video"
        allow="autoplay; encrypted-media"
        allowfullscreen>
      </iframe>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ShipyardSingularVideo',

  props: {
    project: {
      type: Object,
      required: true
    }
  },

  computed: {
    embedUrl () {
      return this.$BuildVideoEmbedUrl(this.$ParseVideoUrl(this.project.video))
    }
  }
}
</script>

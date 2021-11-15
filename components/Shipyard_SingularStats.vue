<template>
  <section v-if="project.stats" id="section-statistics">

    <template v-for="(stat, i) in project.stats">
      <div
        v-if="stat.value && stat.label"
        :key="`big-number-${i}`"
        :class="['card', 'big-number', { 'hide-tiny': mobile } ]">
        <p class="statistic">
          {{ stat.value }}
        </p>
        <p class="description">
          {{ stat.label }}
        </p>
      </div>
    </template>

    <div
      v-if="project.ctaCard && project.ctaCard.title && project.ctaCard.description"
      :class="['card', 'case-study', { 'hide-tiny': mobile } ]">
      <p v-if="project.ctaCard.title" class="title">
        {{ project.ctaCard.title }}
      </p>
      <p v-if="project.ctaCard.description" class="description">
        {{ project.ctaCard.description }}
      </p>
      <a
        v-if="project.ctaCard.url && project.ctaCard.buttonText"
        class="cta focus-visible"
        :href="project.ctaCard.url"
        target="_blank">
        {{ project.ctaCard.buttonText }}
      </a>
    </div>

    <div
      v-if="mobile"
      class="slider-display col-6_md-8_mi-10_ti-12">
      <div
        class="slide-nav">
        <button
          class="nav-arrow focus-visible"
          @click="$emit('increment-left')">
          <Shipyard_PrevArrowIcon class="prev-arrow" width="10" height="15" />
        </button>
        <button
          class="nav-arrow focus-visible"
          @click="$emit('increment-right')">
          <Shipyard_NextArrowIcon class="next-arrow" width="10" height="15" />
        </button>
      </div>
      <div
        ref="sliderFlex"
        class="slider-flex slider-transition">
        <div
          v-for="slide in slider"
          :key="slide.label || slide.title"
          v-hammer:swipe.horizontal="$emit('on-swipe')"
          :class="['card', (slide.label ? 'big-number' : 'case-study'), 'slider-mobile', { 'more-than-two' : mobile }]">
          <p :class="(slide.label ? 'statistic' : 'title')">
            {{ slide.value || slide.title }}
          </p>
          <p class="description">
            {{ slide.label || slide.description }}
          </p>
          <a
            v-if="slide.url && slide.buttonText"
            class="cta"
            :href="slide.url"
            target="_blank">
            {{ slide.buttonText }}
          </a>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
export default {
  name: 'ShipyardSingularStats',

  props: {
    project: {
      type: Object,
      required: true
    },
    mobile: {
      type: Boolean,
      required: true
    },
    slider: {
      type: Array,
      required: true
    }
  }
}
</script>

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
          @click="incrementLeft">
          <Shipyard_PrevArrowIcon class="prev-arrow" width="10" height="15" />
        </button>
        <button
          class="nav-arrow focus-visible"
          @click="incrementRight">
          <Shipyard_NextArrowIcon class="next-arrow" width="10" height="15" />
        </button>
      </div>
      <div
        ref="sliderFlex"
        class="slider-flex slider-transition">
        <div
          v-for="slide in slider"
          :key="slide.label || slide.title"
          v-hammer:swipe.horizontal="onSwipe"
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
// =================================================================== Functions
const repositionSliderLeft = (instance) => {
  if (window.matchMedia('(max-width: 25.9375rem)').matches && instance.$refs.sliderFlex) { // tiny
    const slide = instance.$refs.sliderFlex.firstChild
    const amt = (instance.slider.length === 4) ? 1 : 0
    const shift = slide.offsetWidth + (2 * parseFloat(getComputedStyle(slide).marginLeft))
    instance.$refs.sliderFlex.style.left = (amt * ((shift / 2) * -1)) + 'px'
  }
}

// ====================================================================== Export
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
  },

  data () {
    return {
      resize: false
    }
  },

  mounted () {
    repositionSliderLeft(this)
    this.resize = () => { repositionSliderLeft(this) }
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    incrementLeft () {
      this.$refs.sliderFlex.classList.remove('slider-transition')
      const flex = this.$refs.sliderFlex
      const last = flex.lastElementChild
      const first = flex.firstElementChild
      flex.insertBefore(last, first)

      const slide = this.$refs.sliderFlex.firstChild
      const shift = slide.offsetWidth + (2 * parseFloat(getComputedStyle(slide).marginLeft))

      flex.style.left = parseFloat(flex.style.left) + shift * -1 + 'px'
      setTimeout(() => {
        this.$refs.sliderFlex.classList.add('slider-transition')
        flex.style.left = parseFloat(flex.style.left) + shift + 'px'
      }, 100)
    },
    incrementRight () {
      this.$refs.sliderFlex.classList.remove('slider-transition')
      const flex = this.$refs.sliderFlex
      const last = flex.lastElementChild
      const first = flex.firstElementChild
      last.parentNode.insertBefore(first, last.nextSibling)

      const slide = this.$refs.sliderFlex.firstChild
      const shift = slide.offsetWidth + (2 * parseFloat(getComputedStyle(slide).marginLeft))

      flex.style.left = parseFloat(flex.style.left) + shift + 'px'
      setTimeout(() => {
        this.$refs.sliderFlex.classList.add('slider-transition')
        flex.style.left = parseFloat(flex.style.left) + shift * -1 + 'px'
      }, 100)
    },
    onSwipe (e) {
      if (e.type === 'swipeleft') {
        this.$emit('increment-left')
      } else if (e.type === 'swiperight') {
        this.$emit('increment-right')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// //////////////////////////////////////////////////////// [Section] Statistics
#section-statistics {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  &.stats-bottom {
    padding-bottom: 2rem;
  }
}

.card {
  @include borderRadius_Medium;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: calc(50% - 0.5rem);
  padding: 3rem;
  margin-bottom: 1rem;
  @include small {
    padding: 2rem;
  }
  @include mini {
    padding: 1rem;
  }
  @include tiny {
    min-width: calc(100vw - 4rem);
    max-width: calc(100vw - 4rem);
    width: calc(100vw - 4rem) !important;
    box-sizing: border-box;
    padding: 2rem;
  }
  &:nth-child(odd) {
    margin-right: 1rem;
    @include tiny {
      margin-right: 0;
    }
  }
  &.big-number {
    @include mini {
      padding: 2rem 1rem;
    }
    @include tiny {
      padding: 3rem 2rem;
    }
    .statistic {
      @include leading_Mini;
      font-size: 2.625rem;
      @include small {
        @include fontSize_ExtraLarge;
      }
      @include tiny {
        margin-top: 1.5rem;
        @include fontSize_ExtraExtraLarge;
      }
    }
    .description {
      @include fontSize_Large;
      @include leading_Mini;
      @include small {
        margin-bottom: 1rem;
      }
      @include tiny {
        margin-top: 1rem;
      }
    }
  }
  &.case-study {
    border-width: 2px;
    border-style: solid;
    @include tiny {
      padding: 3rem 2rem;
    }
    .title {
      @include fontSize_Large;
      @include leading_Mini;
      @include tiny {
        margin: 1rem 0;
      }
    }
    .description {
      @include fontSize_Small;
      @include leading_Mini;
      @include tiny {
        margin-bottom: 1rem;
      }
    }
    .cta {
      @include borderRadius_Medium;
      @include fontSize_Small;
      padding: 0.5625rem 2rem;
      margin-top: 2rem;
      font-weight: 600;
      border: 2px solid;
      transition: 250ms ease-out;
      &:hover {
        transition: 250ms ease-in;
        color: white;
      }
    }
  }
  &.hide-tiny {
    @include tiny {
      display: none;
    }
  }
  .statistic,
  .title {
    margin-bottom: 1rem;
    @include tiny {
      margin-bottom: 0;
    }
  }
}

.slider-display {
  overflow: hidden;
  display: none;
  @include tiny {
    display: block;
  }
}

.slider-flex {
  display: none;
  @include tiny {
    position: relative;
    display: flex;
    justify-content: center;
  }
}

.slider-transition {
  transition: all 500ms ease-in-out;
}

.slider-mobile {
  display: none;
  &.more-than-two {
    @include tiny {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1 1 auto;
      margin: 0 1rem;
    }
    &.big-number {
      @include tiny {
        flex-direction: column-reverse;
      }
    }
  }
}

.slide-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @include tiny {
    justify-content: space-around;
  }
}

.nav-arrow {
  @include borderRadius_Medium;
  transform: translateY(calc(100% + 1.5rem));
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  margin: 0rem 1.5rem;
  stroke: rgba(0, 0, 0, 0.5);
  border: none;
  font-weight: 900;
  width: 3.75rem;
  z-index: 100;
  @include small {
    width: auto;
  }
  &:hover {
    stroke: rgb(2, 28, 54);
  }
  &:focus {
    outline: none;
  }
}
</style>

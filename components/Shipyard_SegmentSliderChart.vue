<template>
  <div id="segment-slider-chart" ref="chartFlex" class="chart-container">
    <div
      ref="segmentsCtn"
      class="segments-container"
      :style="`height: ${tiers.third * 2}px;`">

      <div class="chart-title">
        <h3>{{ mobileChartTitle }}</h3>
      </div>

      <div
        v-for="item in segments"
        :key="`dummy-${item.label.text}`"
        ref="dummyLabels"
        class="measure">
        {{ item.label.text }}
      </div>

      <div
        v-if="measured"
        ref="segmentsRow"
        :class="['segments-row', measured ? '' : 'fixed-for-measuring']">

        <div
          v-for="(item, index) in segments"
          :key="index"
          :class="['segment-wrapper', selectedSeg === index ? 'selected' : '']"
          :style="getSegmentStyle(item, index)"
          @click="updateParent(index)">

          <div
            :class="['indicator', 'slot-1', index % 2 === 0 ? 'above' : 'below']"
            :style="`width: ${item.segment.s1.length}px; left: ${item.segment.ihw}px; top: ${getLabelOffset(item, index, 'first')}px;`">
            <template v-if="item.segment.s1.occupied">
              <div class="label">
                <div class="stem-relative-wrap" :style="`width: ${item.label.width}px;`">
                  <span class="label-text">{{ item.label.text }}</span>
                  <div
                    class="stem first"
                    :style="`height: ${tiers.first + item.label.offset}px;`">
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div
            :class="['indicator', 'slot-2', index % 2 === 0 ? 'above' : 'below']"
            :style="`width: ${item.segment.s2.length}px; left: ${item.segment.ihw}px; top: ${getLabelOffset(item, index, 'second')}px;`">
            <template v-if="item.segment.s2.occupied">
              <div class="label">
                <div class="stem-relative-wrap" :style="`width: ${item.label.width}px;`">
                  <span class="label-text">{{ item.label.text }}</span>
                  <div
                    class="stem second"
                    :style="`height: ${tiers.second + item.label.offset}px;`">
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div
            :class="['indicator', 'slot-3', index % 2 === 0 ? 'above' : 'below']"
            :style="`width: ${item.segment.s3.length}px; left: ${item.segment.ihw}px; top: ${getLabelOffset(item, index, 'third')}px;`">
            <template v-if="item.segment.s3.occupied">
              <div class="label">
                <div class="stem-relative-wrap" :style="`width: ${item.label.width}px;`">
                  <span class="label-text">{{ item.label.text }}</span>
                  <div
                    class="stem third"
                    :style="`height: ${tiers.third + item.label.offset}px;`">
                  </div>
                </div>
              </div>
            </template>
          </div>

          <div
            :class="['block-segment', setForegrounded(index), { 'displaced-down': (item.count > 4) && index % 2 === 0 }, { 'displaced-up': (item.count > 4) && index % 2 === 1 }]">
            <div class="dots"></div>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

// =================================================================== Functions
const calculateSegmentAndLabelData = (dummies, instance, next) => {
  for (let i = 0; i < dummies.length; i++) {
    const rect = dummies[i].getBoundingClientRect()
    const dimensions = {
      width: rect.width,
      height: rect.height,
      offset: Math.random() * instance.random
    }
    Object.assign(instance.segments[i].label, dimensions)

    const num = instance.segments[i].count
    const percent = num / instance.totalProjects
    instance.segments[i].segment = {
      percent: percent * 100,
      ihw: (percent * 572) / 2
    }
  }

  return next()
}

const calculateSlotsData = (instance, next) => {
  const len = instance.segments.length
  for (let i = 0; i < len; i++) {
    const items = instance.segments
    const hasFirstNeighbor = i < len - 2
    items[i].segment.s1 = {
      length: hasFirstNeighbor
        ? (
            items[i].segment.ihw +
            items[i + 1].segment.ihw * 2 +
            items[i + 2].segment.ihw
          )
        : 1000,
      occupied: false
    }

    const hasSecondNeighbor = i < len - 4
    items[i].segment.s2 = {
      length: hasSecondNeighbor
        ? (
            items[i].segment.ihw +
            items[i + 1].segment.ihw * 2 +
            items[i + 2].segment.ihw * 2 +
            items[i + 3].segment.ihw * 2 +
            items[i + 4].segment.ihw
          )
        : 1000,
      occupied: false
    }

    const hasThirdNeighbor = i < len - 6
    items[i].segment.s3 = {
      length: hasThirdNeighbor
        ? (
            items[i].segment.ihw +
            items[i + 1].segment.ihw * 2 +
            items[i + 2].segment.ihw * 2 +
            items[i + 3].segment.ihw * 2 +
            items[i + 4].segment.ihw * 2 +
            items[i + 5].segment.ihw * 2 +
            items[i + 6].segment.ihw
          )
        : 1000,
      occupied: false
    }
  }

  instance.measured = true
  return next()
}

const positionFirstTierLabels = (instance, n, next) => {
  const segments = instance.segments
  for (let i = n; i < segments.length; i = i + 2) {
    if (segments[i].label.width < segments[i].segment.s1.length) {
      segments[i].segment.s1.occupied = true
    }
  }
  return next()
}

const positionSecondTierLabels = (instance, n, next) => {
  const segments = instance.segments
  const modulo = Boolean(segments.length % 2)
  const start = (segments.length - 1 - (!modulo ? n : n ? 0 : 1))
  for (let i = start; n <= i; i = i - 2) {
  // for (let i = n; i < segments.length; i = i + 2) {

    const h = Math.max(i - 2, n)
    const j = Math.min(i + 2, start)

    if (
      segments[i].label.width < segments[i].segment.s2.length &&
      !segments[i].segment.s1.occupied &&
      !segments[h].segment.s2.occupied && !segments[j].segment.s2.occupied &&
      !segments[j].segment.s3.occupied
    ) {
      segments[i].segment.s2.occupied = true
    }
  }
  return next()
}

const positionThirdTierLabels = (instance, n, next) => {
  const segments = instance.segments
  const modulo = Boolean(segments.length % 2)
  const end = (segments.length - 1 - (!modulo ? n : n ? 0 : 1))
  for (let i = n; i < segments.length; i = i + 2) {
    const g = Math.max(i - 4, n)
    const h = Math.max(i - 2, n)
    const j = Math.min(i + 2, end)
    const k = Math.min(i + 4, end)

    if (
      segments[i].label.width < segments[i].segment.s3.length &&
      !segments[i].segment.s1.occupied &&
      !segments[h].segment.s2.occupied && !segments[i].segment.s2.occupied &&
      !segments[g].segment.s3.occupied && !segments[h].segment.s3.occupied && !segments[j].segment.s3.occupied && !segments[k].segment.s3.occupied
    ) {
      segments[i].segment.s3.occupied = true
    }
  }
  return next()
}

const reOrderBasedOnScore = (instance, next) => {
  const segments = instance.segments

  const ordered = []
  for (let i = 0; i < segments.length; i++) {
    const score = -1 * (segments[i].segment.ihw - segments[i].label.width)
    instance.segments[i].score = score
  }

  const ascending = CloneDeep(instance.segments)
  ascending.sort((a, b) => a.score - b.score)

  let last, first
  for (let i = 0; i < ascending.length; i++) {
    if (ascending[i].hasOwnProperty('priority')) {
      if (ascending[i].priority === 'last') {
        last = ascending.splice(i, 1)
        break
      }
    }
  }
  for (let i = 0; i < ascending.length; i++) {
    if (ascending[i].hasOwnProperty('priority')) {
      if (ascending[i].priority === 'first') {
        first = ascending.splice(i, 1)
        break
      }
    }
  }

  const l = ascending.length
  const s = Math.ceil(l / 2)

  const firstHalf = ascending.splice(0, s)
  ascending.reverse()

  for (let i = 0; i < s; i = i + 2) {
    if (typeof ascending[i] !== 'undefined') {
      ordered.push(ascending[i])
    }
    if (typeof ascending[i + 1] !== 'undefined') {
      ordered.push(ascending[i + 1])
    }
    if (typeof firstHalf[i] !== 'undefined') {
      ordered.push(firstHalf[i])
    }
    if (typeof firstHalf[i + 1] !== 'undefined') {
      ordered.push(firstHalf[i + 1])
    }
  }
  ordered.reverse()

  if (first) { ordered.unshift(first[0]) }
  if (last) { ordered.push(last[0]) }

  instance.measured = true
  instance.segments = ordered
  const col = CloneDeep(instance.segments)
  instance.setSegmentCollection(col)
  return next()
}

// ====================================================================== Export
export default {
  name: 'ShipyardSegmentSliderChart',

  props: {
    chartItems: {
      type: Array,
      default: () => []
    },
    selectedSeg: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      segments: this.chartItems,
      measured: false,
      random: 10,
      tiers: {
        first: 60,
        second: 100,
        third: 140
      }
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      segmentCollection: 'core/segmentCollection'
    }),
    segmentSliderContent () {
      return this.siteContent.index.page_content.segment_slider
    },
    mobileChartTitle () {
      return this.segmentSliderContent.mobile_chart_title
    },
    totalProjects () {
      let total = 0
      for (let i = 0; i < this.chartItems.length; i++) {
        total = total + this.chartItems[i].count
      }
      return total
    }
  },

  watch: {
    selectedSeg (val) {
      if (this.$Countly) {
        const segment = this.segmentCollection[val]
        this.$Countly.trackEvent('Segment Chart | Segment Clicked', {
          label: segment.label,
          slug: segment.slug
        })
      }
    }
  },

  mounted () {
    this.$nextTick(() => {
      if (this.$refs.dummyLabels?.length === this.chartItems.length) {
        calculateSegmentAndLabelData(this.$refs.dummyLabels, this, () => {
          reOrderBasedOnScore(this, () => {
            calculateSlotsData(this, () => {
              positionFirstTierLabels(this, 0, () => {
                positionFirstTierLabels(this, 1, () => {
                  positionSecondTierLabels(this, 0, () => {
                    positionSecondTierLabels(this, 1, () => {
                      positionThirdTierLabels(this, 0, () => {
                        positionThirdTierLabels(this, 1, () => {
                          console.log('labels loaded')
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      }
    })
  },

  methods: {
    ...mapActions({
      setSegmentCollection: 'core/setSegmentCollection'
    }),
    updateParent (seg) {
      this.$emit('update-slider', seg)
    },
    setForegrounded (ind) {
      return (this.selectedSeg === ind) ? 'segment-foreground' : 'segment-background'
    },
    getSegmentStyle (item, i) {
      return `width: ${item.segment.percent}%; z-index: ${this.segments.length - i};`
    },
    getLabelOffset (item, i, tier) {
      return ((-1 * this.tiers[tier]) - item.label.offset) * (i % 2 === 0 ? 1 : -1)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#segment-slider-chart {
  padding-top: 2rem;
  @include large {
    margin-bottom: 3rem;
  }
  @include medium {
    padding-top: 6rem;
    margin-bottom: 0;
  }
  @include small {
    padding-top: 0;
    margin-bottom: 0rem;
  }
}

.chart-container {
  position: relative;
  flex: 3 1 42.75rem;
}

.segments-container {
  @include borderRadius_Medium;
  position: relative;
  padding: 0 2.5rem;
  @include medium {
    padding: 0 6rem;
    padding-bottom: 7rem;
  }
  @include small {
    padding: 0 3rem;
    padding-bottom: 0;
  }
  @include tiny {
    min-width: 16rem;
    padding: 0 2rem;
    padding-bottom: 0;
  }
}

.chart-title {
  visibility: hidden;
  height: 50%;
  margin: 0;
  @include small {
    visibility: visible;
    padding: 2rem 0;
  }
}

$segmentStemGap: 6px;

.segments-row {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  > div {
    margin: 0 2px;
  }

  &.fixed-for-measuring {
    width: 572px;
  }

  &:before {
    content: '';
    position: absolute;
    top: calc(0px - #{$segmentStemGap});
    left: 0;
    height: $segmentStemGap;
    width: 100%;
    background-color: $site_backgroundColor;
    z-index: 1000;
  }

  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    height: $segmentStemGap;
    width: 100%;
    background-color: $site_backgroundColor;
    z-index: 1000;
  }

  @include medium {
    &:before,
    &:after {
      background-color: white;
    }
  }
}

// ///////////////////////////////////////////////// Segments functional styling
.measure {
  display: inline-block;
  position: absolute;
  font-family: $font_Secondary;
  letter-spacing: 0.015em;
  line-height: $leading_Tiny;
  font-size: $fontSize_Mini;
  max-width: 120px;
  margin: 0;
  color: red;
  opacity: 0.0;
  font-size: 11pt;
}

.segment-wrapper {
  position: relative;
  height: 1.75rem;
  box-sizing: border-box;
  .segment-id {
    font-size: 5px;
    line-height: 1;
  }
  .indicator {
    position: absolute;

    &.below {
      transform: translateY(2rem);
      .stem {
        transform: translateY(-4px) rotate(180deg);
        bottom: unset;
        top: 0;
      }
    }

    .label {
      position: absolute;
      top: -0.5rem;
      left: 0;
      text-align: left;
      line-height: $leading_Tiny;
      z-index: -1000;
      @include small {
        display: none;
      }
      .label-text {
        top: 0;
        left: 0;
        color: #181818;
        font-family: $font_Secondary;
        font-size: 0.625rem;
        letter-spacing: 0.015em;
        line-height: $leading_Tiny;
        text-align: left;
        user-select: none;
        white-space: normal;
        transition: 250ms linear;
      }
    }

    .stem-relative-wrap {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .stem {
      position: absolute;
      border-left: 1px solid rgba(#181818, 0.1);
      left: 0;
      bottom: 0;
      transform-origin: top;
      transform: translateY(calc(100% + 4px));
      z-index: -1000;
    }
  }

  &.selected {
    .label-text {
      font-weight: bold;
    }
  }
}

.segment-foreground {
  &:after {
    background-position: 100% 0%;
  }
}

.block-segment {
  @include borderRadius_Small;
  position: relative;
  height: 100%;
  width: 100%;
  top: 0px;
  left: 0px;
  cursor: pointer;
  transition: background-color 250ms linear, font-weight 250ms linear;
  &:before {
    @include borderRadius_Small;
    content: '';
    background-color: inherit;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: transform 200ms linear;
  }
  &:hover:before {
    transform: scale(1.02, 1.15);
  }
}
</style>

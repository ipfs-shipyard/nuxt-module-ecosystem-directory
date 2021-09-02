<template>
  <button
    v-click-outside="closeAllDropdown"
    :class="['dropdown-wrapper', 'focus-visible', { closed }]"
    @keyup.enter="toggleDropDown()">

    <div
      class="dropdown-button"
      @click="toggleDropDown()">

      <div
        ref="dropdownInner"
        class="button-inner">
        <label>
          {{ items.label }}
        </label>

        <div class="dropdown-toggle">
          <slot name="dropdown-icon"></slot>
        </div>
      </div>

      <div class="dropdown-root" :style="{ height: `${height}px` }">

        <div ref="dropdownList" class="dropdown-list">
          <component
            :is="items.type"
            :key="`div-link-${items.label}`"
            :to="items.disabled ? '' : items.href"
            :href="items.disabled ? '' : items.href"
            :disabled="items.disabled"
            :target="items.target"
            class="dropdown-item focus-visible">
            {{ items.label }}
          </component>
          <component
            :is="link.type"
            v-for="link in items.links"
            :key="`div-link-${link.label}`"
            :to="link.disabled ? '' : link.href"
            :href="link.disabled ? '' : link.href"
            :disabled="link.disabled"
            :target="link.target"
            class="dropdown-item focus-visible">
            {{ link.label }}
          </component>
        </div>

      </div>

    </div>

    <div class="shadow" :style="{ height: `${height}px` }"></div>

  </button>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'ShipyardNavigationDropdown',

  props: {
    items: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      closed: true,
      dropdownButtonHeight: 0,
      dropdownListHeight: 0,
      height: 0,
      resize: false
    }
  },

  mounted () {
    this.setHeights()
    this.resize = () => { this.setHeights() }
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    setHeights () {
      this.dropdownListHeight = this.$refs.dropdownList.clientHeight
    },
    toggleDropDown () {
      this.closed = !this.closed
      if (this.closed) {
        this.height = 0
      } else {
        this.height = this.dropdownListHeight
      }
      this.$emit('changed', {
        event: 'toggleDropdown',
        data: {
          state: !this.closed ? 'open' : 'closed'
        }
      })
    },
    closeAllDropdown () {
      this.height = 0
      if (!this.closed) {
        this.$emit('changed', {
          event: 'toggleDropdown',
          data: {
            state: 'closed'
          }
        })
      }
      this.closed = true
    }
  }
}
</script>

<style lang="scss" scoped>
::selection {
  color: none;
  background: none;
}

::-moz-selection {
  color: none;
  background: none;
}

.dropdown-wrapper {
  @include borderRadius_Medium;
  position: relative;
  white-space: nowrap;
  font-weight: 400;
  line-height: 1.7;
  cursor: pointer;
  z-index: 1000;
  transition: 250ms ease-out;
}

.dropdown-button {
  display: block;
  .button-inner {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 0.25rem 1.0rem;
    z-index: 20;
    label {
      margin-right: 0.25rem;
    }
  }
}

.dropdown-toggle {
  transform: translateY(-5%);
  opacity: 0.5;
  margin-left: 0.5rem;
  transition: 250ms ease-out;
  &:hover {
    cursor: pointer;
    opacity: 1.0;
  }
}

.dropdown-root {
  @include borderRadius_Medium;
  background: $gray900;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding-bottom: 2.0rem;
  overflow: hidden;
  z-index: 10;
  transition: height 250ms ease-in-out;
}

.shadow {
  @include borderRadius_Medium;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  filter: drop-shadow(0 0 0.3rem rgba(73, 73, 73, 0.2));
  opacity: 0;
  z-index: 0;
  transition: 250ms ease-out;
}

.dropdown-list {
  width: 100%;
  text-align: right;
  box-sizing: border-box;
}

.dropdown-item {
  padding: 0.25rem 1.0rem;
  width: 100%;
  display: flex;
  white-space: normal;
  &:not(.highlighted) {
    text-decoration: underline transparent;
    text-underline-offset: $underlineSpacing;
    cursor: pointer;
    transition: text-decoration-color 250ms ease-out;
    &:hover {
      transition: text-decoration-color 250ms ease-in;
      text-decoration-color: currentColor;
    }
  }
}

.highlighted {
  cursor: default;
}
</style>

<template>
  <div :class="`page page-${tag} ${id} container`">

    <div v-if="breadcrumbs" class="grid">
      <div class="col">
        <section id="section-breadcrumbs">
          <Zero_Core__Breadcrumbs v-if="breadcrumbs" :breadcrumbs="breadcrumbs" />
        </section>
      </div>
    </div>

    <div class="grid">
      <div class="col-5_md-12">
        <section id="section-project-info">
          <img
            v-if="project.logo && project.logo.full"
            class="logo"
            :src="$relativity(`/images/projects/${project.logo.full}`)"
            :alt="`${project.name} logo`">

          <h1 v-if="project.name" class="name">
            {{ project.name }}
          </h1>
          <h2 v-if="organizations" class="company">
            {{ organizations }}
          </h2>
          <p v-if="description" class="description">
            {{ description }}
          </p>
          <div class="ctas">
            <a
              v-if="project.primaryCta && project.primaryCta.url && project.primaryCta.text"
              :href="project.primaryCta.url"
              target="_blank"
              class="primary-cta focus-visible">
              <span
                :data-tooltip="project.primaryCta.url"
                data-tooltip-theme="dark">
                {{ project.primaryCta.text }}
              </span>
            </a>
            <nuxt-link to="/" class="secondary-cta focus-visible">
              <span class="text">
                {{ secondaryCtaButtonText }}
              </span>
              <Shipyard_ChevronIcon />
            </nuxt-link>
          </div>
        </section>
      </div>

      <div class="col-6_md-10_mi-12" data-push-left="off-1_md-0">

        <component
          :is="pageTopRightComponent"
          :project="project"
          :mobile="moreThanTwo"
          :slider="slider"
          :class="{ 'video-top' : pageTopRightComponent === 'Shipyard_SingularVideo' }" />

      </div>
    </div>

    <div class="grid">
      <div class="col-5_mi-10_mi-12">
        <section v-if="project.links || project.keyInfo" id="section-key-info">
          <h3 class="heading">
            {{ metadataHeading }}
          </h3>

          <dl v-if="project.links" class="values">
            <template v-for="(linkGroup, i) in project.links">
              <template v-if="linkGroup.label && checkIfArrayOfNullObjectValues(linkGroup.links)">
                <dt :key="`project-link-key-${i}`" class="name">
                  {{ linkGroup.label }}
                </dt>
                <dd :key="`project-val-${i}`">
                  <ul class="links">
                    <template v-for="(link, j) in linkGroup.links">
                      <li
                        v-if="link.text && link.url"
                        :key="`link-group-${j}`">
                        <a
                          :href="link.url"
                          target="_blank"
                          class="focus-visible"
                          :data-tooltip="generateToolTip(link.text)"
                          data-tooltip-theme="dark">
                          {{ truncateLinks ? $TruncateString(link.text, 14, '...', type = 'double', 14) : link.text }}
                        </a>
                      </li>
                    </template>
                  </ul>
                </dd>
              </template>
            </template>

            <template v-if="checkIfArrayOfNullObjectValues(project.keyInfo)">
              <template v-for="(info, i) in project.keyInfo">
                <template v-if="info.label && info.value">
                  <dt :key="`keyinfo-key-${i}`" class="name">
                    {{ info.label }}
                  </dt>
                  <dd :key="`keyinfo-val-${i}`" class="text">
                    {{ info.value }}
                  </dd>
                </template>
              </template>
            </template>
          </dl>
        </section>

        <component
          :is="pageBottomLeftComponent"
          :project="project"
          :mobile="moreThanTwo"
          :slider="slider"
          :class="{ 'stats-bottom' : pageBottomLeftComponent === 'Shipyard_SingularStats' }" />

      </div>

      <div class="col-6_sm-7_mi-12" data-push-left="off-1_sm-0">
        <section
          v-if="checkIfArrayOfNullObjectValues(project.taxonomies)"
          id="section-filters">
          <Zero_Core__Accordion
            v-slot="{ active }"
            :multiple="true">
            <template v-for="(taxonomy, i) in taxonomies">
              <Zero_Core__Accordion_Section
                v-if="taxonomy.slug && taxonomy.tags"
                :key="`taxonomy-category-${i}`"
                :active="active"
                :selected="true"
                class="filters">
                <Zero_Core__Accordion_Header>
                  <div tabindex="0" class="heading-wrapper focus-visible">
                    <h3 class="heading">
                      {{ $getTaxonomyCategoryLabel(taxonomy.slug) }}
                    </h3>
                    <div>
                      <Shipyard_ChevronIcon class="dropdown-toggle" />
                    </div>
                  </div>
                </Zero_Core__Accordion_Header>
                <Zero_Core__Accordion_Content>
                  <div class="chiclet-list">
                    <component
                      :is="chicletType"
                      v-for="(taxonomyTag, j) in filterTags(taxonomy.slug, taxonomy.tags)"
                      :key="`taxonomy-tag-${j}`"
                      :to="{ path: '/', query: { filters: 'enabled', tags: taxonomyTag } }"
                      class="chiclet focus-visible">
                      {{ $getTaxonomyTagLabel(taxonomy.slug, taxonomyTag) }}
                    </component>
                  </div>
                </Zero_Core__Accordion_Content>
              </Zero_Core__Accordion_Section>
            </template>
          </Zero_Core__Accordion>
        </section>
      </div>
    </div>

    <section
      v-if="showFeaturedSlider"
      id="section-featured-slider">
      <div class="outerbox">
        <div class="featured-box">
          <div class="grid-center">

            <div class="col-12">
              <div class="mini-box">
                <h3 class="heading">
                  {{ generalPageData.section_featured_slider.heading }}
                </h3>
                <div class="description">
                  {{ generalPageData.section_featured_slider.description }}
                </div>
                <div class="col-11_mi-12">
                  <Shipyard_FeaturedProjectsSlider parent="Detail Page" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

// ====================================================================== Export
export default {
  name: 'DetailPage',

  layout: 'base',

  async asyncData ({ app, store, route, error, payload }) {
    await store.dispatch('global/getBaseData', { key: 'core' })
    if (payload) { return { project: app.$setProjectDefaults(CloneDeep(payload)) } }
    try {
      const project = CloneDeep(require(`@/content/projects/${route.params.id}.json`))
      app.$setProjectDefaults(project)
      return { project }
    } catch (e) {
      return error('This project does not exist')
    }
  },

  data () {
    const id = this.$route.params.id
    return {
      tag: 'project',
      id: `project-${id}`,
      project: false
    }
  },

  async fetch ({ store, req, route, error }) {
    await store.dispatch('global/getBaseData', { key: 'project' })
    await store.dispatch('projects/getProjects')
  },

  head () {
    const title = this.page_Title
    const description = this.project.description.short
    const image = this.seo.og_image + this.project.logo.full
    const url = this.seo.og_url + this.$route.params.id
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: title,
      logo: image,
      brand: {
        '@type': 'Organization',
        name: this.project.org
      },
      description,
      url
    }
    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
        },
        { hid: 'og:title', property: 'og:title', content: title },
        { hid: 'og:description', property: 'og:description', content: description },
        { hid: 'og:site_name', property: 'og:site_name', content: this.seo.og_site_name },
        { hid: 'og:url', property: 'og:url', content: url },
        { hid: 'og:type', property: 'og:type', content: this.seo.og_type },
        { hid: 'og:image', property: 'og:image', content: image },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:title', name: 'twitter:title', content: title },
        { hid: 'twitter:description', name: 'twitter:description', content: description },
        { hid: 'twitter:image', name: 'twitter:image', content: image }
      ],
      link: [
        { rel: 'canonical', href: url },
        { rel: 'alternate', hreflang: 'en', href: url },
        { rel: 'alternate', hreflang: 'x-default', href: url }
      ],
      __dangerouslyDisableSanitizers: ['script'],
      script: [{ innerHTML: JSON.stringify(structuredData), type: 'application/ld+json' }]
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent'
    }),
    settings () {
      return this.siteContent.settings
    },
    seo () {
      return this.$GetSeo(this.tag)
    },
    name () {
      return this.project.name
    },
    page_Title () {
      return `${this.name} | ${this.seo.title}`
    },
    page_Description () {
      return `${this.name} | ${this.description}`
    },
    pageData () {
      return this.siteContent.project.page_content
    },
    secondaryCtaButtonText () {
      return this.pageData.secondary_cta_button_text
    },
    metadataHeading () {
      return this.pageData.metadata_heading
    },
    breadcrumbs () {
      if (this.settings.visibility.breadcrumbs) {
        const breadcrumbs = CloneDeep(this.pageData.breadcrumbs)
        breadcrumbs.push({
          type: 'div',
          label: this.project.name
        })
        return breadcrumbs
      }
      return false
    },
    // Project Content
    generalPageData () {
      return this.siteContent.general
    },
    description () {
      const description = this.project.description
      if (!description) { return false }
      const long = description.long
      const short = description.short
      if (!long && !short) { return false }
      if (long) { return long }
      return short
    },
    organizations () {
      const orgs = this.project.org
      if (!orgs) { return false }
      return orgs.join(', ')
    },
    taxonomies () {
      return this.project.taxonomies.filter(tax => this.$checkTaxonomyCategoryExists(tax.slug))
    },
    showFeaturedSlider () {
      return this.siteContent.settings.visibility.featuredSlider
    },
    swapVideoPositionSingular () {
      return this.siteContent.settings.visibility.swapVideoPositionSingular
    },
    pageTopRightComponent () {
      return this.swapVideoPositionSingular ? 'Shipyard_SingularVideo' : 'Shipyard_SingularStats'
    },
    pageBottomLeftComponent () {
      return this.swapVideoPositionSingular ? 'Shipyard_SingularStats' : 'Shipyard_SingularVideo'
    },
    moreThanTwo () {
      let amt = 0
      const len = this.project.stats.length
      for (let i = 0; i < len; i++) {
        if (this.project.stats[i].label && this.project.stats[i].value) {
          amt += 1
        }
      }
      amt += (this.project.ctaCard ? 1 : 0)
      return (amt > 2)
    },
    slider () {
      const items = []
      if (this.moreThanTwo) {
        const cloned = CloneDeep(this.project.stats)
        for (let i = 0; i < cloned.length; i++) {
          if (cloned[i].label && cloned[i].value) {
            items.push(cloned[i])
          }
        }
        if (this.project.ctaCard.title) {
          const cta = CloneDeep(this.project.ctaCard)
          items.push(cta)
        }
      }
      return items
    },
    chicletType () {
      if (!this.settings.visibility.singularTagLinks) {
        return 'div'
      }
      return 'NuxtLink'
    },
    truncateLinks () {
      return this.settings.visibility.truncateLinks
    }
  },

  methods: {
    filterTags (categorySlug, tags = []) {
      return tags.filter(tag => this.$checkTaxonomyTagExists(categorySlug, tag))
    },
    checkIfArrayOfNullObjectValues (array) {
      if (!Array.isArray(array) || array.length === 0) { return false }
      const compiled = []
      let nullCount = 0
      array.forEach((obj) => {
        nullCount = 0
        if (typeof obj === 'object' && !Array.isArray(obj)) {
          const keys = Object.keys(obj)
          const len = keys.length
          for (const key in obj) {
            if (obj[key] === null) {
              nullCount += 1
            }
          }
          if (len !== nullCount) {
            compiled.push(obj)
          }
        }
      })
      return compiled.length > 0 ? compiled : false
    },
    generateToolTip (text) {
      if (!this.settings.visibility.truncateLinks) {
        return null
      }
      return text.length > 23 ? text : false
    },
    stripSlashes (text) {
      return project.primaryCta.url.substring(0, 2) == '\/\/' ? project.primaryCta.url.substring(2) : project.primaryCta.url
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page {
  background-color: white;
}

// /////////////////////////////////////////////////////// [Section] Breadcrumbs
#section-breadcrumbs {
  padding: 2rem 0 1.75rem;
}

// ////////////////////////////////////////////////////// [Section] Project Info
#section-project-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 3.75rem;
  @include medium {
    margin-bottom: 2rem;
  }
  .name {
    @include fontSize_ExtraExtraLarge;
    @include leading_Mini;
    font-weight: 700;
    margin-left: -0.125rem;
    @include medium {
      font-size: 2.1875rem;
    }
    @include small {
      margin-bottom: 0.5rem;
    }
    @include mini {
      word-break: break-word;
    }
  }
  .description {
    @include fontSize_Medium;
    margin-bottom: 3rem;
  }
}

.logo {
  width: auto;
  height: auto;
  max-height: 6.5rem;
  max-width: 60%;
  margin-bottom: 1.25rem;
}

.company {
  @include fontSize_Medium;
  margin-bottom: 2.5rem;
  opacity: 0.7;
}

.ctas {
  display: flex;
  flex-direction: row;
  align-items: center;
  @include tiny {
    flex-direction: column;
    align-items: flex-start;
  }
  a {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 600;
    &.primary-cta {
      @include borderRadius_Medium;
      padding: 0.625rem 1.25rem;
      margin-right: 1.5rem;
      @include tiny {
        margin-right: 0;
        margin-bottom: 1rem;
      }
    }
    &.secondary-cta {
      padding-right: 1rem;
      &:hover {
        .svg-dropdown {
          transition: 250ms ease-out;
          transform: rotate(-90deg) translate(0, 0.75rem)
        }
      }
      .svg-dropdown {
        transform: rotate(-90deg) translate(0, 0.5rem);
        transition: 250ms ease-out;
      }
    }
  }
}

// ////////////////////////////////////////////////////////// [Section] Key Info
#section-key-info {
  .heading {
    @include fontSize_ExtraMediumLarge;
    margin-bottom: 2rem;
  }
}

.values {
  display: grid;
  grid-template-columns: 30% auto;
  row-gap: 1rem;
  column-gap: 5%;

  @include small {
    grid-template-columns: auto;
    row-gap: 0;
  }

  dd {
    margin: 0;
    &:not(:last-child) {
      @include small {
        margin-bottom: 1.25rem;
      }
    }
  }

  dt,
  li {
    font-weight: 600;
  }

  .links {
    list-style: none;
    padding: 0;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    a {
      text-decoration: underline transparent;
      text-underline-offset: $underlineSpacing;
      transition: text-decoration-color 250ms ease-out;
      &:hover {
        transition: text-decoration-color 250ms ease-in;
        text-decoration-color: currentColor;
      }
    }

    .link-tooltip {
      @include borderRadius_Medium;
      @include fontSize_Mini;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1rem;
      height: 1rem;
      cursor: help;

      &[data-tooltip] {
        &:before,
        &:after {
          @include borderRadius_Medium;
          @include fontSize_Small;
          z-index: 1;
        }
      }
    }
  }
}

// ///////////////////////////////////////////////////////////// [Section] Video
#section-video {
  margin-top: 4rem;
  &.video-top {
    margin-top: 0rem;
  }
}

.video {
  @include borderRadius_Medium;
}

// /////////////////////////////////////////////////////////// [Section] Filters
#section-filters {
  @include mini {
    margin-top: 2rem;
  }
  .heading {
    @include fontSize_Large;
  }
}

.accordion-header {
  position: relative;
  padding: 0 0.3125rem 0.875rem;
  cursor: pointer;
  .heading-wrapper {
    margin-top: 0.125rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}

.accordion-section {
  .dropdown-toggle {
    transition: 250ms ease-in;
  }
  &.open {
    .accordion-header {
      .dropdown-toggle {
        transform: rotate(180deg);
      }
    }
  }
}

.accordion-content {
  padding: 0 0.3125rem;
}

.chiclet-list {
  padding-bottom: 2rem;
}

// /////////////////////////////////////////////////// [Section] Featured Slider
#section-featured-slider {
  .heading,
  .description {
    @include xlarge {
      padding-left: 2rem;
    }
    @include large {
      padding-left: 0;
    }
  }
  margin-top: 4rem;
  padding-bottom: 4rem;
  @include mini {
    margin-top: 2rem;
    padding-bottom: 2rem;
  }
}

#featured-projects-slider {
  margin-top: 1rem;
}

.outerbox {
  @include customMaxMQ ($containerWidth + 4rem) {
    padding: 0 calc(4.1665% + 0.5rem);
  }
  @include mini {
    padding: 0;
  }
}

.featured-box {
  @include borderRadius_Medium;
  padding-top: 4.75rem;
  max-width: $containerWidth;
  margin: 0 auto;
  border-width: 2px;
  border-style: solid;
  @include mini {
    border: none;
    padding-top: 0;
    margin: 0;
  }
  [class~=grid],
  [class*=grid-],
  [class*=grid_] {
    max-width: 67rem;
  }
  .mini-box {
    @include mini {
      @include borderRadius_Medium;
      margin: 0 0.5rem;
      padding: 0 2rem;
      padding-top: 3rem;
      border: 2px solid #E5E5E5;
    }
  }
}

::v-deep .project-card {
  .thumbnail {
    border-width: 2px;
    border-style: solid;
  }
}
</style>

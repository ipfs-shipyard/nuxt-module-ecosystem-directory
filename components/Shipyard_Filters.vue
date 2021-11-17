<template>
  <component :is="rootNode">

    <slot :filtered="filtered" />

  </component>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

// =================================================================== Functions
const projectIncluded = (selection, tags, type) => {
  switch (type) {
    case 'and': return selection.every((val) => { return tags.includes(val) })
    case 'or': return selection.some((val) => { return tags.includes(val) })
  }
  return false
}

const filterProjects = (selected, collection, matchType) => {
  const filtered = []
  if (selected.length) {
    for (let i = 0; i < collection.length; i++) {
      const project = collection[i]
      const projectTags = []

      for (let j = 0; j < project.taxonomies.length; j++) {
        const tax = project.taxonomies[j]
        for (let k = 0; k < tax.tags.length; k++) {
          projectTags.push(tax.tags[k])
        }
      }
      const success = projectIncluded(selected, projectTags, matchType)
      if (success) { filtered.push(collection[i]) }
    }
    return filtered
  }
  return collection
}

const filterDuplicates = (array) => {
  const ids = array.map(member => member.slug)
  return array.filter(({slug}, index) => !ids.includes(slug, index + 1))
}


// ====================================================================== Export
export default {
  name: 'Filters',

  props: {
    rootNode: {
      type: String,
      required: false,
      default: 'div'
    },
    projects: {
      type: [Boolean, Array],
      required: false,
      default: false
    },
    filters: {
      type: [Boolean, Array],
      required: false,
      default: false
    },
    selected: {
      type: [Boolean, Array],
      required: false,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent'
    }),
    settings () {
      return this.siteContent.settings
    },
    taxonomy () {
      return this.siteContent.taxonomy
    },
    targetCategories () {
      return this.settings.behavior.targetCategoryMatch
    },
    targets () {
      const targets = []
      if (this.targetCategories) {
        this.targetCategories.forEach((entry) => {
          const category = this.taxonomy.categories.find(cat => cat.slug === entry.categorySlug)
          if (category) {
            const array = []
            category.tags.forEach(tag => array.push(tag.slug))
            targets.push({
              tags: array,
              match: entry.tagMatchType
            })
          }
        })
      }
      return targets
    },
    filtered () {
      let collection = []
      if (this.targets.length) {
        this.targets.forEach((category) => {
          const selection = this.selected.filter((tag) => category.tags.includes(tag))
          if (selection.length) {
            collection.push(filterProjects(selection, this.projects, category.match))
          }
        })
        const concatenated = [].concat.apply([], collection)
        if (this.settings.behavior.tagMatchType === 'and') {
          const andCollection = []
          const results = filterDuplicates(concatenated)
          const len = results.length
          for (let i = 0; i < len; i++) {
            const result = results[i].slug
            if (collection.every(array => array.some(project => project.slug === result))) {
              andCollection.push(results[i])
            }
          }
          collection = andCollection
        } else {
          collection = filterDuplicates(concatenated)
        }
      } else {
        collection = filterProjects(this.selected, this.projects, this.primaryMatchType)
      }
      if (collection.length === 0) { collection = false }
      const payload = { type: 'filtered', collection }
      this.setCollection(payload)
      return collection
    }
  },

  methods: {
    ...mapActions({
      setCollection: 'core/setCollection'
    })
  }
}
</script>

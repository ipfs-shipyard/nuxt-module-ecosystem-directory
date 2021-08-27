# Ecosystem Directory

Interactive ecosystem directory and showcase boilerplate. Best included on a blank project (since this module overrides the index and _slug routes), this NuxtJS module can be added to automatically load all the boilerplate layouts, pages, components, styles, stores and functionality to run the Ecosystem Directory. Once this module is included in your project, any customization of styling, fonts, pages, components, etc. can be applied to your ecosystem directory repo, outside of the flow of this module.

When including in `nuxt.config.js`, this module _must_ be included at the _top_ of the `modules` array, like so:

```js
{
  modules: [
    'nuxt-module-ecosystem-directory', // ← at the top of the array, BEFORE any other modules
    '@nuxtjs/axios',
    '@nuxtjs/style-resources', // ← absolutely MUST be included BEFORE @nuxtjs/style-resources module (a required module)
    ...
  ]
}
```

As well, when we refernce files or directories throughout this README using the `@/` alias, we are referencing the root of your project repo _not_ the root of this module.

_**NOTE**_: when adding files to your project, make sure to restart the dev server so that this module can detect and correctly reconcile any file overrides.

### Requirements & Considerations

**`@nuxtjs/style-resources`**

This is a required module and should be included in your root application. `nuxt-module-ecosystem-directory` _must_ be included _before_ `@nuxtjs/style-resources` in your `nuxt.config.js` (as outlined above).

**`@/static/content`**

This is a required directory that is gitignored and automatically generated on compile.

**`@/store/index.js`**

At least one store must be included in in your application for this module to work. If the `@/store` directory is missing or if it is empty, a placeholder (empty) `@/store/index.js` file will be automatically created. _Do not delete this file unless you plan on creating another store_.

**`getBaseData` action**

If you decide to override a core page (procedure outlined below), the new page that you create absolutely must include the following line _at the beginning of_ either the `fetch()` or `asyncData()` hook.

```js
fetch () {
  await store.dispatch('global/getBaseData', 'core')
}
```

If your page is using _both_ a `fetch()` and an `asyncData()` hook, then the line above must be included at the beginning of the `asyncData()` hook because it fires before `fetch()`.

### General Assets

Any and all assets (except images, more on that [here](<INSERT LINK HERE>)) can be added as usual to the `@/assets` directory.

### SCSS Assets

The SCSS styling is structured in a way to make it easy to override site-wide variables or any components. All relevant SCSS files can be seen in [this directory](https://github.com/ipfs-shipyard/nuxt-module-ecosystem-directory/blob/main/assets/scss).

SCSS can be included in two locations in `nuxt.config.js` and both serve different purposes.

**main.scss**

Most of your styling would be included via the `main.scss` entry file and can be included in `nuxt.config.js` like so:

```js
{
  css: [
    '~/assets/main.scss'
  ]
}
```

This file can contain all of your style customizations and can also be used to import SCSS partials.

**utilities.scss**

It is important to remember that **all** SCSS added to the `utilities.scss` file – including the companion `variables.scss` and `settings.scss` files – _must not contain any CSS declarations_. These files can only contain SCSS variables, mixins, functions etc. No styling.

The `utilities.scss` file is the entry point for all of the aforementioned functionality. It can be included in `nuxt.config.js` like so:

```js
{
  modules: [
    '@nuxtjs/style-resources'
  ],
  styleResources: {
    scss: [
      '~/assets/utilities.scss'
    ]
  }
}
```

The [`@nuxtjs/style-resources`](https://github.com/nuxt-community/style-resources-module) module is a required dependency.

**variables.scss**

This file is imported in `utilities.scss` and only contains site-wide custom variables (ex: `$highlight_Light: #FFFFFF`).

**settings.scss**

This is a special file that site-wide SCSS settings. Including your own settings with variables of the same name will override the boilerplate ones. The up-to-date list of useable settings can be seen [here](https://github.com/ipfs-shipyard/nuxt-module-ecosystem-directory/blob/main/assets/scss/settings.scss). If you create your own settings file in `@/assets/scss/settings.scss`, import it in your `@/assets/scss/utilities.scss` or however you'd like, then simply re-declaring a boilerplate setting with a new value will replace all instances of that value.

For example, the boilerplate value for [$font_Primary](<INSERT_LINE LINK HERE>) is this:

```scss
$font_Primary: 'Helvetica', sans-serif, monospace;
```

In `@/assets/scss/settings.scss`, setting a new value will cause the primary (body) font of the site to instead use a different font:

```scss
$font_Primary: 'Inter', sans-serif, monospace;
```

### Pages

Although it is possible, _it is highly not recommended_ to override page files. There are 3 pages included in this boilerplate. Entire pages can be overridden by including pages inside the `@/pages` directory of the same filename and route structure as those of the boilerplate. The breakdown is below.

```
pages
  _slug
    index.vue
  project
    _id.vue
  index.vue
```

If you wish to walk the path of replacing an entire page, we recommend that you copy a page from [here](https://github.com/ipfs-shipyard/nuxt-module-ecosystem-directory/blob/main/pages) first and then perform modifications to the copy.

- **index.vue**: this is the home page.
- **project/_id.vue**: this is the project detail/singular page.
- **_slug/index.vue**: this is a catch-all route but is currently fixed to only accept the `/showcase` route. If a custom route for the `showcaseBaseRoute` setting is used, then that will be the only route accepted in this page.

### Components

All [components](https://github.com/ipfs-shipyard/nuxt-module-ecosystem-directory/blob/main/components) are prefixed with `Shipyard_<component_name>` and are auto-loaded as global components. This means they should not conflict with other custom components that you may create yourself in the `@/components` directory and also do not need to be imported. You can use them directly in your templates as such:

```vue
<template>
  <Shipyard_SiteHeader />
</template>
```

Much more safe than overriding an entire page, components can also be overriden if a different or more custom version is to be used instead. Instructions are as follows:

1. Find the component you wish to replace from the [core components list](https://github.com/ipfs-shipyard/nuxt-module-ecosystem-directory/blob/main/components)
2. Create a component of the same name (including the prefix) and place it in the `@/components` directory of your app
3. Restart the `dev` server to initialize a rebuild
4. 🎉 your custom component will automagically appear

### Content

Similarly, all the boilerplate content can be overriden. The core files and directory structure are listed below. As long as the files and directories that are created in your project repo follow the same structure and names, then the JSON files will automatically be replaced during compile. In all cases, it is best to copy the file you would like to change into your `@/content` directory and then perform modifications. This way you much less likely to accidentally forget or incorrectly name a required JSON key/value pair.

```
content
  project-schema.json
  settings.json
  taxonomy.json
pages
  general.json
  index.json
  project.json
  showcase.json
```

**project-schema.json**

This is the only file that should never be replaced. If you would like to add/remove fields or to generally propose changes to the project schema, please [open an issue](https://github.com/ipfs-shipyard/nuxt-module-ecosystem-directory/issues).

**settings.json**

Contains general application settings.

**taxonomy.json**

Here you will find the taxonomy structure used throughout the application. This file should be duplicated and the duplicate updated with the categories, labels, tags, etc. that are relevant to your application specifically.

**pages/*.json**

These are all general website content files. They contain things like heading and subheading text, button text, navigation links, header/footer content, etc. The entire `/content/pages` directory of this module should be duplicated and moved to `@/content/pages` in your app, after which all nested JSON file content should be updated to more accurately reflect your custom version of the ecosystem directory.

**Custom content**

If you wish to add more content to the global `siteContent` Vuex getter, you will have to import the content in the `asyncData()` or `fetch()` hook and then pass the content to the appropriate Vuex action as outlined below. This is useful for if you create your own custom page and would like to use the existing Vuex architecture to manage content throughout your custom page and components.

Let's say you created a new page in `@/pages/about.vue` and would like to add content to it:

```js
// about.vue

import AboutPageContent from '@/content/pages/about.json'

export default {
  name: 'AboutPage',

  async fetch ({ store }) {
    await store.dispatch('global/getBaseData', { key: 'about', content: AboutPageContent })
  }
}
```

After this is done, the content will become accessible to you through a Vuex getter and nested under the key that you provided above – in this case `about`:

```js
// any page/component

import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent'
    }),
    pageContent () {
      return this.siteContent.about // ← same key that you provided when you imported the content in the fetch() hook
    }
  }
}
```

### Vuex Store

Although it is possible, _it is highly not recommended_ to override store files. Stores can be overriden by including a store file of the same name as a core store in `@/store/<filename.js>`. The two stores we use are both namespaced as `global` and `projects`. This also means that in order to access the stores, you would have to namespace your request like so: `store.getters['global/siteContent']`.

### Layouts

Layouts cannot be overriden. The 3 layouts in use are `base.vue`, `error.vue` and `showcase.vue`. Please avoid using layouts of the same name in your application.

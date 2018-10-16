<template lang="pug">
  v-app
    v-navigation-drawer(
      persistent,
      v-model="drawer",
      enable-resize-watcher,
      fixed,
      app
    )
      v-list
        v-list-tile(
          value="true",
          v-for="(item, i) in items",
          :key="i",
          :to="item.to",
          :class="menuClass(item)"
        )
          v-list-tile-action
            v-icon.menu-color(v-html="item.icon")
          v-list-tile-content
            v-list-tile-title.menu-color(v-text="item.title")
    v-toolbar(
      app
    )
      v-toolbar-side-icon(@click.stop="drawer = !drawer")
      v-toolbar-title(v-text="title")
      v-spacer
    v-content
      router-view
    v-footer(app)
      span &copy; 2017
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      drawer: false
    }
  },
  computed: {
    title() {
      const name = this.$route.name
      return name.charAt(0).toUpperCase() + name.substr(1)
    },
    items() {
      let items = []

      this.$router.options.routes.forEach(route => {
        if (route.name === 'Home') return
        if (route.name === 'Lesson') return

        let item = {
          title: route.name,
          to: { name: route.name }
        }

        if (item.title === 'Levels') item.icon = 'stars'
        if (item.title === 'Categories') item.icon = 'category'
        if (item.title === 'Lessons') item.icon = 'assignment'
        if (item.title === 'Chapters') item.icon = 'bookmarks'

        items.push(item)
      })

      return items
    }
  },
  methods: {
    menuClass(item) {
      if (
        this.$route.name.charAt(0).toUpperCase() +
          this.$route.name.substr(1) ===
        item.title
      ) {
        return 'button'
      } else {
        return null
      }
    }
  }
}
</script>

<style lang="scss">
.menu-color {
  color: #0066ff !important;
  caret-color: #0066ff !important;
}
.button {
  outline: 2px solid; /* use instead of border */
  margin-top: 2px;
  margin-left: 2px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

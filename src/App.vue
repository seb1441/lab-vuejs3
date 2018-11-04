<template lang="pug">
  v-app
    v-navigation-drawer(
      persistent,
      v-model="drawer",
      enable-resize-watcher,
      fixed,
      app,
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
      v-toolbar-side-icon(v-if="currentUser", @click.stop="drawer = !drawer")
      v-toolbar-title(v-text="title")
      v-spacer
      h4(v-if="currentUser") Welcome, {{ currentUser.username }}
      v-btn(v-if="currentUser", @click="logout") Logout
    v-content
      router-view(v-if="currentUser || $route.name === 'Login'")
    v-footer(app)
      span &copy; 2017
</template>

<script>
import currentUser from './mixins/current-user'
import { onLogout } from './vue-apollo'
import CURRENT_USER from './apollo/queries/currentUser.gql'

export default {
  name: 'App',
  mixins: [currentUser],
  data() {
    return {
      drawer: false
    }
  },
  created() {
    this.checkLogin(this.$route.name, this.currentUser)
  },
  watch: {
    '$route.name'(value) {
      this.checkLogin(value, this.currentUser)
    },
    currentUser(value) {
      this.checkLogin(this.$route.name, value)
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
        if (['Home', 'Login', 'Lesson'].includes(route.name)) return

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
    },
    async logout() {
      if (!this.currentUser) return

      const apolloClient = this.$apollo.provider.defaultClient

      await onLogout(apolloClient)
      apolloClient.writeQuery({
        query: CURRENT_USER,
        data: {
          currentUser: null
        }
      })
    },
    checkLogin(routeName, currentUser) {
      if (!currentUser && routeName !== 'Login') {
        this.$router.replace({ name: 'Login' })
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

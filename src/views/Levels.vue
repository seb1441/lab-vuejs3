<template lang="pug">
v-container
  v-layout(v-if="levels", row, wrap)
    v-flex(xs6)
      draggable(v-model="levels", @end="updatePositions")
        transition-group(name="fade")
          list-button(
            v-for="(level, index) in levels",
            :key="level.id",
            :title="level.title",
            :id="level.id",
            @update-title="updateLevelTitle",
            @delete="deleteLevel"
          )
      br
      v-btn(@click="newLevel()", color="primary", round) New
</template>

<script>
import draggable from 'vuedraggable'
import ListButton from '@/components/ListButton'

export default {
  components: {
    draggable,
    ListButton
  },
  apollo: {
    levels: {
      query: require('@/apollo/queries/levels.gql'),
      fetchPolicy: 'network-only'
    }
  },
  methods: {
    updateLevelTitle(id, title) {
      let level = this.levels.find(l => l.id === id)
      level.title = title
      delete level.__typename

      this.$apollo
        .mutate({
          mutation: require('@/apollo/mutations/level/update_levels.gql'),
          variables: {
            levels: [level]
          }
        })
        .then(() => {
          this.levels.find(l => l.id === id).title = title
        })
        .catch(error => {
          console.error(error)
        })
    },
    newLevel() {
      this.$apollo
        .mutate({
          mutation: require('@/apollo/mutations/level/create_level.gql')
        })
        .then(() => {
          this.$apollo.queries.levels.refetch()
        })
        .catch(error => {
          console.error(error)
        })
    },
    updatePositions() {
      let levels = []

      for (let i = 0; i < this.levels.length; i++) {
        levels.push({
          id: this.levels[i].id,
          position: i
        })
      }

      this.$apollo
        .mutate({
          mutation: require('@/apollo/mutations/level/update_levels.gql'),
          variables: {
            levels: levels
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    deleteLevel(id) {
      this.$apollo
        .mutate({
          mutation: require('@/apollo/mutations/level/destroy_level.gql'),
          variables: {
            id: id
          }
        })
        .then(response => {
          if (!response.data.destroyLevel.errors.length) {
            this.$apollo.queries.levels.refetch()
          }
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

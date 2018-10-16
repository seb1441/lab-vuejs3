<template lang="pug">
v-container
  v-layout(v-if="chapters", row, wrap)
    v-flex(xs6)
      draggable(v-model="chapters", @end="updatePositions")
        transition-group(name="fade")
          list-button(
            v-for="(chapter, index) in chapters",
            :key="chapter.id",
            :title="chapter.title",
            :id="chapter.id",
            @update-title="updateChapterTitle",
            @delete="deleteChapter"
          )
      br
      v-btn(@click="newChapter()", color="primary", round) New
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
    chapters: {
      query: require('@/apollo/queries/chapters.gql'),
      fetchPolicy: 'network-only'
    }
  },
  methods: {
    newChapter() {
      this.$apollo
        .mutate({
          mutation: require('@/apollo/mutations/chapter/create_chapter.gql')
        })
        .then(() => {
          this.$apollo.queries.chapters.refetch()
        })
        .catch(error => {
          console.error(error)
        })
    },
    updateChapterTitle(id, title) {
      let chapter = this.chapters.find(l => l.id === id)
      chapter.title = title
      delete chapter.__typename

      this.$apollo
        .mutate({
          mutation: require('@/apollo/mutations/chapter/update_chapters.gql'),
          variables: {
            chapters: [chapter]
          }
        })
        .then(() => {
          this.chapters.find(l => l.id === id).title = title
        })
        .catch(error => {
          console.error(error)
        })
    },
    updatePositions() {
      let chapters = []

      for (let i = 0; i < this.chapters.length; i++) {
        chapters.push({
          id: this.chapters[i].id,
          position: i
        })
      }

      this.$apollo
        .mutate({
          mutation: require('@/apollo/mutations/chapter/update_chapters.gql'),
          variables: {
            chapters: chapters
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    deleteChapter(id) {
      this.$apollo
        .mutate({
          mutation: require('@/apollo/mutations/chapter/destroy_chapter.gql'),
          variables: {
            id: id
          }
        })
        .then(response => {
          if (!response.data.destroyChapter.errors.length) {
            this.$apollo.queries.chapters.refetch()
          }
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

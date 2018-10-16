<template lang="pug">
v-container(v-if="lesson && categories && levels && chapters")
  v-btn(@click="toggleEditMode()") {{ editMode? 'Cancel' : 'Edit' }}
  v-btn(v-if="editMode", @click="save()") Save
  br
  br
  div(v-if="editMode")
    v-text-field(v-model="lesson.title")
    v-layout(wrap, align-center)
      v-flex(xs12, sm4, d-flex)
        v-select(
          :items="categories.map(c => ({text: c.title, value: c.id}))",
          v-model="lesson.category.id"
          label="Category"
        )
      v-flex(xs12, sm4, d-flex)
        v-select(
          :items="levels.map(c => ({text: c.title, value: c.id}))",
          v-model="lesson.level.id"
          label="Level"
        )
      v-flex(xs12, sm4, d-flex)
        v-select(
          :items="chapters.map(c => ({text: c.title, value: c.id}))",
          v-model="lesson.chapter.id"
          label="Chapter"
        )
    vue-editor(v-model="lesson.description")
  div(v-else)
    div.title {{ lesson.title || 'No title' }}
    br
    hr
    br
    div Category: {{ lesson.category.title }}
    div Level: {{ lesson.level.title }}
    div Chapter: {{ lesson.chapter.title }}
    br
    hr
    br
    div(v-html="lesson.description || 'No description'")
</template>

<script>
import { VueEditor } from 'vue2-editor'

export default {
  components: {
    VueEditor
  },
  data() {
    return {
      editMode: false
    }
  },
  apollo: {
    lesson: {
      query: require('@/apollo/queries/lesson/lesson.gql'),
      fetchPolicy: 'no-cache',
      variables() {
        return {
          id: this.$route.params.id
        }
      }
    },
    categories: {
      query: require('@/apollo/queries/categories.gql'),
      fetchPolicy: 'no-cache'
    },
    levels: {
      query: require('@/apollo/queries/levels.gql'),
      fetchPolicy: 'no-cache'
    },
    chapters: {
      query: require('@/apollo/queries/chapters.gql'),
      fetchPolicy: 'no-cache'
    }
  },
  methods: {
    toggleEditMode() {
      if (this.editMode) {
        this.$apollo.queries.lesson.refetch()
        this.editMode = false
      } else {
        this.editMode = true
      }
    },
    save() {
      const variables = {
        id: this.lesson.id,
        categoryId: this.lesson.category.id,
        levelId: this.lesson.level.id,
        chapterId: this.lesson.chapter.id
      }

      if (this.lesson.title) variables.title = this.lesson.title
      if (this.lesson.description)
        variables.description = this.lesson.description

      this.$apollo
        .mutate({
          mutation: require('@/apollo/mutations/lesson/update_lesson.gql'),
          variables: variables
        })
        .then(response => {
          if (!response.data.updateLesson.errors.length) {
            this.$apollo.queries.lesson.refetch()
            this.editMode = false
          }
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

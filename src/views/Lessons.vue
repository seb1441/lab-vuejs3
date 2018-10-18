<template lang="pug">
v-container
  v-layout(row, wrap)
    v-flex(xs4)
      v-combobox(
        v-if="categories",
        v-model="filters.category",
        :items="categories.map(c => ({text: c.title, value: c.id}))",
        label="Category",
        clearable
      )
    v-flex(xs4)
      v-combobox(
        v-if="levels",
        v-model="filters.level",
        :items="levels.map(c => ({text: c.title, value: c.id}))",
        label="Level",
        clearable
      )
    v-flex(xs4)
      v-combobox(
        v-if="chapters",
        v-model="filters.chapter",
        :items="chapters.map(c => ({text: c.title, value: c.id}))",
        label="Chapter",
        clearable
      )
  br
  v-data-table(
    :headers="headers",
    :items="lessons",
    hide-actions,
    class="elevation-1",
    :loading="loading"
  )
    template(slot="items", slot-scope="props")
      td {{ props.item.title }}
      td {{ props.item.category.title }}
      td {{ props.item.level.title }}
      td {{ props.item.chapter.title }}
      td(class="justify-center layout px-0")
        v-icon(
          small,
          class="mr-2",
          @click="viewLesson(props.item.id)"
        ) visibility
        //- v-icon(
        //-   small,
        //-   class="mr-2",
        //-   @click="editItem(props.item)"
        //- ) edit
        v-icon(
          small,
          @click="deleteConfirmation(props.item)"
        ) delete
          //- @click="deleteLesson(props.item.id)"
  br
  v-btn(@click="newLesson()", color="primary", round) New
    v-dialog(
      v-model="confirmationDialog.show",
      max-width="290",
      v-if="confirmationDialog.item"
    )
      v-card
        v-card-title(class="headline") Deleting lesson

        v-card-text 
          | Are you sure you want to delete 
          b {{ confirmationDialog.item.title }}
          | ?

        v-card-actions
          v-spacer
          v-btn(
            color="green darken-1",
            flat="flat",
            @click="confirmationDialog.show = false"
          ) Cancel

          v-btn(
            color="green darken-1",
            flat="flat",
            @click="deleteLesson(confirmationDialog.item.id)"
          ) Yes
</template>

<script>
export default {
  data() {
    return {
      filters: {
        category: null,
        level: null,
        chapter: null
      },
      confirmationDialog: {
        show: false,
        item: null
      },
      loading: false,
      headers: [
        { text: 'Title', value: 'title', sortable: false },
        { text: 'Category', value: 'category', sortable: false },
        { text: 'Level', value: 'level', sortable: false },
        { text: 'Chapter', value: 'chapter', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  created() {
    this.loading = true
    if (localStorage.getItem('selectedCategory')) {
      this.filters.category = JSON.parse(
        localStorage.getItem('selectedCategory')
      )
    }

    if (localStorage.getItem('selectedLevel')) {
      this.filters.level = JSON.parse(localStorage.getItem('selectedLevel'))
    }

    if (localStorage.getItem('selectedChapter')) {
      this.filters.chapter = JSON.parse(localStorage.getItem('selectedChapter'))
    }
  },
  apollo: {
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
    },
    lessons: {
      query: require('@/apollo/queries/lesson/lessons.gql'),
      variables() {
        return this.variableFilters
      },
      fetchPolicy: 'no-cache',
      result(response) {
        if (!response.loading) {
          this.loading = false
        }
      }
    }
  },
  computed: {
    variableFilters() {
      let variables = {
        filters: {}
      }

      if (this.filters.category)
        variables.filters.categoryId = this.filters.category.value
      if (this.filters.level)
        variables.filters.levelId = this.filters.level.value
      if (this.filters.chapter)
        variables.filters.chapterId = this.filters.chapter.value

      return variables
    }
  },
  methods: {
    deleteConfirmation(item) {
      this.confirmationDialog.item = item
      this.confirmationDialog.show = true
    },
    newLesson() {
      this.$apollo
        .mutate({
          mutation: require('@/apollo/mutations/lesson/create_lesson.gql')
        })
        .then(() => {
          this.$apollo.queries.lessons.refetch()
        })
        .catch(error => {
          console.error(error)
        })
    },
    showCategory(category) {
      if (this.filters.category) {
        return this.filters.category.value === category.id
      } else {
        return true
      }
    },
    showLevel(level) {
      if (this.filters.level) {
        return this.filters.level.value === level.id
      } else {
        return true
      }
    },
    showChapter(chapter) {
      if (this.filters.chapter) {
        return this.filters.chapter.value === chapter.id
      } else {
        return true
      }
    },
    viewLesson(id) {
      this.$router.push({ name: 'Lesson', params: { id: id } })
    },
    deleteLesson(id) {
      this.$apollo
        .mutate({
          mutation: require('@/apollo/mutations/lesson/destroy_lesson.gql'),
          variables: {
            id: id
          }
        })
        .then(response => {
          if (!response.data.destroyLesson.errors.length) {
            this.$apollo.queries.lessons.refetch()
            this.confirmationDialog.show = false
            this.confirmationDialog.item = null
          }
        })
        .catch(error => {
          console.error(error)
        })
    }
  },
  watch: {
    'filters.category'(newVal) {
      if (newVal && newVal.value) {
        this.loading = true
        localStorage.setItem('selectedCategory', JSON.stringify(newVal))
      } else {
        localStorage.removeItem('selectedCategory')
      }
    },
    'filters.level'(newVal) {
      if (newVal && newVal.value) {
        this.loading = true
        localStorage.setItem('selectedLevel', JSON.stringify(newVal))
      } else {
        localStorage.removeItem('selectedLevel')
      }
    },
    'filters.chapter'(newVal) {
      if (newVal && newVal.value) {
        this.loading = true
        localStorage.setItem('selectedChapter', JSON.stringify(newVal))
      } else {
        localStorage.removeItem('selectedChapter')
      }
    }
  }
}
</script>

<style scoped>
.selected-button {
  border-color: red;
}
</style>

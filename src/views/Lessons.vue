<template lang="pug">
v-container
  v-layout(row, wrap)
    v-flex(xs4)
      transition-group(name="fade")
        v-list-tile.button(v-if="showCategory(category)", v-for="(category, index) in categories", :key="category.id", @click="selectCategory(category)")
          v-list-tile-content
            v-list-tile-title(text-xs-center) {{ category.title }}
    transition(name="fade")
      v-flex(v-if="selectedCategory", xs4)
        transition-group(name="fade")
          v-list-tile.button(v-if="showLevel(level)", v-for="(level, index) in levels", :key="level.id", @click="selectLevel(level)")
            v-list-tile-content
              v-list-tile-title {{ level.title }}
    transition(name="fade")
      v-flex(v-if="selectedLevel", xs4)
        transition-group(name="fade")
          v-list-tile.button(v-if="showChapter(chapter)", v-for="(chapter, index) in chapters", :key="chapter.id", @click="selectChapter(chapter)")
            v-list-tile-content
              v-list-tile-title {{ chapter.title }}
  br
  v-data-table(
    :headers="headers",
    :items="lessons",
    hide-actions,
    class="elevation-1"
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
      confirmationDialog: {
        show: false,
        item: null
      },
      selectedCategory: null,
      selectedLevel: null,
      selectedChapter: null,
      headers: [
        { text: 'Title', value: 'title', sortable: false },
        { text: 'Category', value: 'category', sortable: false },
        { text: 'Level', value: 'level', sortable: false },
        { text: 'Chapter', value: 'chapter', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
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
      fetchPolicy: 'no-cache'
    }
  },
  computed: {
    variableFilters() {
      let variables = {
        filters: {}
      }

      if (this.selectedCategory)
        variables.filters.categoryId = this.selectedCategory.id

      if (this.selectedLevel) variables.filters.levelId = this.selectedLevel.id

      if (this.selectedChapter)
        variables.filters.chapterId = this.selectedChapter.id

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
    selectCategory(category) {
      this.selectedLevel = null
      this.selectedChapter = null

      if (this.selectedCategory && this.selectedCategory.id === category.id) {
        this.selectedCategory = null
      } else {
        this.selectedCategory = category
      }

      this.$apollo.queries.lessons.refetch()
    },
    selectLevel(level) {
      this.selectedChapter = null
      if (this.selectedLevel && this.selectedLevel.id === level.id) {
        this.selectedLevel = null
      } else {
        this.selectedLevel = level
      }

      this.$apollo.queries.lessons.refetch()
    },
    selectChapter(chapter) {
      if (this.selectedChapter && this.selectedChapter.id === chapter.id) {
        this.selectedChapter = null
      } else {
        this.selectedChapter = chapter
      }

      this.$apollo.queries.lessons.refetch()
    },
    showCategory(category) {
      if (this.selectedCategory) {
        return this.selectedCategory.id === category.id
      } else {
        return true
      }
    },
    showLevel(level) {
      if (this.selectedLevel) {
        return this.selectedLevel.id === level.id
      } else {
        return true
      }
    },
    showChapter(chapter) {
      if (this.selectedChapter) {
        return this.selectedChapter.id === chapter.id
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
  }
}
</script>

<style scoped>
.selected-button {
  border-color: red;
}
</style>

<template lang="pug">
v-container
  v-layout(v-if="categories", row, wrap)
    v-flex(xs6)
      draggable(v-model="categories", @end="updatePositions")
        transition-group(name="fade")
          list-button(
            v-for="(category, index) in categories",
            :key="category.id",
            :title="category.title",
            :id="category.id",
            @update-title="updateCategoryTitle",
            @delete="deleteCategory"
          )
      br
      v-btn(@click="newCategory()", color="primary", round) New
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
    categories: {
      query: require('@/apollo/queries/categories.gql'),
      fetchPolicy: 'network-only'
    }
  },
  methods: {
    newCategory() {
      this.$apollo
        .mutate({
          mutation: require('@/apollo/mutations/category/create_category.gql')
        })
        .then(() => {
          this.$apollo.queries.categories.refetch()
        })
        .catch(error => {
          console.error(error)
        })
    },
    updateCategoryTitle(id, title) {
      let category = this.categories.find(l => l.id === id)
      category.title = title
      delete category.__typename

      this.$apollo
        .mutate({
          mutation: require('@/apollo/mutations/category/update_categories.gql'),
          variables: {
            categories: [category]
          }
        })
        .then(() => {
          this.categories.find(l => l.id === id).title = title
        })
        .catch(error => {
          console.error(error)
        })
    },
    updatePositions() {
      let categories = []

      for (let i = 0; i < this.categories.length; i++) {
        categories.push({
          id: this.categories[i].id,
          position: i
        })
      }

      this.$apollo
        .mutate({
          mutation: require('@/apollo/mutations/category/update_categories.gql'),
          variables: {
            categories: categories
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    deleteCategory(id) {
      this.$apollo
        .mutate({
          mutation: require('@/apollo/mutations/category/destroy_category.gql'),
          variables: {
            id: id
          }
        })
        .then(response => {
          if (!response.data.destroyCategory.errors.length) {
            this.$apollo.queries.categories.refetch()
          }
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

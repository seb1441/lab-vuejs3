<template lang="pug">
div
  v-list-tile.button(@click="")
    v-text-field(v-if="editMode", v-model="editedTitle")
    v-list-tile-content(v-else)
      v-list-tile-title {{ editedTitle }}
    v-btn(icon, @click="toggleEditMode")
      v-icon {{ editMode ? 'cancel' : 'edit' }}
    v-btn(v-if="editMode", icon, @click="updateTitle")
      v-icon save
    v-btn(icon, @click="$emit('delete', id)")
      v-icon delete
</template>

<script>
export default {
  props: {
    id: { type: String, required: true },
    title: { type: String, required: true }
  },
  data() {
    return {
      temporaryTitle: null,
      editMode: false
    }
  },
  computed: {
    editedTitle: {
      get() {
        return this.temporaryTitle || this.title
      },
      set(val) {
        this.temporaryTitle = val
      }
    }
  },
  methods: {
    toggleEditMode() {
      if (this.editMode) {
        this.temporaryTitle = null
        this.editMode = false
      } else {
        this.editMode = true
      }
    },
    updateTitle() {
      this.$emit('update-title', this.id, this.editedTitle)
      this.temporaryTitle = null
      this.editMode = false
    }
  }
}
</script>

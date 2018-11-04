<template lang="pug">
v-flex(xs12, sm6, offset-sm3)
  v-container(grid-list-sm, fluid)
    ApolloMutation(
      :mutation="require('@/apollo/mutations/signInUser.gql')",
      :variables="{email, password}",
      @done="onDone"
    )
      v-form(
        ref="form",
        slot-scope="{ mutate, loading, gqlError: error }",
        style="text-align: center;",
        v-model="valid",
        lazy-validation
      )
        v-alert(v-if="error", :value="error", type="error", dismissible) {{ error.message }}
        br
        v-text-field(
            v-model="email",
            type="email",
            label="Email",
            :rules="emailRules"
            required,
            :disabled="loading",
            @keyup.enter="submit(mutate)"
        )
        v-text-field(
            v-model="password",
            type="password",
            label="Password",
            :rules="passwordRules"
            required,
            :disabled="loading",
            @keyup.enter="submit(mutate)"
        )
        v-btn(:disabled="!valid", @click="submit(mutate)") submit
</template>

<script>
import currentUser from '../mixins/current-user'
import CURRENT_USER from '../apollo/queries/currentUser.gql'
import { onLogin } from '../vue-apollo'

export default {
  data: () => ({
    email: null,
    emailRules: [v => !!v || 'Email is required'],
    password: null,
    passwordRules: [v => !!v || 'Password is required'],
    valid: true
  }),
  mixins: [currentUser],
  watch: {
    currentUser (value) {
      if (value) {
        this.$router.replace({ name: 'Lessons' })
      }
    },
  },
  methods: {
    submit(mutate) {
      if(!this.$refs.form.validate()) return
      mutate()
      this.$refs.form.reset()
    },
    async onDone (result) {
      if (!result.data.signInUser) return

      const apolloClient = this.$apollo.provider.defaultClient

      await onLogin(apolloClient, result.data.signInUser.token)
      apolloClient.writeQuery({
        query: CURRENT_USER,
        data: {
          currentUser: result.data.signInUser.user,
        }
      })
    }
  }
}
</script>

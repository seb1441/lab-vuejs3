import CURRENT_USER from '../apollo/queries/currentUser.gql'

// @vue/component
export default {
  apollo: {
    currentUser: CURRENT_USER,
  }
}
import Vue from 'vue'
import Router from 'vue-router'
import Categories from './views/Categories.vue'
import Levels from './views/Levels.vue'
import Chapters from './views/Chapters.vue'
import Lessons from './views/Lessons.vue'
import Lesson from './views/lessons/Lesson.vue'
import Login from './views/Login.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/lessons'
    },
    {
      path: '/categories',
      name: 'Categories',
      component: Categories
    },
    {
      path: '/levels',
      name: 'Levels',
      component: Levels
    },
    {
      path: '/chapters',
      name: 'Chapters',
      component: Chapters
    },
    {
      path: '/lessons',
      name: 'Lessons',
      component: Lessons
    },
    {
      path: '/lessons/:id',
      name: 'Lesson',
      component: Lesson
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

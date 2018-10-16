import Vue from 'vue'
import Router from 'vue-router'
import Categories from './views/Categories.vue'
import Levels from './views/Levels.vue'
import Chapters from './views/Chapters.vue'
import Lessons from './views/Lessons.vue'
import Lesson from './views/lessons/Lesson.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/categories'
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
    }
  ]
})

import { createRouter, createWebHistory } from 'vue-router'

import Dashboard     from '../views/Dashboard.vue'
import SignUp        from '../views/SignUp.vue'
import Login         from '../views/Login.vue'
import Menu          from '../views/Menu.vue'
import MyPlants      from '../views/MyPlants.vue'
import ActiveSensors from '../views/ActiveSensors.vue'
import PlantDatabase from '../views/PlantDatabase.vue'
import DeleteAccount from '../views/DeleteAccount.vue'

const routes = [
  { path: '/dashboard', component: Dashboard },

  // only for guests (not signed in)
  { path: '/signup', component: SignUp, meta: { guest: true } },
  { path: '/login',  component: Login,  meta: { guest: true } },

  {
    path: '/menu',
    component: Menu,
    meta: { requiresAuth: true },
    children: [
      { path: 'myplants',      component: MyPlants },
      { path: 'activesensors', component: ActiveSensors },
      { path: 'plantdatabase', component: PlantDatabase }
    ]
  },

  {
    path: '/account/delete',
    name: 'DeleteAccount',
    component: DeleteAccount,
    meta: { requiresAuth: true }
  },

  // catch all unknown routes and redirect to login
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token') // simple login check

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login')
  }
  if (to.meta.guest && isLoggedIn) {
    return next('/menu/myplants')
  }
  next()
})

export default router


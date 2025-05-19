import { createRouter, createWebHistory } from 'vue-router'
import Dashboard     from '../views/Dashboard.vue'
import SignUp        from '../views/SignUp.vue'
import Login         from '../views/Login.vue'
import Menu          from '../views/Menu.vue'
import MyPlants      from '../views/MyPlants.vue'
import ActiveSensors from '../views/ActiveSensors.vue'
import PlantDatabase from '../views/PlantDatabase.vue'

const routes = [
  { path: '/dashboard', component: Dashboard },

  // only for guests (not signed in)
  { path: '/signup', component: SignUp, meta: { guest: true } },
  { path: '/login',  component: Login,  meta: { guest: true } },

  
  { path: '/menu', component: Menu, meta: { requiresAuth: true }, 
    children: [
      { path: 'myplants',      component: MyPlants },
      { path: 'activesensors', component: ActiveSensors },
      { path: 'plantdatabase', name: PlantDatabase ,component: PlantDatabase }
    ]
  },


  { path: '/:pathMatch(.*)*', redirect: '/login' },
  {
  path: '/menu/activesensors',
  component: () => import('@/views/ActiveSensors.vue'),
  meta: { requiresAuth: true }
}

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token') //log in validation

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login')
  }
  if ((to.meta.guest) && isLoggedIn) {
    return next('/menu/myplants')
  }
  next()
})

export default router

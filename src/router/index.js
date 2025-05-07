import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Menu from '../views/Menu.vue'
import MyPlants from '../views/MyPlants.vue'
import ActiveSensors from '../views/ActiveSensors.vue'
import PlantDatabase from '../views/PlantDatabase.vue'  

const routes = [
  { path: '/dashboard', component: Dashboard },
  { path: '/login', component: Login },
  { path: '/menu', component: Menu },
  { path: '/menu/MyPlants', component: MyPlants },
  { path: '/menu/ActiveSensors', component: ActiveSensors },
  { path: '/menu/PlantDatabase', component: PlantDatabase }  ]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

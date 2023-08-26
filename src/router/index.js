import Vue from 'vue'
import VueRouter from 'vue-router'

/* Local views */
const GameView = () => import('../views/GameView.vue')
const MobileView = () => import('../views/MobileView.vue')

/* Shared views */
const Blank = () => import('@root/.shared/views/Blank.vue')
const Login = () => import('@root/.shared/views/Login.vue')
const Signup = () => import('@root/.shared/views/Signup.vue')
const Forgot = () => import('@root/.shared/views/Forgot.vue')
const Logout = () => import('@root/.shared/views/Logout.vue')
const PasswordReset = () => import('@root/.shared/views/PasswordReset')

import auth from '@root/.shared/services/AuthService'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/login',
    category: 'hidden'
  },
  {
    path: '/',
    redirect: '/login',
    category: 'hidden'
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    category: 'hidden',
    meta: {
      requiresUnauth: true
    }
  },
  {
    path: '/forgot',
    name: 'Forgot Password',
    component: Forgot,
    category: 'hidden',
    meta: {
      requiresUnauth: true
    }
  },
  {
    path: '/pwreset',
    name: 'Password Reset',
    component: PasswordReset,
    category: 'hidden',
    meta: {
      requiresUnauth: true
    }
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
    category: 'hidden',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    icon: 'mdi-login-variant',
    component: Login,
    category: 'hidden',
    meta: {
      requiresUnauth: true,
      showOnNotLogin: true
    }
  },
  {
    path: '/home',
    name: 'PC Dashboard',
    component: GameView,
    icon: 'mdi-view-dashboard',
    category: 'hidden',
    meta: {
      customTitle: "",
      requiresAuth: true,
    }
  },
  {
    path: '/mobile',
    name: 'PC Mobile Dashboard',
    component: MobileView,
    icon: 'mdi-view-dashboard',
    category: 'hidden',
    meta: {
      customTitle: "",
      requiresAuth: true,
    }
  },
  {
    path: '/#div1',
    type: 'divider'
  },
  {
    path: '/rsd',
    name: 'RSD Home',
    component: Blank,
    icon: 'mdi-home',
    category: 'tool',
    beforeEnter() {location.href = 'https://readysetdice.com'}
  },
  {
    path: '/gm',
    name: 'GM Dashboard',
    miniName: 'GM',
    component: Blank,
    category: 'tool',
    beforeEnter() {location.href = 'https://gm.readysetdice.com'},
  },
  {
    path: '/#div2',
    type: 'divider'
  },
  {
    path: '/license',
    name: 'License',
    component: Blank,
    icon: 'mdi-license',
    category: 'foot',
    beforeEnter() {location.href = 'https://readysetdice.com/license'}
  },
  {
    path: '/blog',
    name: 'Blog (patreon)',
    component: Blank,
    icon: 'mdi-patreon',
    beforeEnter() {location.href = 'https://www.patreon.com/readysetdice'}
  },
  {
    path: '/discord',
    name: 'Join the Discord',
    component: Blank,
    icon: 'mdi-discord',
    category: 'foot',
    beforeEnter() {location.href = 'https://discord.gg/9gdTrgeY3X'}
  },
  
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  auth.authenticated().then(user => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresUnauth = to.matched.some(record => record.meta.requiresUnauth);
    const devOnly = to.matched.some(record => record.meta.devOnly)

    if (requiresAuth && !user) {
      next('login')
    } else if (requiresUnauth && !!user) {
      next('home')
    } else if (devOnly) {
      auth.profile().then(profile => {
        if (process.env.NODE_ENV !== "development" && (!!profile && !profile.dev)) {
          next('home')
        } else {
          next();
        }
      })
    } else {
      next();
    }
  })
});

export default router

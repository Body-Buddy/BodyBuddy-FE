import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import MainPage from '@/components/MainPage.vue'
import FriendList from '@/components/FriendList.vue'
import ChatRoom from '@/components/ChatRoom.vue'
import ChatDashboard from '@/components/ChatDashboard.vue'
import PostItem from '@/components/PostItem.vue'
import PostForm from '@/components/PostForm.vue'
import PostList from '@/components/PostList.vue'
import UserLoginForm from '@/components/UserLoginForm.vue'
import OAuth2RedirectHandler from '@/components/OAuth2RedirectHandler.vue'
import UserSignupForm from '@/components/UserSignupForm.vue'
import SocialSignupForm from '@/components/SocialSignupForm.vue'
import UserMypage from '@/components/UserMypage.vue'
import GymSearch from '@/components/GymSearch.vue'
import ProfileForm from '@/components/ProfileForm.vue'
import MatchingForm from '@/components/MatchingForm.vue'
import store from '@/store'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '/',
        component: MainPage
      },
      {
        path: '/friends',
        component: FriendList,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/chats',
        component: ChatDashboard,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/chats/:chatId',
        component: ChatRoom,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/posts',
        component: PostList,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/posts/write',
        component: PostForm,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/posts/:postId',
        component: PostItem,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/login',
        component: UserLoginForm
      },
      {
        path: '/oauth2/redirect',
        component: OAuth2RedirectHandler
      },
      {
        path: '/signup',
        component: UserSignupForm
      },
      {
        path: '/signup/social',
        component: SocialSignupForm,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/mypage',
        component: UserMypage,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/gyms/setup',
        component: GymSearch,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/profile/setup',
        component: ProfileForm,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/matching/setup',
        component: MatchingForm,
        meta: {
          requiresAuth: true
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (
    from.path === '/oauth2/redirect' ||
    to.path === '/signup/social' ||
    to.path === '/gyms/setup' ||
    to.path === '/profile/setup' ||
    to.path === '/matching/setup'
  ) {
    next()
    return
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.isAuthenticated) {
      window.alert('로그인이 필요한 페이지입니다.')
      next('/login')
      return
    }

    const user = store.getters.getUser
    if (user.needSocialSignup) {
      next('/signup/social')
    } else if (!user.hasRegisteredGym) {
      next('/gyms/setup')
    } else if (!user.hasSetProfile) {
      next('/profile/setup')
    } else if (!user.hasSetMatchingCriteria) {
      next('/matching/setup')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

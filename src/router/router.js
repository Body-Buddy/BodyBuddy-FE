import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/components/AppLayout.vue';
import MainPage from '@/components/MainPage.vue';
import FriendList from '@/components/FriendList.vue';
import ChatRoom from '@/components/ChatRoom.vue';
import ChatDashboard from '@/components/ChatDashboard.vue';
import PostItem from '@/components/PostItem.vue';
import PostForm from '@/components/PostForm.vue';
import PostList from '@/components/PostList.vue';
import UserLoginForm from '@/components/UserLoginForm.vue';
import UserSignupForm from '@/components/UserSignupForm.vue';
import SocialSignupForm from '@/components/SocialSignupForm.vue';
import UserMypage from '@/components/UserMypage.vue';
import GymSearch from '@/components/GymSearch.vue';
import ProfileForm from '@/components/ProfileForm.vue';
import MatchingForm from '@/components/MatchingForm.vue';

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
        component: FriendList
      },
      {
        path: '/chats',
        component: ChatDashboard,
      },
      {
        path: '/chats/:chatId',
        component: ChatRoom
      },
      {
        path: '/posts',
        component: PostList
      },
      {
        path: '/posts/write',
        component: PostForm
      },
      {
        path: '/posts/:postId',
        component: PostItem
      },
      {
        path: '/login',
        component: UserLoginForm
      },
      {
        path: '/signup',
        component: UserSignupForm
      },
      {
        path: '/signup/social',
        component: SocialSignupForm
      },
      {
        path: '/mypage',
        component: UserMypage
      },
      {
        path: '/gyms/setup',
        component: GymSearch
      },
      {
        path: '/profile/setup',
        component: ProfileForm
      },
      {
        path: '/matching/setup',
        component: MatchingForm
      }
    ],
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

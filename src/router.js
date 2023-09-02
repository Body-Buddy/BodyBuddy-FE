import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/components/AppLayout.vue';
import MainPage from '@/components/MainPage.vue';
import FriendList from '@/components/FriendList.vue';
import ChatRoom from '@/components/ChatRoom.vue';
import ChatList from '@/components/ChatList.vue';
import PostComponent from '@/components/PostComponent.vue';
import PostForm from '@/components/PostForm.vue';
import PostList from '@/components/PostList.vue';
import LoginComponent from '@/components/LoginComponent.vue';
import SignupComponent from '@/components/SignupComponent.vue';
import MypageComponent from '@/components/MypageComponent.vue';
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
        name: 'FriendList',
        component: FriendList,
        props: true
      },
      {
        path: '/chats',
        component: ChatList,
      },
      {
        path: '/chats/private/:chatId',
        component: ChatRoom
      },
      {
        path: '/posts',
        component: PostList
      },
      {
        path: '/posts/write',
        name: 'PostForm',
        component: PostForm,
        props: true
      },
      {
        path: '/posts/:postId',
        component: PostComponent
      },
      {
        path: '/login',
        component: LoginComponent
      },
      {
        path: '/signup',
        component: SignupComponent
      },
      {
        path: '/mypage',
        component: MypageComponent
      },
      {
        path: '/gyms/setup',
        name: 'GymSearch',
        component: GymSearch,
        props: true
      },
      {
        path: '/profile/setup',
        name: 'ProfileForm',
        component: ProfileForm,
        props: true
      },
      {
        path: '/matching/setup',
        name: 'MatchingForm',
        component: MatchingForm,
        props: true
      }
    ],
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

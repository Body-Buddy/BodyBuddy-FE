import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/components/AppLayout.vue';
import FriendList from '@/components/FriendList.vue';
import ChatRoom from '@/components/ChatRoom.vue';
import ChatList from '@/components/ChatList.vue';
import Post from '@/components/Post.vue';
import PostList from '@/components/PostList.vue';
import LoginComponent from '@/components/LoginComponent.vue';
import SignupComponent from '@/components/SignupComponent.vue';
import GymSearch from '@/components/GymSearch.vue';
import ProfileForm from '@/components/ProfileForm.vue';
import MatchingForm from '@/components/MatchingForm.vue';

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: 'friends',
        component: FriendList,
      },
      {
        path: 'chats',
        component: ChatList,
      },
      {
        path: 'chats/:chatId',
        component: ChatRoom
      },
      {
        path: 'posts',
        component: PostList
      },
      {
        path: 'posts/:postId',
        component: Post
      }
    ],
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
    path: '/gyms',
    component: GymSearch
  },
  {
    path: '/profile/setup',
    component: ProfileForm,
    props: true
  },
  {
    path: '/matching/setup',
    component: MatchingForm,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

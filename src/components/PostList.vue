<template>
    <div class="posts-list mt-10 max-w-3xl mx-auto">
      <div v-for="post in posts" :key="post.id" class="post-preview mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-4">
          <router-link :to="{ name: 'Post', params: { id: post.id } }">{{ post.title }}</router-link>
        </h3>
        <p class="text-gray-600 mb-3">{{ post.summary }}</p>
        <div class="flex justify-between text-gray-500 text-sm">
          <span>{{ post.author }}</span>
          <span>{{ post.date }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        posts: [
          // 샘플 데이터, 실제 데이터를 불러오는 API 호출로 대체할 수 있습니다.
          { id: 1, title: "제목 1", summary: "요약 1", author: "작성자 1", date: "2023-08-28" },
          { id: 2, title: "제목 2", summary: "요약 2", author: "작성자 2", date: "2023-08-29" },
          // ... 기타 게시물 데이터
        ]
      };
    },
  };
  </script>
  
  
  
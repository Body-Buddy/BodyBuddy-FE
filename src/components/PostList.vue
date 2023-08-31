<template>
  <div class="post-container bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">

    <!-- 글쓰기 버튼 -->
    <div class="flex write-button mb-4">
      <button @click="writePost" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">글쓰기</button>
    </div>

    <!-- 정렬 기준 선택 버튼 -->
    <div class="sort-button mb-4">
      <select v-model="sortOrder" class="border p-2 rounded">
        <option value="latest">최신순</option>
        <option value="oldest">오래된 순</option>
        <option value="likes">좋아요 순</option>
      </select>
    </div>

    <div class="post bg-white p-6 max-w-3xl mx-auto mt-10 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4">{{ post.title }}</h2>
      <p class="mb-4">{{ post.content }}</p>
      <div class="post-footer flex justify-between items-center text-gray-500 text-sm mb-4">
        <span>{{ post.author }}</span>
        <span>{{ post.date }}</span>
        <button @click="likePost" class="bg-blue-500 text-white px-3 py-1 rounded-full">{{ post.likes }} 좋아요</button>
      </div>
      <input v-model="newComment" placeholder="댓글 작성하기..." class="border p-2 w-full rounded mb-3" />
      <button @click="addComment" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">댓글 등록</button>

      <div class="comments space-y-4" v-for="comment in comments" :key="comment.id">
        <p class="text-gray-700 mb-2">{{ comment.content }}</p>
        <div class="comment-footer flex justify-between items-center text-gray-500 text-sm">
          <span>{{ comment.author }}</span>
          <span>{{ comment.date }}</span>
          <button @click="likeComment(comment.id)" class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-300 transition-colors">{{ comment.likes }} 좋아요</button>
        </div>
      </div>
    </div>

    <!-- 페이징 처리 -->
    <div class="pagination mt-4 flex justify-center">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1" class="mx-1 px-3 py-1 border rounded">이전</button>
      <span class="mx-1">{{ currentPage }}</span>
      <button @click="goToPage(currentPage + 1)" class="mx-1 px-3 py-1 border rounded">다음</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      post: {
        title: "Post Title",
        content: "This is a sample post content.",
        author: "Author Name",
        date: "2023-08-28",
        likes: 10
      },
      comments: [],
      newComment: "",
      sortOrder: 'latest',  // 정렬 기준을 저장하기 위한 데이터
      currentPage: 1      // 현재 페이지 번호
    };
  },
  methods: {
    likePost() {
      this.post.likes++;
    },
    likeComment(commentId) {
      const comment = this.comments.find(c => c.id === commentId);
      comment.likes++;
    },
    addComment() {
      if (this.newComment.trim() !== "") {
        const comment = {
          content: this.newComment,
          author: "Current User",
          date: new Date().toISOString().slice(0, 10),
          likes: 0
        };
        this.comments.push(comment);
        this.newComment = "";
      }
    },
    writePost() {
      // 글쓰기 로직
    },
    goToPage(pageNumber) {
      this.currentPage = pageNumber;
    }
  }
};
</script>

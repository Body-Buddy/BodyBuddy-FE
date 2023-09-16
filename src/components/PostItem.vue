<template>
  <div class="post-container bg-white p-6 max-w-3xl mx-auto mt-10 rounded-lg shadow-md">
    <!-- 게시글 제목 및 본문 -->
    <h2 class="text-2xl font-bold mb-4">{{ post.title }}</h2>
    <p class="mb-4">{{ post.content }}</p>

    <!-- 수정 버튼 (작성자 본인일 경우) -->
    <button v-if="isPostAuthor()" @click="editPost">수정</button>
    <button v-if="isPostAuthor()" @click="deletePost">삭제</button>

    <!-- 게시글 정보 -->
    <div class="post-footer flex justify-between items-center text-gray-500 text-sm mb-4">
      <span>{{ post.author.profileImage }}</span>
      <span>{{ post.author.nickname }}</span>
      <span>{{ post.createdAt }}</span>
      <button @click="toggleLikePost" class="bg-blue-500 text-white px-3 py-1 rounded-full">
        {{ post.likeCount }} 좋아요
      </button>
    </div>

    <!-- 댓글 입력 부분 -->
    <input
      v-model="newComment"
      placeholder="댓글 작성하기..."
      class="border p-2 w-full rounded mb-3"
    />
    <button
      @click="addComment(null)"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
    >
      댓글 등록
    </button>

    <!-- 댓글 목록 -->
    <div class="comments space-y-4 mt-6">
      <div v-for="comment in post.comments" :key="comment.id">
        <div :class="{ 'pl-6': comment.parentId !== 0 }">
          <!-- 대댓글 들여쓰기 -->
          <p class="text-gray-700 mb-2">{{ comment.content }}</p>
          <div class="comment-footer flex justify-between items-center text-gray-500 text-sm">
            <span>{{ comment.author.nickname }}</span>
            <span>{{ comment.createdAt }}</span>
            <button
              @click="likeComment(comment.id)"
              class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-300 transition-colors"
            >
              {{ comment.likeCount }} 좋아요
            </button>
          </div>
          <!-- 대댓글 입력 (대댓글의 깊이 제한 적용) -->
          <div v-if="comment.parentId === 0" class="reply-input mt-3">
            <input
              v-model="newReply[comment.id]"
              placeholder="대댓글 작성하기..."
              class="border p-2 w-full rounded mb-2"
            />
            <button
              @click="addComment(comment.id)"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              대댓글 등록
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios.js'

export default {
  data() {
    return {
      post: null,
      postId: this.$route.params.postId,
      newComment: '',
      newReply: {}
    }
  },
  mounted() {
    this.getPost(this.postId)
  },
  methods: {
    async getPost(postId) {
      const response = await api.get(`/posts/${postId}`)
      this.post = response.data
    },
    toggleLikePost() {
      // Add logic to check if the user has already liked the post
      // and to toggle the like accordingly
      api.post(`/posts/${this.postId}/likes`)
    },
    toggleLikeComment(commentId) {
      // Add logic to check if the user has already liked the comment
      // and to toggle the like accordingly
      api.post(`/comments/${commentId}/likes`)
    },
    addComment(parentId = 0) {
      const content = parentId === 0 ? this.newComment : this.newReply[parentId]

      if (content && content.trim() !== '') {
        const comment = {
          id: Date.now(),
          content: content,
          author: this.$store.getters.getUser.nickname,
          date: new Date().toISOString().slice(0, 10),
          likes: 0,
          parentId: parentId
        }

        this.post.comments.push(comment)
        parentId === 0 ? (this.newComment = '') : (this.newReply[parentId] = '')

        api.post(`/comments`, comment)
      }
    },
    deleteComment(commentId) {
      const index = this.post.comments.findIndex((c) => c.id === commentId)
      this.post.comments.splice(index, 1)
      api.delete(`/comments/${commentId}`)
    },
    editPost() {
      this.$router.push(`/posts/${this.postId}/edit`)
    },
    deletePost() {
      api.delete(`/posts/${this.postId}`)
      this.$router.push('/posts')
    },
    isPostAuthor() {
      return this.$store.getters.getUser.id === this.post.author.id
    },
    isCommentAuthor(comment) {
      return this.$store.getters.getUser.id === comment.author.id
    }
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto mt-10" v-if="post">
    <!-- 게시글 영역 -->
    <div class="post-content pb-4">
      <div class="flex justify-between items-start mb-4">
        <!-- 작성자 정보 -->
        <div class="flex items-center">
          <img
            :src="post.author.profileImage"
            alt="Author's profile image"
            class="w-8 h-8 rounded-full mr-2"
          />
          <span class="font-medium">{{ post.author.nickname }}</span>
        </div>
        <!-- 게시글 작성일 및 수정, 삭제 버튼 -->
        <div class="flex items-center">
          <span class="text-gray-500 text-sm mr-4">{{ formatDate(post.createdAt) }}</span>
          <template v-if="isPostAuthor()">
            <button @click="editPost" class="text-yellow-400 hover:text-yellow-600">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="deletePost" class="ml-2 text-red-600 hover:text-red-800">
              <i class="fas fa-trash-alt"></i>
            </button>
          </template>
        </div>
      </div>
      <!-- 게시글 제목과 내용 -->
      <h2 class="text-2xl font-bold mb-4">{{ post.title }}</h2>
      <p class="mb-4">{{ post.content }}</p>

      <!-- 게시글 이미지 및 비디오 -->
      <div v-if="post.medias && post.medias.length">
        <div v-for="media in post.medias" :key="media.id" class="my-8">
          <!-- 이미지 타입일 경우 -->
          <img
            v-if="media.mediaType === 'IMAGE'"
            :src="media.s3Url"
            :alt="'Image ' + media.id"
            class="w-1/2 rounded-lg"
          />

          <!-- 비디오 타입일 경우 -->
          <video v-if="media.mediaType === 'VIDEO'" controls class="w-1/2 rounded-lg">
            <source :src="media.s3Url" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <!-- 좋아요 버튼 -->
      <button
        @click="toggleLikePost"
        class="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors"
      >
        <i class="fas fa-thumbs-up"></i> {{ post.likedUserIds.length }}
      </button>
    </div>

    <!-- 댓글 입력 영역 -->
    <div class="flex items-center my-4">
      <input
        class="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none"
        v-model="newComment"
        placeholder="댓글을 입력하세요..."
      />
      <button
        @click="addComment(newComment)"
        class="ml-4 px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        전송
      </button>
    </div>

    <!-- 댓글 목록 영역 -->
    <div class="comments mt-10">
      <div v-for="comment in post.comments" :key="comment.id" class="my-2">
        <div class="border-b">
          <div class="flex justify-between items-start">
            <!-- 댓글 작성자 정보 -->
            <div class="flex items-center mb-2">
              <img
                :src="comment.author.profileImage"
                alt="Author's profile image"
                class="w-6 h-6 rounded-full mr-2"
              />
              <span class="font-medium">{{ comment.author.nickname }}</span>
            </div>
            <!-- 댓글 버튼들(대댓글, 좋아요, 수정, 삭제) -->
            <div>
              <button @click="toggleReplyForm(comment.id)" class="mr-2 text-gray-500">
                <i class="fas fa-comment-dots"></i>
              </button>
              <button @click="toggleLikeComment(comment)" class="text-gray-500">
                <i class="fas fa-thumbs-up mr-1" :class="{ 'text-blue-500': isLiked(comment) }"></i>
                <span>{{ comment.likedUserIds.length }}</span>
              </button>
              <template v-if="isCommentAuthor(comment)">
                <button
                  @click="startEditing(comment)"
                  class="ml-2 text-yellow-400 hover:text-yellow-600"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteComment(comment.id)"
                  class="ml-2 text-red-600 hover:text-red-800"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </template>
            </div>
          </div>
          <!-- 댓글 수정 영역 -->
          <template v-if="editingCommentId === comment.id">
            <textarea
              v-model="editingCommentContent"
              class="border p-2 w-full rounded mb-2 mt-2"
            ></textarea>
            <div class="flex justify-end space-x-2 mb-2">
              <button
                @click="updateComment(comment.id)"
                class="bg-green-500 text-white px-4 py-2 rounded"
              >
                저장
              </button>
              <button
                @click="editingCommentId = null"
                class="bg-gray-500 text-white px-4 py-2 rounded"
              >
                취소
              </button>
            </div>
          </template>
          <!-- 댓글 내용 -->
          <template v-else>
            <p class="text-gray-700 mb-2 mt-2">{{ comment.content }}</p>
          </template>
          <!-- 댓글 작성일 -->
          <div class="text-sm text-gray-500 mb-2">{{ formatDate(comment.createdAt) }}</div>
          <!-- 대댓글 입력 영역 -->
          <div v-if="activeReplyForm === comment.id">
            <div class="flex items-center my-4">
              <input
                class="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none"
                v-model="newReply[comment.id]"
                placeholder="대댓글을 입력하세요..."
              />
              <button
                @click="addReplyComment(comment.id)"
                class="ml-4 px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                전송
              </button>
            </div>
          </div>
        </div>
        <!-- 대댓글 목록 영역 -->
        <div
          v-for="childComment in comment.children"
          :key="childComment.id"
          class="ml-8 my-4 border-b"
        >
          <!-- 화살표 아이콘 -->
          <div class="relative">
            <i
              class="fa-solid fa-turn-up fa-rotate-90 absolute top-0 left-[-1.5rem] text-gray-500"
            ></i>
            <!-- 대댓글 내용 표시 부분 -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center">
                <img
                  :src="childComment.author.profileImage"
                  alt="Author's profile image"
                  class="w-6 h-6 rounded-full mr-2"
                />
                <span class="font-medium">{{ childComment.author.nickname }}</span>
              </div>
              <div>
                <!-- 대댓글 관련 버튼(좋아요, 수정, 삭제) -->
                <button @click="toggleLikeComment(childComment)" class="text-gray-500">
                  <i
                    class="fas fa-thumbs-up mr-1"
                    :class="{ 'text-blue-500': isLiked(childComment) }"
                  ></i>
                  <span>{{ childComment.likedUserIds.length }}</span>
                </button>
                <template v-if="isCommentAuthor(childComment)">
                  <button
                    @click="startEditing(childComment)"
                    class="ml-2 text-yellow-400 hover:text-yellow-600"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="deleteComment(childComment.id)"
                    class="ml-2 text-red-600 hover:text-red-800"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </template>
              </div>
            </div>
            <p class="text-gray-700 mb-2 mt-2">{{ childComment.content }}</p>
            <div class="text-sm text-gray-500 mb-2">{{ formatDate(childComment.createdAt) }}</div>
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
      userId: this.$store.getters.getUser.id,
      newComment: '',
      newReply: {},
      editingCommentId: null,
      editingCommentContent: '',
      activeReplyForm: null
    }
  },
  mounted() {
    this.getPost(this.postId)
  },
  methods: {
    async getPost(postId) {
      const response = await api.get(`/posts/${postId}`)
      this.post = response.data

      console.log(response.data)
    },
    isLiked(postOrComment) {
      return postOrComment.likedUserIds.includes(this.userId)
    },
    async toggleLikePost() {
      if (this.isLiked(this.post)) {
        await api.delete(`/posts/${this.postId}/likes`)
      } else {
        await api.post(`/posts/${this.postId}/likes`)
      }
      this.getPost(this.postId)
    },
    async toggleLikeComment(comment) {
      if (this.isLiked(comment)) {
        await api.delete(`/comments/${comment.id}/likes`)
      } else {
        await api.post(`/comments/${comment.id}/likes`)
      }
      this.getPost(this.postId)
    },
    async addComment(content) {
      if (content && content.trim() !== '') {
        const comment = {
          postId: this.postId,
          content: content,
          parentId: 0
        }
        const response = await api.post(`/comments`, comment)
        console.log(response)
        this.getPost(this.postId)

        this.newComment = ''
      }
    },
    async addReplyComment(parentId) {
      const content = this.newReply[parentId]

      if (content && content.trim() !== '') {
        const comment = {
          postId: this.postId,
          content: content,
          parentId: parentId
        }
        const response = await api.post(`/comments`, comment)
        console.log(response.data)
        this.getPost(this.postId)

        this.newReply[parentId] = ''
      }
    },
    startEditing(comment) {
      this.editingCommentId = comment.id
      this.editingCommentContent = comment.content
    },
    async updateComment(commentId) {
      await api.put(`/comments/${commentId}`, { content: this.editingCommentContent })
      this.editingCommentId = null
      this.getPost(this.postId)
    },
    async deleteComment(commentId) {
      await api.delete(`/comments/${commentId}`)
      this.getPost(this.postId)
    },
    editPost() {
      this.$router.push(`/posts/${this.postId}/edit`)
    },
    deletePost() {
      const response = api.delete(`/posts/${this.postId}`)
      if (response.status === 200) {
        window.alert('게시글이 삭제되었습니다!')
        this.$router.push('/posts')
      }
    },
    isPostAuthor() {
      return this.userId === this.post.author.id
    },
    isCommentAuthor(comment) {
      return this.userId === comment.author.id
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${year}/${month}/${day} ${hours}:${minutes}`
    },
    toggleReplyForm(commentId) {
      if (this.activeReplyForm === commentId) {
        this.activeReplyForm = null
      } else {
        this.activeReplyForm = commentId
      }
    }
  }
}
</script>

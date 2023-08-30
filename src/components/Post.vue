<template>
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
        comments: [
          // Example data for comments
        ],
        newComment: ""
      };
    },
    methods: {
      likePost() {
        this.post.likes++;
        // Add API call to increase like count on the server
      },
      likeComment(commentId) {
        const comment = this.comments.find(c => c.id === commentId);
        comment.likes++;
        // Add API call to increase like count on the server for the comment
      },
      addComment() {
        if (this.newComment.trim() !== "") {
          const comment = {
            content: this.newComment,
            author: "Current User", // Replace with actual current user's name
            date: new Date().toISOString().slice(0, 10),
            likes: 0
          };
          this.comments.push(comment);
          this.newComment = "";
          // Add API call to post the comment to the server
        }
      }
    }
  };
  </script>

  
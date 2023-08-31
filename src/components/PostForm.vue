<template>
    <div class="post-form-container bg-white p-6 max-w-3xl mx-auto mt-10 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4">글 작성하기</h2>
  
      <!-- 제목 입력 부분 -->
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2" for="title">제목</label>
        <input v-model="title" class="border p-2 w-full rounded" id="title" placeholder="제목을 입력하세요">
      </div>
  
      <!-- 본문 입력 부분 -->
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2" for="content">본문</label>
        <textarea v-model="content" rows="5" class="border p-2 w-full rounded" id="content" placeholder="본문을 입력하세요"></textarea>
      </div>
  
      <!-- 이미지 및 비디오 추가 부분 -->
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">이미지/비디오 추가</label>
        <input type="file" multiple ref="mediaInput" @change="handleMediaFiles" style="display: none" />
        <button @click="addMedia" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mb-2">파일 추가</button>
        <div class="media-preview grid grid-cols-2 gap-2">
          <div v-for="media in mediaFiles" :key="media.name">
            <img v-if="media.type.includes('image')" :src="media.url" alt="media preview" class="h-32 w-full object-cover rounded">
            <video v-if="media.type.includes('video')" controls class="h-32 w-full rounded">
              <source :src="media.url" :type="media.type">
            </video>
          </div>
        </div>
      </div>
  
      <!-- 카테고리 선택 부분 -->
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">카테고리</label>
        <select v-model="category" class="border p-2 rounded w-full">
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
  
      <!-- 게시 버튼 -->
      <div class="mb-6">
        <button @click="submitPost" class="bg-green-600 text-white w-full py-2 px-4 rounded hover:bg-green-700 transition-colors">게시하기</button>
      </div>
  
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        title: "",
        content: "",
        mediaFiles: [],
        category: "",
        categories: ["카테고리1", "카테고리2", "카테고리3"]  // 예시 카테고리입니다. 실제 카테고리로 교체하시면 됩니다.
      };
    },
    methods: {
      addMedia() {
        this.$refs.mediaInput.click();
      },
      handleMediaFiles(event) {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const url = URL.createObjectURL(file);
          this.mediaFiles.push({ name: file.name, type: file.type, url: url });
        }
      },
      submitPost() {
        // API 호출 또는 다른 로직을 이용하여 게시글을 저장합니다.
        // 예제에서는 간단하게 console.log만 출력하겠습니다.
        console.log({
          title: this.title,
          content: this.content,
          category: this.category,
          mediaFiles: this.mediaFiles
        });
      }
    }
  };
  </script>
<template>
  <div class="max-w-xl mx-auto space-y-6 mt-10">
    <h1 class="text-2xl font-bold">마이페이지</h1>

    <!-- 프로필 수정 -->
    <div
      class="p-4 bg-gray-100 rounded flex items-center justify-between hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
    >
      <span class="font-semibold">프로필 수정</span>
      <i class="fas fa-user-edit"></i>
    </div>

    <!-- 차단 친구 관리 -->
    <div
      class="p-4 bg-gray-100 rounded flex items-center justify-between hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
    >
      <span class="font-semibold">차단 친구 관리</span>
      <i class="fas fa-user-slash"></i>
    </div>

    <!-- 나의 헬스장 관리 -->
    <div
      class="p-4 bg-gray-100 rounded flex items-center justify-between hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
    >
      <span class="font-semibold">나의 헬스장 관리</span>
      <i class="fas fa-dumbbell"></i>
    </div>

    <!-- 내가 쓴 글, 댓글 조회 -->
    <div
      class="p-4 bg-gray-100 rounded flex items-center justify-between hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
    >
      <span class="font-semibold">내가 쓴 글, 댓글 조회</span>
      <i class="fas fa-comments"></i>
    </div>
  </div>
</template>

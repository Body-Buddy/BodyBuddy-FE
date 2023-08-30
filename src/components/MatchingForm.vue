<template>
  <div
    class="flex flex-col items-start space-y-8 min-h-screen justify-center p-6 bg-gray-100 w-full max-w-2xl mx-auto"
  >
    <div v-for="category in categories" :key="category.name">
      <h3 class="text-xl font-bold mb-4">{{ category.name }}</h3>
      <div class="tag-container flex space-x-2 flex-wrap">
        <div
          v-for="tag in category.tags"
          :key="tag"
          :class="[
            'tag',
            'px-4 py-1 mb-2 rounded-full cursor-pointer transition-colors',
            category.selected === tag
              ? 'bg-blue-500 text-white'
              : 'border border-gray-300 hover:bg-gray-200'
          ]"
          @click="selectTag(category, tag)"
        >
          {{ tag }}
        </div>
      </div>
    </div>

    <button
      class="w-full bg-blue-500 text-white py-2 px-4 rounded focus:outline-none hover:bg-blue-600 transition-colors duration-300"
      @click="submitCriteria"
    >
      다음으로
    </button>
  </div>
</template>

<script>
import api from '@/axios.js'

export default {
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      categories: [
        {
          name: '동성 친구 선호',
          tags: ['선호', '무관'],
          selected: null
        },
        {
          name: '같은 연령대 선호',
          tags: ['선호', '무관'],
          selected: null
        },
        {
          name: '운동 목표',
          tags: ['근육증가', '체력증가', '체중감소'],
          selected: null
        },
        {
          name: '운동 경험',
          tags: ['1년 미만', '1-3년', '3년 이상'],
          selected: null
        },
        {
          name: '운동 강도',
          tags: ['초보', '중급', '전문'],
          selected: null
        },
        {
          name: '운동 시간대',
          tags: ['아침', '점심', '저녁'],
          selected: null
        }
        // 다른 카테고리를 추가하실 경우, 이 배열에 계속 추가하시면 됩니다.
      ]
    }
  },
  methods: {
    selectTag(category, tag) {
      category.selected = tag
    },
    async submitCriteria() {
      try {
        const criteriaData = this.categories.map((category) => ({
          category: category.name,
          selected: category.selected
        }))

        await api.post(`/users/${this.userId}/criteria`, criteriaData)

        // 성공적으로 데이터를 전송한 후에 원하는 동작을 추가하십시오.
        // 예: 다음 페이지로 이동
      } catch (error) {
        console.error('데이터 전송 중 오류 발생:', error)
      }
    }
  }
}
</script>

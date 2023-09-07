<template>
  <div class="max-w-xl mx-auto mt-10">
    <div class="mb-8">
      <p class="text-blue-500 text-3xl tracking-wide font-extrabold mb-2">3/3</p>
      <p class="font-bold text-2xl mb-2">추가 정보를 입력해주세요.</p>
      <p class="text-gray-600">더 잘 맞는 운동 친구를 찾아드릴게요!</p>
    </div>
    <div v-for="category in categories" :key="category.name" class="mb-6">
      <div class="mb-2">
        <span class="text-lg font-semibold">{{ category.name }}</span>
        <span v-if="category.name === '운동 목표'" class="pl-1 text-gray-500 text-sm">
          여러 개 선택 가능해요.
        </span>
      </div>
      <div class="flex items-start flex-wrap">
        <div
          v-for="tag in category.tags"
          :key="tag"
          :class="[
            'tag',
            'px-4 py-1 mb-3 mr-2 rounded-full cursor-pointer transition-colors',
            category.selected === tag ||
            (Array.isArray(category.selected) && category.selected.includes(tag))
              ? 'bg-blue-500 text-white'
              : 'border border-gray-300 hover:bg-gray-200'
          ]"
          @click="selectTag(category, tag)"
        >
          {{ tag }}
        </div>
      </div>
    </div>

    <div class="text-center mt-8 mb-10">
      <button
        class="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none hover:bg-blue-600"
        @click="submitCriteria"
      >
        다음으로
      </button>
    </div>
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
          name: '내 친구의 성별',
          tags: ['동성 친구가 좋아요', '상관없어요'],
          selected: null
        },
        {
          name: '내 친구의 나이',
          tags: ['같은 연령대가 좋아요', '상관없어요'],
          selected: null
        },
        {
          name: '운동 목표',
          tags: [
            '체지방 줄이기',
            '근육량 늘리기',
            '체력 키우기',
            '바디 프로필',
            '몸 유지하기',
            '건강한 습관 만들기'
          ],
          selected: []
        },
        {
          name: '운동 경험',
          tags: ['1년 미만', '1-3년', '3년 이상'],
          selected: null
        },
        {
          name: '운동 강도',
          tags: ['가볍게', '적당히', '철저하게'],
          selected: null
        },
        {
          name: '운동 시간대',
          tags: ['아침', '점심', '저녁', '밤'],
          selected: null
        }
      ]
    }
  },
  methods: {
    selectTag(category, tag) {
      if (Array.isArray(category.selected)) {
        if (category.selected.includes(tag)) {
          // 태그가 이미 선택되어 있다면 제거
          category.selected = category.selected.filter((t) => t !== tag)
        } else {
          // 아니면 추가
          category.selected.push(tag)
        }
      } else {
        category.selected = tag
      }
    },
    async submitCriteria() {
      const GoalMapping = {
        '체지방 줄이기': 'FAT_REDUCTION',
        '근육량 늘리기': 'MUSCLE_GAIN',
        '체력 키우기': 'STAMINA_IMPROVEMENT',
        '바디 프로필': 'BODY_PROFILE',
        '몸 유지하기': 'MAINTAIN_BODY',
        '건강한 습관 만들기': 'BUILD_HEALTHY_HABIT'
      }

      const ExperienceMapping = {
        '1년 미만': 'BEGINNER',
        '1-3년': 'INTERMEDIATE',
        '3년 이상': 'EXPERT'
      }

      const IntensityMapping = {
        가볍게: 'LOW',
        적당히: 'MEDIUM',
        철저하게: 'HIGH'
      }

      const TimeMapping = {
        아침: 'MORNING',
        점심: 'AFTERNOON',
        저녁: 'EVENING',
        밤: 'NIGHT'
      }

      try {
        let criteriaData = {}

        for (let category of this.categories) {
          if (category.name === '내 친구의 성별') {
            criteriaData['preferSameGender'] = category.selected === '동성 친구가 좋아요'
          } else if (category.name === '내 친구의 나이') {
            criteriaData['preferSameAgeRange'] = category.selected === '같은 연령대가 좋아요'
          } else if (category.name === '운동 목표') {
            criteriaData['goals'] = category.selected.map((tag) => GoalMapping[tag])
          } else if (category.name === '운동 경험') {
            criteriaData['experience'] = ExperienceMapping[category.selected]
          } else if (category.name === '운동 강도') {
            criteriaData['intensity'] = IntensityMapping[category.selected]
          } else if (category.name === '운동 시간대') {
            criteriaData['exerciseTime'] = TimeMapping[category.selected]
          }
        }
        const response = await api.post(`/users/${this.userId}/criteria`, criteriaData)
        console.log(response)
        if (response.status !== 200) {
          window.alert('매칭 기준 저장에 실패했습니다. 다시 시도해주세요.')
          return
        }

        this.$router.push({
          name: 'FriendList',
          params: { userId: this.userId }
        })
      } catch (error) {
        console.error('데이터 전송 중 오류 발생:', error)
      }
    }
  }
}
</script>

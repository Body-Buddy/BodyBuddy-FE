import { reactive, watchEffect, ref } from 'vue'

const state = reactive({
  events: []
})

export const useEventBus = () => {
  const watchers = ref({})

  const emit = (event, payload) => {
    state.events.push({ event, payload })
  }

  const on = (event, callback) => {
    const watcher = watchEffect(() => {
      const foundEvent = state.events.find((e) => e.event === event)
      if (foundEvent) {
        callback(foundEvent.payload)
        state.events = state.events.filter((e) => e !== foundEvent)
      }
    })
    if (!watchers.value[event]) {
      watchers.value[event] = []
    }
    watchers.value[event].push(watcher)
  }

  const off = (event) => {
    if (watchers.value[event]) {
      for (let i = watchers.value[event].length - 1; i >= 0; i--) {
        const watcher = watchers.value[event][i]
        watcher.stop()
        watchers.value[event].splice(i, 1)
      }
    }
  }

  return {
    emit,
    on,
    off
  }
}

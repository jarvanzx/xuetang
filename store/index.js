// 页面路径：store/index.js 
import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/api'

Vue.use(Vuex); //vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
  state: { //存放状态
    audioList: [],
    currentCourseId: '',
    lastPlayCourseId: '',
    playIndex: 0,
    audioDuration: 0,
    audioCurrentTime: 0,
    playPercent: 0,
    curSpeed: 1,
    curTime: 0,
    isCustom: false,
    customTimeStr: '',
    typeIndex: 0,
    audioCanplay: false,
    audioPlaying: false,
    study_time: 0,
    playTypeStr: 'round',
    remainTime: 0,
    timerId: null
  },
  mutations: { //唯一允许更新状态的地方
    SET_COURSE_LIST(state, list) {
      state.audioList = list
    },
    SET_PLAY_INDEX(state, index) {
      state.playIndex = index
    },
    SET_PLAY_STATE(state, bool) {
      state.audioPlaying = bool
    },
    SET_AUDIO_READY(state, bool) {
      state.audioCanplay = bool
    },
    SET_AUDIO_DURATION(state, duration) {
      state.audioDuration = duration
    },
    SET_AUDIO_CURRENTTIME(state, currentTime) {
      state.audioCurrentTime = currentTime
    },
    SET_AUDIO_PERCENT(state, percent) {
      state.playPercent = percent
    },
    SET_AUDIO_SPEED(state, speed) {
      state.curSpeed = speed
    },
    SET_AUDIO_TIME(state, time) {
      state.curTime = time
    },
    SET_AUDIO_CUSTOM(state, isCustom) {
      state.isCustom = isCustom
    },
    SET_AUDIO_CUSTOM_TIME(state, customTimeStr) {
      state.customTimeStr = customTimeStr
    },
    SET_AUDIO_TYPE_INDEX(state, index) {
      state.typeIndex = index
    },
    SET_STUDY_TIME(state, time) {
      state.study_time = time
    },
    SET_CURRENT_COURSE_ID(state, courseId) {
      state.currentCourseId = courseId
    },
    SET_LAST_PLAY_COURSE_ID(state, courseId) {
      state.lastPlayCourseId = courseId
    },
    SET_PLAY_TYPE_STR(state, str) {
      state.playTypeStr = str
    },
    SET_REMAIN_TIME(state, time) {
      state.remainTime = time
    },
    SET_TIMER_ID(state, id) {
      state.timerId = id
    },
  },
  actions: { //组件中通过this.$store.dispatch('方法名')来触发
    setCourseList({
      commit
    }, list) {
      commit('SET_COURSE_LIST', list)
    },
    setPlayCourse({
      commit
    }, courseId) {
      commit('SET_PLAY_COURSE', courseId)
    },
    setPlayIndex({
      commit
    }, index) {
      commit('SET_PLAY_INDEX', index)
    },
    setPlayState({
      commit
    }, bool) {
      commit('SET_PLAY_STATE', bool)
    },
    setAudioReady({
      commit
    }, bool) {
      commit('SET_AUDIO_READY', bool)
    },
    setAudioDuration({
      commit
    }, duration) {
      commit('SET_AUDIO_DURATION', duration)
    },
    setAudioCurrentTime({
      commit
    }, currentTime) {
      commit('SET_AUDIO_CURRENTTIME', currentTime)
    },
    setAudioPercent({
      commit
    }, percent) {
      commit('SET_AUDIO_PERCENT', percent)
    },
    setAudioSpeed({
      commit
    }, speed) {
      commit('SET_AUDIO_SPEED', speed)
    },
    setAudioTime({
      commit
    }, time) {
      commit('SET_AUDIO_TIME', time)
      commit('SET_REMAIN_TIME', time * 60)
    },
    setAudioCustom({
      commit
    }, isCustom) {
      commit('SET_AUDIO_CUSTOM', isCustom)
    },
    setAudioCustomTime({
      commit
    }, customTimeStr) {
      commit('SET_AUDIO_CUSTOM_TIME', customTimeStr)
    },
    setAudioTypeIndex({
      commit
    }, index) {
      commit('SET_AUDIO_TYPE_INDEX', index)
    },
    setStudyTime({
      commit
    }, time) {
      commit('SET_STUDY_TIME', time)
    },
    async postStudyTime({
      commit,
      state
    }) {
      await Api.postStudyTime({
        course_id: state.currentCourseId,
        course_file_id: state.audioList[state.playIndex]['id'],
        type: 1,
        view_time: state.study_time / 1000
      })
      commit('SET_STUDY_TIME', 0)
    },
    setPlayTypeStr({
      commit
    }, str) {
      commit('SET_PLAY_TYPE_STR', str)
    },
    timeDown({
      commit,
      state
    }) {
      if (state.remainTime > 0) {
        const timer = setInterval(() => {
          commit('SET_REMAIN_TIME', state.remainTime - 1)
          if (state.remainTime < 1) {
            clearInterval(state.timerId)
            commit('SET_TIMER_ID', null)
            commit('SET_AUDIO_TIME', 0)
          }
        }, 1000)
        commit('SET_TIMER_ID', timer)
      } else {
        clearInterval(state.timerId)
        commit('SET_TIMER_ID', null)
      }
    }
  },
  getters: { //获取状态
    getCourseId(state) {
      if (state.currentCourseId) {
        return state.currentCourseId
      } else if (state.lastPlayCourseId) {
        return state.lastPlayCourseId
      } else {
        return ''
      }
    }
  }
})
export default store
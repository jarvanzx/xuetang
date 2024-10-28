import store from "../store"
const bgAudio = uni.getBackgroundAudioManager()
bgAudio.stop()
export function audioHandler() {
  function selectCourse(index) {
    if (index == store.state.playIndex) return
    bgAudio.stop()
    store.dispatch('setPlayIndex', index)
    store.dispatch('setAudioCurrentTime', 0)
    store.dispatch('setAudioPercent', 0)
    playAudio()
    store.commit('SET_PLAY_STATE', true)
  }
  bgAudio.onCanplay(() => {
    store.commit('SET_AUDIO_READY', true)
    console.log(bgAudio.duration);
    store.dispatch('setAudioDuration', bgAudio.duration ?? 0)
  })
  bgAudio.onEnded(() => {
    console.log('end');
    bgAudio.stop()
    store.commit('SET_PLAY_STATE', false)
    store.dispatch('postStudyTime')
    // store.dispatch('setAudioPercent', 100)
    // store.dispatch('setAudioCurrentTime', 0)
    console.log(store.state.playTypeStr);
    switch (store.state.playTypeStr) {
      case 'round':
        selectCourse(store.state.playIndex === store.state.audioList.length - 1 ? 0 : store.state.playIndex + 1)
        break;
      case 'random':
        selectCourse(Math.floor(Math.random() * store.state.audioList.length))
        break;
      case 'single':
        console.log('single');
        bgAudio.seek(0)
        // bgAudio.play()
        playAudio()
        break;
    }
  })
  bgAudio.onPlay(() => {
    store.dispatch('setPlayState', true)
    console.log(bgAudio.duration);
    store.dispatch('setAudioDuration', isNaN(bgAudio.duration) ? 0 : bgAudio.duration)
  })
  bgAudio.onPause(() => {
    store.commit('SET_PLAY_STATE', false)

  })
  bgAudio.onError((res) => {
    console.log(res)
    store.commit('SET_AUDIO_READY', false)
  })
  bgAudio.onTimeUpdate(() => {
    store.commit('SET_AUDIO_CURRENTTIME', bgAudio.currentTime)
    const percent = Math.ceil((store.state.audioCurrentTime / store.state.audioDuration) * 100)
    const study_time = store.state.study_time + 320
    store.dispatch('setStudyTime', study_time)
    store.dispatch('setAudioPercent', percent)
  })
  bgAudio.onStop(() => {
    store.dispatch('setPlayState', false)
  })
}
export function playAudio() {
  const {
    file,
    name,
    poster_image
  } = store.state.audioList[store.state.playIndex]
  console.log(file);
  bgAudio.src = file
  bgAudio.title = name
  bgAudio.coverImgUrl = poster_image
  // bgAudio.singer = teacher.name
  bgAudio.play()
}

function onAudioOnload() {
  const innerAudioContext = uni.getBackgroundAudioManager();
  innerAudioContext.onCanplay(() => {
    console.log('ready to play');
    this.audioCanplay = true
  })
  innerAudioContext.onPlay(() => {
    console.log('开始播放');
    console.log(innerAudioContext.duration);
    this.audioDuration = innerAudioContext.duration
    this.audioPlaying = true
    store.commit('SET_PLAY_STATE', true)
    uni.hideLoading()
  });
  innerAudioContext.onError((res) => {
    store.commit('SET_PLAY_STATE', false)
    console.log(res.errMsg);
    console.log(res.errCode);
  });

  innerAudioContext.onEnded(() => {
    console.log('结束播放');
    store.commit('SET_PLAY_STATE', false)
    this.postStudy(this.playIndex).then(() => {
      this.study_time = 0
    })
    this.playPercent = 100
    switch (this.playType[this.typeIndex].type) {
      case 'round':
        this.selectCourse(this.playIndex === this.courseList.length - 1 ? 0 : this.playIndex + 1)
        break;
      case 'random':
        this.selectCourse(Math.floor(Math.random() * this.courseList.length))
        break;
      case 'single':
        this.audioInstance.seek(0)
        break;
    }
  })

  innerAudioContext.onTimeUpdate(() => {
    this.audioCurrentTime = innerAudioContext.currentTime
    this.playPercent = Math.ceil((this.audioCurrentTime / this.audioDuration) * 100)
    this.study_time += 320
  })
  innerAudioContext.onStop(() => {
    store.commit('SET_PLAY_STATE', false)
    this.postStudy(this.playIndex).then(() => {
      this.study_time = 0
    })
  })
  this.audioInstance = innerAudioContext
}
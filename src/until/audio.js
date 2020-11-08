import Recorder from 'js-audio-recorder'
let recorder = new Recorder()

// 开始录音返回promise
export function startRecorder() {
  return recorder.start()
}

// 结束录音
export function stopRecorder() {
  recorder.stop() // 结束录音。
}

// 录音播放
export function playRecorder() {
  recorder.play() // 录音播放。
}

// 停止播放
export function stopPlayRecorder() {
  recorder.stopPlay() // 停止播放。
}

export function getWAVBlob() {
  // 获取 PCM 数据，在录音结束后使用。
  // 使用该方法会默认调用 stop() 方法。
  return recorder.getWAVBlob()
}

// 录音波纹显示
// 此接口获取的是录音时的。
export function recorderDataArray() {
  return recorder.getRecordAnalyseData()
}

// 播放时波纹
// 返回数据同 getRecordAnalyseData()，该方法获取的是播放时的。
export function PlaydataArray() {
  return recorder.getPlayAnalyseData()
}

// 浏览器获取录音权限
// 获取麦克风权限。返回：promise。
export function getPermission() {
  return Recorder.getPermission()
}
// 返回录音时间
export function getTime() {
  return recorder.duration
}

// 销毁实例
// 返回promise
export function destroy() {
  if (!recorder) {
    return
  }
  recorder.destroy().then(() => {
    recorder = null
  })
}

// Recorder.getPermission().then(() => {
//   console.log('给权限了')
// }, (error) => {
//   console.log(`${error.name} : ${error.message}`)
// }

// recorder.onprogress = function (params) {
//     console.log(params.data) // 当前获取到到音频数据
// }

// 销毁录音实例，置为null释放资源，fn为回调函数，
// recorder.destroy().then(function() {
//   recorder = null
// })

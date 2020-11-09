<template>
  <div class="autio">
    <div class="chart">
      <canvas id="canvas" />
      <span style="padding: 0 10%" />
      <!-- <canvas id="playChart" /> -->
      <!-- <div class="cancel" @touchstart="cancelRecorde">
        <van-icon name="cross" />
      </div> -->
    </div>
  </div>
</template>

<script>
import {
  startRecorder,
  stopRecorder,
  getWAVBlob,
  recorderDataArray,
  getPermission,
  stopPlayRecorder,
  destroy,
  getTime
} from '@/until/audio'
export default {
  props: {
    isAudio: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 波浪图-录音
      drawRecordId: null,
      oCanvas: null,
      ctx: null,
      // 波浪图-播放
      drawPlayId: null,
      pCanvas: null,
      pCtx: null,
      // 录音文件
      WAVBlob: null
    }
  },
  watch: {
    isAudio(val) {
      if (val) {
        this.startRecorder()
      } else {
        this.stopRecorder()
      }
    }
  },
  mounted() {
    this.startCanvas()
  },
  methods: {
    startCanvas() {
      // 录音波浪
      this.oCanvas = document.getElementById('canvas')
      this.ctx = this.oCanvas.getContext('2d')
      // 播放波浪
      // this.pCanvas = document.getElementById('playChart')
      // this.pCtx = this.pCanvas.getContext('2d')
    },
    // 开始录音
    startRecorder() {
      startRecorder().then(
        () => {
          this.drawRecord() // 开始绘制图片
        },
        (error) => {
          // 出错了
          console.log(error)
        }
      )
    },
    // 结束录音
    stopRecorder() {
      stopRecorder()
      const time = this.getInfo()
      console.log(time)
      this.drawRecordId && cancelAnimationFrame(this.drawRecordId)
      this.drawRecordId = null
      if (time >= 0.5) {
        this.getRecorder()
      } else {
        this.WAVBlob = null
      }
      this.$emit('recorder', { audio: this.WAVBlob, time })
    },
    // 取消录音
    cancelRecorde() {
      stopRecorder()
    },
    // 录音播放
    // playRecorder() {
    //   playRecorder()
    //   this.drawPlay() // 绘制波浪图
    // },
    // 停止录音播放
    stopPlayRecorder() {
      stopPlayRecorder()
    },
    // 销毁录音
    destroyRecorder() {
      destroy()
    },
    // 获取录音文件
    getRecorder() {
      this.WAVBlob = getWAVBlob() // 获取 PCM 数据
    },
    // 获取麦克风权限
    getPermission() {
      getPermission().then(
        () => {
          this.$Message.success('获取权限成功')
        },
        (error) => {
          console.log(`${error.name} : ${error.message}`)
        }
      )
    },
    // 获取录音信息
    getInfo() {
      return getTime()// 录音总时长
      // const fileSize = recorder.fileSize// 录音总大小
    },
    // 绘制波浪图-录音
    drawRecord() {
      // 用requestAnimationFrame稳定60fps绘制
      this.drawRecordId = requestAnimationFrame(this.drawRecord)

      // 实时获取音频大小数据
      const dataArray = recorderDataArray()
      const bufferLength = dataArray.length

      // 填充背景色
      this.ctx.fillStyle = 'rgb(30, 191, 118)'
      this.ctx.fillRect(0, 0, this.oCanvas.width, this.oCanvas.height)

      // 设定波形绘制颜色
      this.ctx.lineWidth = 2
      this.ctx.strokeStyle = 'rgb(0, 0, 0)'

      this.ctx.beginPath()

      var sliceWidth = (this.oCanvas.width * 1.0) / bufferLength // 一个点占多少位置，共有bufferLength个点要绘制
      var x = 0 // 绘制点的x轴位置

      for (var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0
        var y = (v * this.oCanvas.height) / 2

        if (i === 0) {
          // 第一个点
          this.ctx.moveTo(x, y)
        } else {
          // 剩余的点
          this.ctx.lineTo(x, y)
        }
        // 依次平移，绘制所有点
        x += sliceWidth
      }

      this.ctx.lineTo(this.oCanvas.width, this.oCanvas.height / 2)
      this.ctx.stroke()
    }
    // 绘制波浪图-播放
    // drawPlay() {
    //   // 用requestAnimationFrame稳定60fps绘制
    //   this.drawPlayId = requestAnimationFrame(this.drawPlay)

    //   // 实时获取音频大小数据
    //   const dataArray = PlaydataArray()
    //   const bufferLength = dataArray.length

    //   // 填充背景色
    //   this.pCtx.fillStyle = 'rgb(200, 200, 200)'
    //   this.pCtx.fillRect(0, 0, this.pCanvas.width, this.pCanvas.height)

    //   // 设定波形绘制颜色
    //   this.pCtx.lineWidth = 2
    //   this.pCtx.strokeStyle = 'rgb(0, 0, 0)'

    //   this.pCtx.beginPath()

    //   var sliceWidth = (this.pCanvas.width * 1.0) / bufferLength // 一个点占多少位置，共有bufferLength个点要绘制
    //   var x = 0 // 绘制点的x轴位置

    //   for (var i = 0; i < bufferLength; i++) {
    //     var v = dataArray[i] / 128.0
    //     var y = (v * this.pCanvas.height) / 2

    //     if (i === 0) {
    //       // 第一个点
    //       this.pCtx.moveTo(x, y)
    //     } else {
    //       // 剩余的点
    //       this.pCtx.lineTo(x, y)
    //     }
    //     // 依次平移，绘制所有点
    //     x += sliceWidth
    //   }

    //   this.pCtx.lineTo(this.pCanvas.width, this.pCanvas.height / 2)
    //   this.pCtx.stroke()
    // }
  }
}
</script>

<style lang='scss' scoped>
.autio {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(240, 240, 240, 0.5);
  z-index: 100;
}
.chart {
  position: absolute;
  width: 5.333333rem;
  height: 2.133333rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 0.266667rem;
  #canvas {
    width: 100%;
    height: 100%;
    border-radius: 0.266667rem;
  }
}
  .chart::after {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%,80%);
    border: 20px solid;
    border-color:  rgb(30, 191, 118) transparent transparent;
  }
  .cancel {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-top: 3rem;
    .van-icon {
      font-size: 1.5rem;
      background-color: rgb(30, 191, 118);
      border-radius: 50%;
      padding: 0.133333rem;
    }
  }
</style>

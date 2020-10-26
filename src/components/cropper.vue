<template>
  <div v-if="bol" class="crop">
    <div class="header">
      <div class="back">
        <span class="link el-icon-arrow-left" @click="closeBox" />
      </div>
      <!-- 最好上传后禁止再次点击 -->
      <div class="cropData" @click="startCrop">完成</div>
    </div>
    <vue-cropper
      ref="cropper"
      :img="option.img"
      :output-size="option.size"
      :output-type="option.outputType"
      :info="option.info"
      :auto-crop="option.autoCrop"
      :fixed="option.fixed"
      :center-box="option.centerBox"
      :can-move="option.canMove"
    />
  </div>
</template>

<script>
import { uploadImg } from '@/api/user'
import dataURLtoFile from '@/until/base64&img'
export default {
  props: {
    imgurl: {
      type: String,
      default: ''
    },
    isCrop: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      option: {
        img: '',
        outputType: 'png', // 裁剪生成图片格式
        fixed: true, // 是否开启截图框宽高固定比例
        autoCrop: true, // 是否默认生成截图框
        centerBox: true, // 截图框是否被限制在图片里面
        canMove: false // 上传图片是否可以移动
      },
      url: '',
      bol: this.isCrop
    }
  },
  watch: {
    imgurl: {
      immediate: true, // 很重要！！！
      handler(val) {
        this.option.img = !val ? '' : val
      }
    },
    isCrop(value) {
      console.log(value)
      this.bol = true
    }
  },
  created() {
    console.log(this.isCrop)
  },
  methods: {
    // 截图并上传图片
    startCrop() {
      this.$refs.cropper.getCropData((data) => {
        this.url = data
        const imgFile = this.dataURLtoFile(this.url)
        const formData = new FormData()
        formData.append('upload', imgFile)
        uploadImg(formData).then((res) => {
          const { imgUrl } = res
          this.$emit('upload', imgUrl)
          this.bol = false
        })
      })
    },
    // 把base64位图片转换为图片文件
    dataURLtoFile(dataurl) {
      return dataURLtoFile(dataurl)
    },
    // 关闭截图容器
    closeBox() {
      this.bol = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/header.scss';
.crop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 2000;
    background-color: #ffffff;
}
  .link {
    font-size: 24px;
    font-weight: 600;
  }
</style>

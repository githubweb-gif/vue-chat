<template>
  <div :style="{borderColor:borderColor}" class="textarea">
    <textarea
      ref="textarea"
      class="textarea__inner"
      v-bind="$attrs"
      :style="textareaStyle"
      @input="handleInput"
      @focus="handleFocus"
      @blur="borderColor='#c0c4cc'"
    />
  </div>
</template>

<script>
import calcTextareaHeight from './calcTextareaHeight'
import merge from './merge'
export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    }
  },
  data() {
    return {
      textareaCalcStyle: '',
      borderColor: '#c0c4cc'
    }
  },
  computed: {
    textareaStyle() {
      return merge({}, this.textareaCalcStyle)
    },
    nativeInputValue() {
      return this.value === null || this.value === undefined ? '' : String(this.value)
    }
  },
  watch: {
    value() {
      this.$nextTick(this.resizeTextarea)
    },
    nativeInputValue() {
      this.setNativeInputValue()
    }
  },
  mounted() {
    this.setNativeInputValue()
    this.resizeTextarea()
  },
  methods: {
    handleInput(event) {
      if (event.target.value === this.nativeInputValue) return
      this.$emit('input', event.target.value)
      this.$nextTick(this.setNativeInputValue)
    },
    resizeTextarea() {
      const { autosize } = this
      if (!autosize) {
        this.textareaCalcStyle = {
          minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
        }
        return
      }
      const minRows = autosize.minRows
      const maxRows = autosize.maxRows

      this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows)
    },
    handleFocus(event) {
      this.$emit('focus', event)
      this.borderColor = '#3e92c7'
    },
    setNativeInputValue() {
      const input = this.getInput()
      if (!input) return
      if (input.value === this.nativeInputValue) return
      input.value = this.nativeInputValue
    },
    getInput() {
      return this.$refs.textarea
    }
  }
}
</script>

<style lang="scss" scoped>
textarea {
    height:0.88rem;
    width: 100%;
    padding: 0.16rem 0.266667rem;
    line-height: 1.5;
    resize: none !important;
    box-sizing: border-box;
    font-size: inherit;
    border-radius: 0.106667rem;
    border: 0;
    display: block;
}
.textarea {
    border-radius: 0.106667rem;
    border: 0.026667rem solid #c0c4cc;
    color: #606266;
}
</style>

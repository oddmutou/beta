<template>
  <img :src="src" :class="{
    'rounded-circle': !isSquare
  }"
  :width="size" :height="size" v-bind="$attrs" />
</template>

<script>
function sizeValidator(numLike) {
  return [0, 24, 32, 64, 96].includes(parseInt(numLike))
}

export default {
  props: {
    avatar: {
      type: Object,
      validator(obj) {
        return 'link' in obj
      },
      required: true
    },
    size: {
      type: [String, Number],
      default: 24,
      validator: sizeValidator
    },
    maxSize: {
      type: [String, Number],
      default: 0,
      validator: sizeValidator
    }
  },
  data() {
    return {
      isSquare: false
    }
  },
  mounted() {
    this.isSquare = localStorage.getItem('square_avatars') === 'true'
  },
  computed: {
    src() {
      let src = this.avatar.link
      if (this.maxSize > 0) src += `?w=${this.maxSize}`
      return src
    }
  }
}
</script>

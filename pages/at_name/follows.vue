<template>
  <div>
    <h3 class="mb-4">
      <nuxt-link to=".">
        @{{name}}
      </nuxt-link>
      's following
    </h3>
    <list :data="data" type="User" />
  </div>
</template>

<script>
import List from '~/components/List'
import api from '~/plugins/api'

export default {
  async asyncData(ctx) {
    const { params } = ctx
    const { name } = params
    const data = await api(ctx).fetch()
    return {
      data,
      name
    }
  },
  components: {
    List
  },
  head() {
    return {
      title: `@${this.name}'s following`
    }
  }
}
</script>
<template>
  <div>
    <h1 class="h3 mb-4">
      <nuxt-link to="/messages">
        <i class="fa fa-chevron-left"></i>
        {{$metaInfo.title}}
      </nuxt-link>
    </h1>
    <div class="row">
      <div class="col-md-4 order-md-2">
        <div class="row flex-">
          <div class="col-sm col-md-12">
            <h2 class="h3">Channel info</h2>
            <div class="form-group">
              <custom-checkbox
                v-model="channel.you_subscribed"
                @change="cancelMute"
                :resource="`/channels/${channel.id}/subscribe`">
                Subscribed
              </custom-checkbox>
              <custom-checkbox
                v-model="channel.you_muted"
                @change="cancelSubscribe"
                :resource="`/channels/${channel.id}/mute`">
                Muted
              </custom-checkbox>
            </div>
          </div>
          <div class="col-sm col-md-12">
            <h2 class="h3">Subscribers</h2>
            <ul class="list-unstyled">
              <li
                v-for="user in subscribers"
                :key="user.id"
                class="mb-2"
              >
                <nuxt-link
                  class="d-flex flex-row align-items-center flex-nowrap"
                  :to="`/@${user.username}`"
                >
                  <avatar
                    :avatar="user.content.avatar_image"
                    size="24"
                    max-size="24"
                    class="mr-2"
                  />
                  <div class="d-flex align-items-baseline flex-wrap">
                    @{{user.username}}
                    <small class="ml-1 text-muted">
                      {{user.name}}
                    </small>
                  </div>
                </nuxt-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-8 order-md-1">
        <message-compose v-model="message" @submit="refresh" />
        <message-list :messages.sync="messages" :meta.sync="meta" />
      </div>
    </div>
  </div>
</template>

<script>
import api from '~/plugins/api'
import MessageList from '~/components/MessageList'
import MessageCompose from '~/components/MessageCompose'
import CustomCheckbox from '~/components/CustomCheckbox'
import Avatar from '~/components/Avatar'

export default {
  validate({ params: { channel } }) {
    return /^\d+$/.test(channel)
  },
  data() {
    return {
      message: ''
    }
  },
  async asyncData(ctx) {
    const messagesPromise = api(ctx).fetch()
    const channelPromise = api(ctx).get(`/channels/${ctx.params.channel}`)
    const subscribersPromise = api(ctx).get(
      `/channels/${ctx.params.channel}/subscribers`
    )
    try {
      const [
        { data: messages, meta },
        { data: channel },
        { data: subscribers }
      ] = await Promise.all([
        messagesPromise,
        channelPromise,
        subscribersPromise
      ])
      if (meta.code >= 400) {
        return ctx.error({
          statusCode: meta.code,
          message: meta.error_message,
          home: '/messages'
        })
      }
      return {
        messages,
        channel,
        subscribers,
        meta
      }
    } catch (e) {
      console.error(e)
    }
  },
  methods: {
    cancelSubscribe(bool) {
      if (bool) this.channel.you_subscribed = false
    },
    cancelMute(bool) {
      if (bool) this.channel.you_muted = false
    },
    async refresh() {
      this.message = ''
      const { data: messages } = await api({ route: this.$route }).fetch({
        since_id: this.messages[0].id
      })
      this.messages = messages.concat(this.messages)
    }
  },
  head() {
    return {
      title: this.channel.owner.username
    }
  },
  components: {
    MessageList,
    MessageCompose,
    CustomCheckbox,
    Avatar
  }
}
</script>

import Vue from 'vue'
import Vuex from 'vuex'
import NuxtLink from 'nuxt/lib/app/components/nuxt-link'
import VueRouter from 'vue-router'
import createStore from '~/store'
import '../fixtures/axios-mock'

Vue.config.productionTip = false
Vue.config.devtools = false
Vue.config.silent = true
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.component('nuxt-link', NuxtLink)

const router = new VueRouter()
export { createStore, router }
export * from 'avoriaz'

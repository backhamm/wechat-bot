import Vue from 'vue'
import Vuex from 'vuex'
import { createPersistedState, createSharedMutations } from 'vuex-electron'

Vue.use(Vuex)

const state = {
  completedNum: 0
}

const mutations = {
  SET_STATE(state, [key, val]) {
    state[key] = val
  }
}

const actions = {
  setCompletedNum({commit}, val) {
    commit('SET_STATE', ['completedNum', val])
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  plugins: [
    createPersistedState(),
    createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
})

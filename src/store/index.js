import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      user: {},
      loading: false
    };
  },
  getters: {},
  mutations: {
    loadingOpen(state) {
      state.loading = true;
    },
    loadingClose(state) {
      state.loading = false;
    },
    userSet(state, { user }) {
      state.user = user;
    }
  },
  actions: {}
});

export default store;

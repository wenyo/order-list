import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      auth: false,
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
    loginStatusSet(state, { user, auth }) {
      state.user = user;
      state.auth = auth;
    }
  },
  actions: {}
});

export default store;

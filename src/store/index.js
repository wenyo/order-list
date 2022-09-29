import { createStore } from "vuex";
import { USER_TYPE } from "../util/enum";

const store = createStore({
  state() {
    return {
      auth: false,
      user: {},
      loading: false,
      userType: USER_TYPE.NONE
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
    },
    userTypeSet(state, { userType }) {
      state.userType = userType;
    }
  },
  actions: {}
});

export default store;

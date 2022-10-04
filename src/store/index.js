import { createStore } from "vuex";
import { NO_ID, USER_TYPE } from "../util/enum";
import {
  loginFetch,
  authUser,
  isLoggedIn,
  userTypeGet,
  logoutFetch,
  itemListGetFetch,
  itemUpdateFetch,
  itemSetFetch,
  itemUpdateStockFetch,
  orderSetFetch
} from "../api";

const store = createStore({
  state() {
    return {
      loginFailed: false,
      auth: false,
      user: {},
      loading: false,
      userType: USER_TYPE.NONE
    };
  },
  getters: {},
  mutations: {
    loginFailedSet(state, { loginAuth }) {
      state.loginFailed = loginAuth;
    },
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
  actions: {
    // reset user status
    userStatusReset({ commit }) {
      commit("userTypeSet", { userType: USER_TYPE.NONE });
      commit("loginStatusSet", {
        user: {},
        auth: false
      });
    },
    // user login
    async login({ commit }, { account, password }) {
      // loading open
      commit("loadingOpen");

      // login
      await loginFetch({ account, password });
      const loginResult = authUser();
      commit("loginFailedSet", { loginAuth: !loginResult.auth });
      if (!loginResult.auth) {
        console.log("login");
        commit("loadingClose");
        return;
      }

      commit("loginStatusSet", {
        user: loginResult.currentUser,
        auth: loginResult.auth
      });
    },
    async logout({ dispatch, commit }) {
      commit("loadingOpen");
      await logoutFetch();
      dispatch("userStatusReset");
      commit("loadingClose");
    },
    // user type get
    async userTypeUpdate({ commit }) {
      return await userTypeGet().then((userType) => {
        commit("userTypeSet", { userType });
      });
    },
    // user login status check
    async isLoggedInCheck({ commit }) {
      await isLoggedIn((user) => {
        commit("loginStatusSet", {
          user,
          auth: !!user
        });
      });
    },
    // item list get
    async itemListGet({ commit }) {
      return itemListGetFetch().then((result) => {
        let itemList = {};
        for (const item of result.docs) {
          itemList[item.id] = item.data();
        }

        return itemList;
      });
    },
    async itemInfoUpdate({ commit }, { id, itemUpdateData }) {
      // loading open

      // item update or add
      if (id === NO_ID) {
        await itemSetFetch({ ...itemUpdateData, display: true });
      } else {
        await itemUpdateFetch(id, itemUpdateData);
      }

      // loading close
    },
    async itemDisplayToggle({ dispatch }, { id, display }) {
      const itemUpdateData = { display };
      await dispatch("itemInfoUpdate", { id, itemUpdateData });
    },
    async itemUpdateStock({ commit }, { id, stockMinusCount }) {
      await itemUpdateStockFetch(id, stockMinusCount);
    },
    // order add
    async orderInfoSet({ dispatch, commit }, { orderNewData }) {
      // new order
      await orderSetFetch(orderNewData);

      // calculate stock
      await dispatch("itemUpdateStock", {
        id: orderNewData.item_id,
        stockMinusCount: orderNewData.count
      });
    }
  }
});

export default store;

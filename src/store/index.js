import { createStore } from "vuex";
import EXAMPLE from "../assets/data/example.json";
import { NO_IDX } from "../util/enum";

const store = createStore({
  state() {
    return {
      user: {},
      orderList: EXAMPLE.list
    };
  },
  getters: {
    orderIdxGet: (state) => (id) => {
      const idx = state.orderList.findIndex((order) => order.id === id);
      return idx;
    },
    orderExistCheck: (state, getters) => (id) => {
      const idx = getters.orderIdxGet(id);
      return idx !== NO_IDX && state.orderList[idx].display;
    },
    orderGetById: (state, getters) => (id) => {
      const idx = getters.orderIdxGet(id);
      return state.orderList[idx];
    }
  },
  mutations: {
    userSet(state, { user }) {
      state.user = user;
    },
    orderEdit(state, { new_order }) {
      const { orderIdxGet } = store.getters;
      const idx = orderIdxGet(new_order.id);
      state.orderList[idx] = new_order;
    },
    orderDelete(state, { id }) {
      const { orderIdxGet } = store.getters;
      const idx = orderIdxGet(id);
      state.orderList[idx].display = false;
    },
    orderAdd(state, { new_order }) {
      const len = state.orderList.length;
      const id = (len + 1).toString().padStart(3, 0);
      state.orderList.push({
        ...new_order,
        id
      });
    }
  },
  actions: {}
});

export default store;

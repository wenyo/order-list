import { createStore } from "vuex";
import EXAMPLE from "../assets/data/example.json";

const store = createStore({
  state() {
    return {
      orderList: EXAMPLE.list
    };
  },
  getters: {
    orderIdxGet: (state) => (id) => {
      const idx = state.orderList.findIndex((order) => order.id === id);
      return idx;
    },
    orderExistCheck: (state, getters) => (id) => {
      const noId = -1;
      const idx = getters.orderIdxGet(id);
      return idx !== noId && state.orderList[idx].display;
    },
    orderGetById: (state, getters) => (id) => {
      const idx = getters.orderIdxGet(id);
      return state.orderList[idx];
    }
  },
  mutations: {
    orderSave(state, { new_order }) {
      const { orderIdxGet } = store.getters;
      const idx = orderIdxGet(new_order.id);
      state.orderList[idx] = new_order;
    },
    orderDelete(state, { id }) {
      const { orderIdxGet } = store.getters;
      const idx = orderIdxGet(id);
      state.orderList[idx].display = false;
    }
  },
  actions: {}
});

export default store;

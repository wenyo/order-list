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
    orderExistCheck: (_state, getters) => (id) => {
      const noId = -1;
      const idx = getters.orderIdxGet(id);
      console.log(idx);
      return idx !== noId;
    },
    orderGetById: (state, getters) => (id) => {
      const idx = getters.orderIdxGet(id);
      return state.orderList[idx];
    }
  },
  mutations: {},
  actions: {}
});

export default store;

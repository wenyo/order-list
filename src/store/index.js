import { createStore } from "vuex";
import EXAMPLE from "../assets/data/example.json";

const store = createStore({
  state() {
    return {
      orderList: EXAMPLE.list
    };
  },
  getters() {},
  mutations: {},
  actions: {}
});

export default store;

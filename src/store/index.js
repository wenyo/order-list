import { createStore } from "vuex";
import EXAMPLE from "../assets/data/example.json";

const store = createStore({
  state() {
    return {
      orderList: EXAMPLE.list
    };
  },
  getters: {
    orderGetById: (state) => (id) => {
      return state.orderList.filter(order => order.id===id)[0]
    }
  },
  mutations: {},
  actions: {}
});

export default store;

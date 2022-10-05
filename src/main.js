import { createApp } from 'vue';
import { initializeApp } from 'firebase/app';
import './assets/css/reset.css';
import './assets/icon/style.css';
import './assets/css/style.scss';
import App from './App.vue';
import store from './store';
import router from './router';

// config
const firebaseConfig = {
  apiKey: 'AIzaSyDfs32s0XfaWdkHiDtRMaaGu2fk2dsJuz4',
  authDomain: 'order-list-ed304.firebaseapp.com',
  projectId: 'order-list-ed304',
  storageBucket: 'order-list-ed304.appspot.com',
  messagingSenderId: '674244675925',
  appId: '1:674244675925:web:19078dcd179dfdda1c87dc',
};

initializeApp(firebaseConfig);

createApp(App).use(store).use(router).mount('#app');

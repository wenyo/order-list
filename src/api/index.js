import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  browserSessionPersistence,
  setPersistence
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc
} from "firebase/firestore";

// config
const firebaseConfig = {
  apiKey: "AIzaSyDfs32s0XfaWdkHiDtRMaaGu2fk2dsJuz4",
  authDomain: "order-list-ed304.firebaseapp.com",
  projectId: "order-list-ed304",
  storageBucket: "order-list-ed304.appspot.com",
  messagingSenderId: "674244675925",
  appId: "1:674244675925:web:19078dcd179dfdda1c87dc"
};

const PATH = { USER: "/user" };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// login
export async function loginFetch({ account, password }) {
  await setPersistence(auth, browserSessionPersistence)
    .then(() => {
      signInWithEmailAndPassword(auth, account, password);
    })
    .catch((error) => console.error(error));
  return authUser();
}

export function authUser() {
  const currentUser = auth.currentUser;
  return {
    auth: !!currentUser,
    currentUser
  };
}

// item
export async function itemListGetFetch() {
  return await getDocs(collection(db, "items")).then((result) => {
    return result.docs.map((item) => item.data());
  });
}

export async function itemSetFetch() {
  return await addDoc(collection(db, "items"), {
    id: "i003",
    name: "green tea",
    price: 70,
    stock: 90,
    img: "",
    update_time: new Date().getTime()
  }).then((result) => {
    console.log(result);
  });
}

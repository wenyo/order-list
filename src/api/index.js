import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  browserSessionPersistence,
  setPersistence,
  onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc
} from "firebase/firestore";

const PATH = { USER: "user" };

// login
export async function loginFetch({ account, password }) {
  const auth = getAuth();

  return await setPersistence(auth, browserSessionPersistence).then(() =>
    signInWithEmailAndPassword(auth, account, password)
      .then(() => authUser())
      .catch((error) => console.error(error))
  );
}

export function authUser() {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  return {
    auth: !!currentUser,
    currentUser
  };
}

export async function isLoggedIn(func) {
  const auth = getAuth();
  let isLogin = false;
  await onAuthStateChanged(auth, (user) => func(user));
}

export async function logoutFetch() {
  const auth = getAuth();
  await signOut(auth)
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// item
export async function itemListGetFetch() {
  const db = getFirestore();
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

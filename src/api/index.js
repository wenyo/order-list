import { async } from "@firebase/util";
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
  setDoc,
  doc,
  query,
  orderBy,
  limit,
  where
} from "firebase/firestore";

const PATH = { USER: "user", ITEMS: "items", ORDER: "order-list" };

// login
export async function loginFetch({ account, password }) {
  const auth = getAuth();

  return await setPersistence(auth, browserSessionPersistence).then(() =>
    signInWithEmailAndPassword(auth, account, password)
      .then(() => {})
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
  const itemsRef = collection(db, PATH.ITEMS);

  return await getDocs(query(itemsRef, orderBy("id"))).then((result) => {
    let itemList = {};
    for (const item of result.docs) {
      itemList[item.id] = item.data();
    }
    return itemList;
  });
}

export async function itemSetFetch() {
  const db = getFirestore();
  const data = {
    id: "005",
    name: "latte",
    price: 120,
    stock: 90,
    img: "",
    update_time: new Date().getTime()
  };
  return await setDoc(doc(db, PATH.ITEMS, data.id), data).then((result) => {
    console.log(result);
  });
}

// order
export async function orderListGetByUidFetch(uid) {
  const db = getFirestore();
  const ordersRef = collection(db, PATH.ORDER);

  return await getDocs(
    query(ordersRef, where("user_uid", "==", uid), orderBy("id"))
  ).then((result) => {
    return result.docs.map((item) => item.data());
  });
}

export async function orderSetFetch(order_data) {
  const db = getFirestore();
  const data = {
    id: "005",
    name: "latte",
    price: 120,
    stock: 90,
    img: "",
    update_time: new Date().getTime()
  };
  return await setDoc(doc(db, PATH.ITEMS, data.id), data).then((result) => {
    console.log(result);
  });
}

export async function orderListGetFetch() {
  const db = getFirestore();
  const ordersRef = collection(db, PATH.ORDER);

  return await getDocs(query(ordersRef)).then((result) => {
    return result.docs.map((item) => item.data());
  });
}

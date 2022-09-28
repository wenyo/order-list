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
  updateDoc,
  setDoc,
  doc,
  query,
  orderBy,
  limit,
  where
} from "firebase/firestore";
import { nextIdGet } from "../util/function";

const PATH = { USER: "user", ITEMS: "items", ORDER: "order-list" };

// login
export function loginFetch({ account, password }) {
  const auth = getAuth();

  return setPersistence(auth, browserSessionPersistence).then(() =>
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

export function logoutFetch() {
  const auth = getAuth();
  signOut(auth)
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

// item
export async function itemListGetFetch() {
  const db = getFirestore();
  const itemsRef = collection(db, PATH.ITEMS);

  return getDocs(query(itemsRef, orderBy("id"))).then((result) => {
    let itemList = {};
    for (const item of result.docs) {
      itemList[item.id] = item.data();
    }
    return itemList;
  });
}

export async function itemLastIdGetFetch() {
  const db = getFirestore();
  const itemsRef = collection(db, PATH.ITEMS);

  return getDocs(query(itemsRef, orderBy("id", "desc"), limit(1)))
    .then((result) => {
      return result.docs[0].data().id;
    })
    .catch((error) => console.error(error));
}

export function itemByIdGetFetch(id) {
  const db = getFirestore();
  const itemsRef = collection(db, PATH.ITEMS);

  return getDocs(query(itemsRef, where("id", "==", id))).then((result) =>
    result.docs[0].data()
  );
}

export async function itemSetFetch(data) {
  const db = getFirestore();
  let lastId = "";

  // get new item id
  await itemLastIdGetFetch().then((rs) => (lastId = rs));
  const id = nextIdGet(lastId);

  return setDoc(doc(db, PATH.ITEMS, id), { ...data, id }).catch((error) =>
    console.error(error)
  );
}

export async function itemUpdateFetch(id, data) {
  const db = getFirestore();
  const itemsRef = doc(db, PATH.ITEMS, id);
  return updateDoc(itemsRef, data).catch((error) => console.error(error));
}

export async function itemUpdateStock(item_id, stock_minus_count) {
  // check last stock
  let oldStock = 0;
  await itemByIdGetFetch(item_id).then((order) => (oldStock = order.stock));

  // get new stock
  const newStock = oldStock - stock_minus_count;

  // update
  return itemUpdateFetch(item_id, { stock: newStock });
}

// order
export async function orderListGetByUidFetch(uid) {
  const db = getFirestore();
  const ordersRef = collection(db, PATH.ORDER);

  return getDocs(
    query(
      ordersRef,
      where("user_uid", "==", uid),
      where("display", "==", true),
      orderBy("id")
    )
  ).then((result) => {
    let itemList = {};
    for (const item of result.docs) {
      itemList[item.id] = item.data();
    }
    return itemList;
  });
}

export async function orderListGetFetch() {
  const db = getFirestore();
  const ordersRef = collection(db, PATH.ORDER);

  return getDocs(query(ordersRef)).then((result) => {
    let itemList = {};
    for (const item of result.docs) {
      itemList[item.id] = item.data();
    }
    return itemList;
  });
}

export async function orderLastIdGetFetch() {
  const db = getFirestore();
  const ordersRef = collection(db, PATH.ORDER);

  return getDocs(query(ordersRef, orderBy("id", "desc"), limit(1)))
    .then((result) => {
      return result.docs[0].data().id;
    })
    .catch((error) => console.error(error));
}

export async function orderSetFetch(order_data) {
  const db = getFirestore();
  let lastId = "";

  // get new order id
  await orderLastIdGetFetch().then((rs) => (lastId = rs));
  const id = nextIdGet(lastId);

  return setDoc(doc(db, PATH.ORDER, id), { ...order_data, id }).catch((error) =>
    console.error(error)
  );
}

export async function orderUpdateFetch(id, data) {
  const db = getFirestore();
  const ordersRef = doc(db, PATH.ORDER, id);
  return updateDoc(ordersRef, data).catch((error) => console.error(error));
}

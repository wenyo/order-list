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

const PATH = { USERS: "users", ITEMS: "items", ORDER: "order-list" };

// login
export async function loginFetch({ account, password }) {
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
  return onAuthStateChanged(auth, (user) => func(user));
}

export async function logoutFetch() {
  const auth = getAuth();
  return signOut(auth)
    .then(() => console.log("logout success"))
    .catch(() => console.error("logout fail"));
}

export async function userTypeGet() {
  const db = getFirestore();
  const usersRef = collection(db, PATH.USERS);
  const currentUser = authUser().currentUser;
  return getDocs(query(usersRef, where("user_uid", "==", currentUser.uid)))
    .then((result) => result.docs[0].data().user_type)
    .catch((e) => console.error(e));
}

// item
export async function itemListGetFetch() {
  const db = getFirestore();
  const itemsRef = collection(db, PATH.ITEMS);

  return getDocs(
    query(
      itemsRef,
      orderBy("display", "desc"),
      orderBy("stock", "desc"),
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

export async function itemLastIdGetFetch() {
  const db = getFirestore();
  const itemsRef = collection(db, PATH.ITEMS);

  return getDocs(query(itemsRef, orderBy("id", "desc"), limit(1)))
    .then((result) => {
      return result.docs[0].data().id;
    })
    .catch((error) => console.error(error));
}

export async function itemByIdGetFetch(id) {
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

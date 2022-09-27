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
export function itemListGetFetch() {
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

export function itemSetFetch() {
  const db = getFirestore();
  const data = {
    id: "005",
    name: "latte",
    price: 120,
    stock: 90,
    img: "",
    update_time: new Date().getTime()
  };
  return setDoc(doc(db, PATH.ITEMS, data.id), data).catch((error) =>
    console.error(error)
  );
}

export function itemUpdateFetch(id, data) {
  const db = getFirestore();
  const itemRef = doc(db, "items", id);
  return updateDoc(itemRef, data);
}

// order
export function orderListGetByUidFetch(uid) {
  const db = getFirestore();
  const ordersRef = collection(db, PATH.ORDER);

  return getDocs(
    query(ordersRef, where("user_uid", "==", uid), orderBy("id"))
  ).then((result) => {
    return result.docs.map((item) => item.data());
  });
}

export async function orderListGetFetch() {
  const db = getFirestore();
  const ordersRef = collection(db, PATH.ORDER);

  return await getDocs(query(ordersRef)).then((result) => {
    return result.docs.map((item) => item.data());
  });
}

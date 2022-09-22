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
  return await setPersistence(auth, browserSessionPersistence).then(() =>
    signInWithEmailAndPassword(auth, account, password)
      .then(() => authUser())
      .catch((error) => console.error(error))
  );
}

export function authUser() {
  const currentUser = auth.currentUser;
  return {
    auth: !!currentUser,
    currentUser
  };
}

export async function IsLoggedIn() {
  const auth = getAuth(app);

  let result = {};
  try {
    await new Promise((resolve, reject) =>
      onAuthStateChanged(
        auth,
        (user) => (result = authUser(user)),
        // Prevent console errors
        (error) => reject(error)
      )
    );
    return result;
  } catch (error) {
    return false;
  }
}

export async function logout() {
  await signOut(auth)
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
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

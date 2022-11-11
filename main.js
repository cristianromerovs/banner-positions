import Sortable from 'sortablejs';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get } from "firebase/database";
import './style.css'

const listaElementos = document.getElementById("lista");

const firebaseConfig = {
  apiKey: "AIzaSyAEbiyzcVLGsu4PVUbycu2p86nmidzx-Ps",
  authDomain: "posiciones-banner.firebaseapp.com",
  databaseURL: "https://posiciones-banner-default-rtdb.firebaseio.com",
  projectId: "posiciones-banner",
  storageBucket: "posiciones-banner.appspot.com",
  messagingSenderId: "267979042119",
  appId: "1:267979042119:web:ec7e1ac0f026211f2bf062"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

const dbRef = ref(getDatabase());
get(child(dbRef, `posiciones-guardadas/`)).then((snapshot) => {
  if (snapshot.exists()) {
    // console.log(Object.keys(snapshot.val()).length);
    //Obtiene el ultimo item guardado
    console.log(snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]]);
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

function writePositions(fechaActual, arrayBanner) {
  const reference = ref(db, 'posiciones-guardadas/' + fechaActual);

  set(reference, {
    // cantItems: cantItems,
    arrayBanner: arrayBanner
  });
}

let bannerNumber = document.querySelector(".current-banner span");
let getAllItems = document.querySelectorAll(".banner-tabs__item")

Sortable.create(lista, {
  animation: 200,
  direction: "horizontal",
  group: "lista-elementos",
  onStart: (e) => {
    bannerNumber.textContent = ((e.oldDraggableIndex)+1);
    console.log(`moviendo elemento ${((e.oldDraggableIndex)+1)}`);
  },
  onChoose: (e) => {
    getAllItems.forEach(item => {
      item.classList.remove("active");
    });
    e.item.classList.add("active");
    bannerNumber.textContent = ((e.oldDraggableIndex)+1);
  },
  onEnd: (e) => {
    bannerNumber.textContent = ((e.newDraggableIndex)+1);
    console.log(`dejado en ${((e.newDraggableIndex)+1)}`);
  },
  store: {
    set: (sortable) => {
      const orden = sortable.toArray();
      // let getItemsInDom = document.querySelectorAll(".banner-tabs__item").length;
      // Insertar en db
      writePositions(getActualDate(), orden);
    }
  }
});

const getActualDate = () => {
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  let now = today.toLocaleTimeString();
  return `${day}-${month}-${year}`;
}


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
    //Obtiene el ultimo item guardado
    let lastSavedItem = snapshot.val()[Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]];
    console.log(lastSavedItem.arrayBanner.length);
    for (let i = 0; i < lastSavedItem.arrayBanner.length; i++) {
      listaElementos.innerHTML += `<li class="banner-tabs__item" data-id="${lastSavedItem.arrayBanner[i]}" data-title="${lastSavedItem.content[i]}">${lastSavedItem.content[i]}</li>`
    }
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

function writePositions(fechaActual, arrayBanner, content) {
  const reference = ref(db, 'posiciones-guardadas/' + fechaActual);
  set(reference, {
    content: content,
    arrayBanner: arrayBanner
  });
}

let bannerNumber = document.querySelector(".current-banner span");
let deleteArea = document.querySelector(".delete-area");

let sortableList = Sortable.create(lista, {
  animation: 200,
  direction: "horizontal",
  group: "lista-elementos",
  removeOnSpill: true,
  revertOnSpill: false,
  onSpill: function(/**Event*/evt) {
		console.log(evt.item);
	},
  onStart: (e) => {
    bannerNumber.textContent = ((e.oldDraggableIndex)+1);
  },
  onChoose: (e) => {
    let getAllItems = document.querySelectorAll(".banner-tabs__item");
    getAllItems.forEach(item => {
      item.classList.remove("active");
    });
    e.item.classList.add("active");
    bannerNumber.textContent = ((e.oldDraggableIndex)+1);
    deleteArea.classList.remove("d-none");
    deleteArea.classList.add("d-flex");
  },
  onUnchoose: () => {
    deleteArea.classList.remove("d-flex");
    deleteArea.classList.add("d-none");
  },
  onEnd: (e) => {
    bannerNumber.textContent = ((e.newDraggableIndex)+1);
  },
  store: {
    set: (sortable) => {
      const orden = sortable.toArray();
      let dataContent = [];
      let getItemsInDom = document.querySelectorAll(".banner-tabs__item");
      getItemsInDom.forEach(el => {
        dataContent.push(el.getAttribute("data-title"));
      });
      console.log(dataContent);
      writePositions(getActualDate(), orden, dataContent);
    }
  }
});

let btnItem = document.getElementById("addNewItem");

btnItem.addEventListener("click", () => {
  let newItemName = document.getElementById("newItemName").value;
  let getAllItems = document.querySelectorAll(".banner-tabs__item");
  listaElementos.innerHTML += `<li class="banner-tabs__item" data-id="${(getAllItems.length)+1}" data-title="${newItemName}">${newItemName}</li>`
  bannerNumber.textContent = (getAllItems.length)+1;
  sortableList.save()
});

const getActualDate = () => {
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  let now = today.toLocaleTimeString();
  return `${day}-${month}-${year}`;
}


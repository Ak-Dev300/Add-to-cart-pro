import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings2 = {
    databaseURL: "https://shoplet2-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app2 = initializeApp(appSettings2)
const database2 = getDatabase(app2)
const itemsInDatabase2 = ref(database2, "Shop-items2")

const totalPrice = document.querySelector(".total");
const noBoughtItems = document.querySelector("#no-bought-items")
const boughtItemsList = document.querySelector("#bought-items-list")
const deleteAll2 = document.getElementById("delete_all")

onValue(itemsInDatabase2, function(snapshot){
    

    if(snapshot.exists()){
        let items = Object.entries(snapshot.val())

        boughtItemsList.innerHTML = ""

        let priceArray = []
        
        for( let i = 0; i < items.length; i++){
            let currrentItem = items[i]

            priceArray.push(currrentItem[1].price)

            let priceArray2 = priceArray.map(toNumber)

            let sum = priceArray2.reduce((a, b) => a + b, 0);
            totalPrice.innerHTML = `Total:  $${sum}`
                    
            listInnerHtml(currrentItem)

            noBoughtItems.style.display = "none";
        }
    }else{
        noBoughtItems.style.display = "block";
    }
   
})

function listInnerHtml(iValue){
    let itemsID = iValue[0]
    let itemsValue = iValue[1].price
    let itemsValue2 = iValue[1].name

    let liEl = document.createElement("li");

    liEl.textContent = `${itemsValue2} - $${itemsValue}`;

    liEl.addEventListener("dblclick", function () {
        let itemLOcationInDatabase2 = ref(database2, `Shop-items2/${itemsID}`)
        remove(itemLOcationInDatabase2).then(() => {
            boughtItemsList.removeChild(liEl);
            totalPrice.innerHTML = ''
        })
    })


    boughtItemsList.append(liEl)
}


deleteAll2.addEventListener("click", function () {
    let itemLocationInDatabase2 = ref(database2, `Shop-items2`)
    remove(itemLocationInDatabase2).then(() => {
        boughtItemsList.innerHTML = "";
        totalPrice.innerHTML = ``
        deleteAll2.style.display = "none";
    })
})

function toNumber(value){
    return Number(value)
}


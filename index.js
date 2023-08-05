import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const inputField = document.getElementById('input-field')
const inputPrice = document.getElementById('input-price-field')
const addButton = document.getElementById('add-button')
const shoppingList = document.getElementById('shopping-list')
const deleteAll = document.getElementById('delete-all')
const totalEl = document.querySelector('.total')


const appSettings = {
    databaseURL: "https://shoplet-94363-default-rtdb.europe-west1.firebasedatabase.app/"
}
const appSetting2 = {
    databaseURL: "https://shoplet2-default-rtdb.europe-west1.firebasedatabase.app/"
}


const app = initializeApp(appSettings, "default");
const database = getDatabase(app);
const itemsInDatabase = ref(database, "Shop-items");

const app2 = initializeApp(appSetting2, 'secondary');
const database2 = getDatabase(app2)
const itemsInDatabase2 = ref(database2, "Shop-items2")


addButton.addEventListener('click', function(){
    let inputValue = {name: inputField.value, price: inputPrice.value}
    if(inputValue.name && inputValue.price){
        push(itemsInDatabase, inputValue)
        resetInputValue()
    }
    
})


onValue(itemsInDatabase, function(snapshot){
    

    if(snapshot.exists()){
        
        let items = Object.entries(snapshot.val())
        let priceArray = []
        
        shoppingList.innerHTML = ""

        for( let i = 0; i < items.length; i++){
            let currrentItem = items[i]

            listInnerHtml(currrentItem)

            priceArray.push(currrentItem[1].price)

            let priceArray2 = priceArray.map(toNumber)

            let sum = priceArray2.reduce((a, b) => a + b, 0);
            totalEl.innerHTML = `Total:  $${sum}`

            
        }

        if (snapshot.exists()) {
            deleteAll.style.display = "block";
        } else {
            deleteAll.style.display = "none";
        }

    }
   
})

function resetInputValue(){
    inputField.value = ''
    inputPrice.value = ''
}

function listInnerHtml(iValue){
    let itemsID = iValue[0]
    let itemsValue = iValue[1].name
    let itemsValue2 = iValue[1].price

    let liEl = document.createElement("li");

    liEl.textContent = `${itemsValue} - ${itemsValue2}`;

    liEl.addEventListener("dblclick", function(){
        let itemLocationInDatabase = ref(database, `Shop-items/${itemsID}`)

        let inputValue2 = {name: itemsValue, price: itemsValue2}

        if(itemsValue && itemsValue2){
            push(itemsInDatabase2, inputValue2)
        }

        remove(itemLocationInDatabase).then(() => {
            shoppingList.removeChild(liEl);
            updateTotal();
            deleteAll.style.display = "none";
        })
    })

    shoppingList.append(liEl)
}

function updateTotal() {
    let items = shoppingList.getElementsByTagName("li");
    let priceArray = [];

    for (let i = 0; i < items.length; i++) {
        let itemText = items[i].textContent;
        let price = parseFloat(itemText.split(" - ")[1]);
        priceArray.push(price);
    }

    let sum = priceArray.reduce((a, b) => a + b, 0);
    totalEl.innerHTML = `Total:  $${sum}`;
}

deleteAll.addEventListener("click", function () {
    let itemLOcationInDatabase = ref(database, `Shop-items`)
    remove(itemLOcationInDatabase).then(() => {
        shoppingList.innerHTML = "";
        totalEl.innerHTML = `Total:  $${0}`
        deleteAll.style.display = "none";
    })
})

function toNumber(value) {
    return Number(value)
}



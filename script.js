'use strict'

// fetch data & local storage 

const fetchData = async () => {
    const response = await fetch('http://localhost:8081/products.json' );
    const json = await response.json();
    return json.products; 
}

const products = await fetchData();

// sort functions and page display

function createData(data){
    let dataFromLocalStorage = getFromLocalStorage();
    let temporaryCard = document.getElementById('card-template').content;
    document.getElementById('card-container').replaceChildren(); 
    const searchBoxValue = document.getElementsByClassName('input-box')[0].value;

    products.forEach( product => {
        let copyHTML = document.importNode(temporaryCard, true).children[0]; 
        copyHTML.querySelector('.productPage-link').setAttribute('href', `http://localhost:8081/html/productPage?productid=${product.id}`)
        copyHTML.querySelector('.card-img').setAttribute("src", product.images[0]);
        copyHTML.querySelector('.product-heading').textContent = product.title;
        copyHTML.querySelector('.card-category').textContent = `Category - ${product.category}`;
        copyHTML.querySelector('.card-description').textContent = `${product.description}`;
        copyHTML.querySelector('.card-price').textContent = `Price ${product.price} $`;
        copyHTML.querySelector('.theAddButton').addEventListener('click', addToCart.bind(event, product));
        copyHTML.querySelector('.theRemoveButton').addEventListener('click', removeFromCart.bind(event, product));
        product.element = copyHTML;
        
        if(dataFromLocalStorage.includes(product.id)){
            const addButton = product.element.getElementsByClassName('theAddButton')[0]; 
            const removeButton = product.element.getElementsByClassName('theRemoveButton')[0];
            addButton.classList.replace("button-add", "button-remove");
            removeButton.classList.replace("button-remove", "button-add");
        }

        if(searchBoxValue === ''){
            document.getElementById('card-container').appendChild(copyHTML);
        }
        else if(!product.title.toLowerCase().includes(searchBoxValue.toLowerCase())){
            document.getElementById('card-container').appendChild(copyHTML);
            product.element.classList.toggle("hide", searchBoxValue.toLowerCase() !== product.title.toLowerCase());
        }
        else{
            document.getElementById('card-container').appendChild(copyHTML);
        }
    })
}

const displayOnPage = async(condition = 'Ascending') =>{
    if(condition == 'Descending'){
        products.sort(function(a, b) {
            return b.price - a.price;
        });
    }
    else{
        products.sort(function(a, b) {
            return a.price - b.price;
        });
    }
    createData(products)
}

displayOnPage('Ascending'); 

const getSortOption = () => {
    const selectButton = document.getElementById('sort-button');
    const value = selectButton.value; 
    return value;
}

document.addEventListener('input', function (event) {
    if (event.target.id !== 'sort-button') return;
    // removeList();
    const option = getSortOption();
    displayOnPage(option);
}, false);


// search bar 

const searchInput = document.getElementsByClassName("input-box");
let timeout = null; 
searchInput[0].addEventListener('input', (e) =>{
    const value = e.target.value.toLowerCase(); 
    clearTimeout(timeout); 
        timeout = setTimeout(function () {
            products.forEach(product =>{
                const isVisible = product.title.toLowerCase().includes(value); 
                if(!isVisible) {
                    console.log('is not visible')
                }
            product.element.classList.toggle("hide", !isVisible); 
        })
    }, 500)
})

// add to cart button functionality 

function getFromLocalStorage(){
    let currentCartProducts;
    let localStorageCartString = localStorage.getItem('cartProduct'); 
    if(!localStorageCartString){
        currentCartProducts = []; 
    }
    else{
        currentCartProducts = JSON.parse(localStorageCartString);
    }
    return currentCartProducts; 
}

function addToCart(product) {
    let currentCartProducts = getFromLocalStorage(); 
    // dispare add to cart si apare remove from cart
    const addButton = product.element.getElementsByClassName('theAddButton')[0]; 
    const removeButton = product.element.getElementsByClassName('theRemoveButton')[0];
    addButton.classList.replace("button-add", "button-remove");
    removeButton.classList.replace("button-remove", "button-add");
    currentCartProducts.push(product.id); 
    localStorage.setItem('cartProduct', JSON.stringify(currentCartProducts));
    console.log(localStorage);
}

function removeFromCart(product){
    let localStorageCartString = localStorage.getItem('cartProduct');
    let currentCartProducts = JSON.parse(localStorageCartString);
    let removedItems = currentCartProducts.filter((item) => {
        return item !== product.id
    });
    const addButton = product.element.getElementsByClassName('theAddButton')[0]; 
    const removeButton = product.element.getElementsByClassName('theRemoveButton')[0];
    addButton.classList.replace("button-remove", "button-add");
    removeButton.classList.replace("button-add", "button-remove");
    localStorage.setItem('cartProduct', JSON.stringify(removedItems));
    console.log(localStorage);
}

  
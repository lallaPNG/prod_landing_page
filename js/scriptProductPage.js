

const fetchData = async () => {
    const response = await fetch('http://localhost:8081/products.json' );
    const json = await response.json();
    return json.products; 
}

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

const params = (new URL(document.location)).searchParams;
let paramID = parseInt(params.get('productid')); 

const products = await fetchData(); 
console.log(products);

function createData(){
    let dataFromLocalStorage = getFromLocalStorage(); 
    let temporaryCard = document.getElementById('product-detail-card-template').content;
    document.getElementById('product-detail-card-container').replaceChildren(); 

    let productOnPage = products.find( product =>{
        if(paramID === product.id){
            let copyHTML = document.importNode(temporaryCard, true).children[0];
            copyHTML.querySelector('.secondary-img-1').setAttribute("src", product.images[1]);
            copyHTML.querySelector('.secondary-img-2').setAttribute("src", product.images[2]);
            copyHTML.querySelector('.secondary-img-3').setAttribute("src", product.images[3]);
            copyHTML.querySelector('.main-card-img').setAttribute("src", product.images[0]);
            copyHTML.querySelector('.product-detail-heading').textContent = product.title;
            copyHTML.querySelector('.card-detail-category').textContent = `Category - ${product.category}`;
            copyHTML.querySelector('.card-detail-description').textContent = `${product.description}`;
            copyHTML.querySelector('.card-detail-price').textContent = `Price ${product.price} $`;
            copyHTML.querySelector('.theAddButton-product').addEventListener('click', addToCart.bind(event, product));
            copyHTML.querySelector('.theRemoveButton-product').addEventListener('click', removeFromCart.bind(event, product));
            product.element = copyHTML;
            document.getElementById('product-detail-card-container').appendChild(copyHTML);

            if(dataFromLocalStorage.includes(product.id)){
                const addButton = product.element.getElementsByClassName('theAddButton-product')[0]; 
                const removeButton = product.element.getElementsByClassName('theRemoveButton-product')[0];
                addButton.classList.replace("button-add-product", "button-remove-product");
                removeButton.classList.replace("button-remove-product", "button-add-product");
            }
        }
    })    
}



function addToCart(product) {
    let currentCartProducts = getFromLocalStorage(); 
    // dispare add to cart si apare remove from cart
    const addButton = product.element.getElementsByClassName('theAddButton-product')[0]; 
    const removeButton = product.element.getElementsByClassName('theRemoveButton-product')[0];
    addButton.classList.replace("button-add-product", "button-remove-product");
    removeButton.classList.replace("button-remove-product", "button-add-product");
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
    const addButton = product.element.getElementsByClassName('theAddButton-product')[0]; 
    const removeButton = product.element.getElementsByClassName('theRemoveButton-product')[0];
    addButton.classList.replace("button-remove-product", "button-add-product");
    removeButton.classList.replace("button-add-product", "button-remove-product");
    localStorage.setItem('cartProduct', JSON.stringify(removedItems));
    console.log(localStorage);
}


function createDataCategory() {
    const productOnDisplay = products.find( product => {
        if(product.id === paramID){
            return product
        }
    })
    let temporaryCardCategory = document.getElementById('card-template-category').content;
    document.getElementById('card-container-same-category').replaceChildren();

    let sameCategory = products.filter( product =>{
        if(productOnDisplay.category === product.category){
            let copyHTMLCategory = document.importNode(temporaryCardCategory, true).children[0];
            copyHTMLCategory.querySelector('.card-img-category').setAttribute("src", product.images[0]);
            copyHTMLCategory.querySelector('.product-heading-category').textContent = product.title;
            copyHTMLCategory.querySelector('.card-detail-category').textContent = `Category - ${product.category}`;
            copyHTMLCategory.querySelector('.card-price-category').textContent = `Price ${product.price} $`;
            document.getElementById('card-container-same-category').appendChild(copyHTMLCategory);
        }
    })
}


createData()
createDataCategory()


// 
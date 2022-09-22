

const fetchData = async () => {
    const response = await fetch('http://localhost:8080/products.json' );
    const json = await response.json();
    return json.products; 
}

const products = await fetchData(); 

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

let dataFromLocalStorage = getFromLocalStorage();
console.log(dataFromLocalStorage)
let totalPrice = document.getElementsByClassName('total-price')[0];
let price = 0; 

function getProductsFromCart(){
    let temporaryCard = document.getElementById('shopping-cart-template').content;
    document.getElementById('shopping-cart-container').replaceChildren(); 
    

    const productsOnCart = products.filter((product) =>{
        if(dataFromLocalStorage.includes(product.id)){
            let copyHTML = document.importNode(temporaryCard, true).children[0];
            copyHTML.querySelector('.cart-img-category').setAttribute("src", product.images[0]);
            copyHTML.querySelector('.shoping-cart-heading').textContent = product.title;
            copyHTML.querySelector('.shoping-cart-price').textContent = `Old Price ${product.price} $`;
            copyHTML.querySelector('.shopping-cart-discount').textContent = `Discount ${product.discountPercentage} $`;
            copyHTML.querySelector('.shopping-cart-discounted-price').textContent = `Price ${Math.floor(product.price - ((product.discountPercentage/100)* product.price))} $`;
            copyHTML.querySelector('.theRemoveButton-cart').addEventListener('click', removeFromCart.bind(event, product));
            product.element = copyHTML;
            document.getElementById('shopping-cart-container').appendChild(copyHTML);

            price = price + Math.floor(product.price - ((product.discountPercentage/100)* product.price));
        }
    })
    totalPrice.insertAdjacentText('beforeend', price + '' + '$')
}

getProductsFromCart()

function removeFromCart(product){
    let localStorageCartString = localStorage.getItem('cartProduct');
    let currentCartProducts = JSON.parse(localStorageCartString);
    product.element.remove(); 
    price = price - product.price;
    let removedItems = currentCartProducts.filter((item) => {
        return item !== product.id
    });
    localStorage.setItem('cartProduct', JSON.stringify(removedItems));
    
    // totalPrice.insertAdjacentText('beforeend', price + '' + '$')
    totalPrice.innerHTML = 'Total ' + price + '' + '$';
}

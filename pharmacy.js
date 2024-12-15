const medicineContainer = document.getElementById("products");
 const cartTableBody = document.getElementById("cart").querySelector("tbody");
const cartTotalAmount = document.getElementById("cart-total");
 const checkoutButton = document.getElementById("checkout");
  const applyFavoritesButton = document.getElementById("apply-favorites"); 
const addToFavoritesButton = document.getElementById("add-to-favorites"); 

let cartItems = JSON.parse(localStorage.getItem("cart")) || [] 
let favoriteMedicines = JSON.parse(localStorage.getItem("favoritesCart")) || []; 
fetch("medicines.json")
    .then(function (response) {
        return response.json();//.json is parsing the response recieved 
    })
    .then(function (data) {//,then is basically to happen after a promise 
        displayMedicinesByCategory(data); 
    });

function displayMedicinesByCategory(data) {

    Object.entries(data).forEach(function ([category, medicines]) {//converts the data into keys and values like python dict, catergory is key and medidnces is values 
        const categorySection = document.createElement("section");
        categorySection.classList.add("category-section");

        const heading = document.createElement("h2");
        heading.textContent = category; // Use category name from the data
        categorySection.appendChild(heading);

        const medicinesWrapper = document.createElement("div");//creating div
        medicinesWrapper.classList.add("products-container");//giving it class name

        medicines.forEach(function (medicine) {//looping through the values
            const medicineElement = document.createElement("div");//for each value a div is made 
            medicineElement.classList.add("product");//giving them class name 

            medicineElement.innerHTML = `
                <img src="${medicine.image}" alt="${medicine.name}" style="width: 100%; height: auto;">
                <h3>${medicine.name}</h3>
                <h4> Rs ${medicine.price}</h4>
                <label for="quantity-${medicine.id}"> quantity:</label>
                <input type="number" min="1" value="1" id="quantity-${medicine.id}" />
                <button class="add-to-cart" data-id="${medicine.id}">Add to Cart</button>
            `;//the content for each medince 

            medicinesWrapper.appendChild(medicineElement);//putting a div into another div
        });

        categorySection.appendChild(medicinesWrapper);//putting a div into the scetion 
        medicineContainer.appendChild(categorySection);//putting the section into the HTML interface 
    });

    attachEventListeners();
}

function attachEventListeners() {
    document.querySelectorAll(".add-to-cart").forEach(function (button) {//looping through the document and finding every add to cart 
        button.addEventListener("click", function (e) {//giving event listeners to each of the button 
            const medicineId = e.target.getAttribute("data-id");//getting the data id of where the event 
            const quantity = parseInt(document.getElementById(`quantity-${medicineId}`).value);
            addToCart(medicineId, quantity);
        });
    });

     applyFavoritesButton.addEventListener("click", applyFavoritesToCart); 
        addToFavoritesButton.addEventListener("click", addToFavorites);
      checkoutButton.addEventListener("click", handleCheckout);
}

function addToCart(medicineId, quantity) {
    fetch("medicines.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const medicines = Object.values(data).flat();//instead of having medicines(values) seperated by catergory we can have all the medicines together
            const medicine = medicines.find(function (m) { //searching through the list to find medicine Id if the id matches with the list of medicine 
                return m.id === medicineId;});//returns 

            if (medicine) {
                const existingItemIndex = cartItems.findIndex(function (item) {
                    return item.id === medicineId;});

                if (existingItemIndex !== -1) {
                    cartItems[existingItemIndex].quantity += quantity;
                } else {
                    cartItems.push({ ...medicine, quantity });}

                updateCart();
            }});}//responsible for checking if an item is in cart and if it is then updating quantity

function addToFavorites() {
    if (cartItems.length > 0) {
        favoriteMedicines = [...cartItems]; //we are copying cartItems into favoriteMedicines x = y is not copying it is assigning 
        localStorage.setItem("favoritesCart", JSON.stringify(favoriteMedicines));//local storage can only have strings so stringify helps store all complex data
        alert("CART ADDED TO FAVORITE!");
    } else {
        alert("CART IS EMPTY!");
    }
}

function applyFavoritesToCart() {
    if (favoriteMedicines.length > 0) {//checking if the favorites is empty 
        cartItems = [...favoriteMedicines]; //retrieving cart from local storage 
        updateCart();
        alert("FAVORITE APPLIED TO CART!");
    } else {
        alert("NO FAVORITED ITEM!.");
    }
}

function updateCart() {
    cartTableBody.innerHTML = ""; //clear the cart table 
    let total = 0;//initiating the total variable

    cartItems.forEach(function (item) {//loop through every item in cart 
    const row = document.createElement("tr");//create row for each item

        const medicineName = document.createElement("td");//cell for the medicine name 
        medicineName.textContent = item.name;

    const medicinePrice = document.createElement("td");//cell for the medicine price
    medicinePrice.textContent = item.price;

    const medicineQuantity = document.createElement("td");//cell for quantity 
        const quantityInput = document.createElement("input");//input for qunatity 
        quantityInput.type = "number";//setting the input type to numbers 
        quantityInput.min = 1;//setting a minimal value 
        quantityInput.value = item.quantity;//assigning  the value inputed to the item.quantity 
        quantityInput.setAttribute("data-id", item.id); //setting data-id = item.id
        quantityInput.addEventListener("input", function (e) {
            updateItemQuantity(e.target.getAttribute("data-id"), e.target.value);
        });//basically have to change the total when the input is chnaged 

        medicineQuantity.appendChild(quantityInput);

        const medicineTotal = document.createElement("td");// cell for total price per item
        const totalPrice = item.price * item.quantity;//calculate total per item
        medicineTotal.textContent = totalPrice;//displaying the total 
        total += totalPrice;

        const removeButton = document.createElement("td");//cell for remove button
        const removeBtn = document.createElement("button");//creating button
        removeBtn.textContent = "Remove";
        removeBtn.setAttribute("data-id", item.id);//setting data-id
        removeBtn.addEventListener("click", function (e) {
            removeFromCart(e.target.getAttribute("data-id"));
        });

        removeButton.appendChild(removeBtn);
//inserting all the tag names into the cell like name and price in the cells made for them
        row.appendChild(medicineName);
      row.appendChild(medicinePrice);
    row.appendChild(medicineQuantity);
        row.appendChild(medicineTotal);
        row.appendChild(removeButton);

        cartTableBody.appendChild(row);
    });
//display the total value
    cartTotalAmount.textContent = total;
}

function updateItemQuantity(medicineId, quantity) {
    const updatedQuantity = parseInt(quantity);//converting the quantity from the input field into a int

    if (updatedQuantity <= 0) {
        alert("Quantity must be greater than zero.");
        return;
    }

    const itemIndex = cartItems.findIndex(function (item) {
        return item.id === medicineId;
    });
//-1 refers to not found so when item is not not foubd then 
    if (itemIndex !== -1) {
        cartItems[itemIndex].quantity = updatedQuantity;
        updateCart();
    }
}

function removeFromCart(medicineId ) {
    const confirmRemoval = confirm(`Do you want to remove item from cart?`);//confirm shows yes or no which is shown as ok and cancel

    if (confirmRemoval) {
        cartItems = cartItems.filter(function (item) {// remove items that matches the id 
            return item.id !== medicineId;
        });
        updateCart();
    }
}


// function removeFromCart(medicineId) {
//     cartItems = cartItems.filter(function (item) {
//         return item.id !== medicineId;
//     });
//     updateCart();
// }

function handleCheckout() {
    if (cartItems.length > 0) {
        localStorage.setItem("cart", JSON.stringify(cartItems));
        window.location.href = "checkoutpage.html";
    } else {
        alert("CART IS EMPTY.");
    }
}

updateCart();

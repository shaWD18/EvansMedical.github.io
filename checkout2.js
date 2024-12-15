
function initializePharmacyCheckoutPage() {
    const cartSummaryTable = document.getElementById("cart-summary").getElementsByTagName("tbody")[0];
    const cartTotal = document.getElementById("cart-total");
    const checkoutForm = document.getElementById("checkout-form");
    const thankYouMessage = document.getElementById("thank-you-message");

    //getting the cart from local storage 
    const cart = getCartFromLocalStorage();
    console.log("Cart loaded from localStorage:", cart);

  //showing the summary of the cart 
    updateCartSummary(cartSummaryTable, cartTotal, cart);
    setupCheckoutFormHandler(checkoutForm, cart, thankYouMessage);
}
//function for getting the cart from local storage 
function getCartFromLocalStorage() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function updateCartSummary(cartSummaryTable, cartTotal, cart) {
    cartSummaryTable.innerHTML = ""; // Clear table
    let total = 0; 

    if (cart.length === 0) {
        const emptyRow = document.createElement("tr");// creating row for 
        const emptyCell = document.createElement("td");//creating cell 
        emptyCell.colSpan = 4;// for all the colomns 
        emptyCell.textContent = "Your cart is empty.";//displaying message when cart is empty 
        emptyCell.style.textAlign = "center";
        emptyRow.appendChild(emptyCell);//putting the cell into the row
        cartSummaryTable.appendChild(emptyRow);
        cartTotal.textContent = "Rs 0.00";
        return;
    }
//looping through the cart 
    cart.forEach((item) => {
        const row = document.createElement("tr");//create a new table row 
//creating table cells for each info 
        const itemName = document.createElement("td");
        itemName.textContent = item.name;

        const itemPrice = document.createElement("td");
        itemPrice.textContent = `Rs ${item.price.toFixed(2)}`;

        const itemQuantity = document.createElement("td");
        itemQuantity.textContent = item.quantity;

        const itemTotal = document.createElement("td");
        const totalPrice = item.price * item.quantity;//calculate the total price for the item
        itemTotal.textContent = `Rs ${totalPrice.toFixed(2)}`;
        total += totalPrice;
//putting all the cells into the row
        row.appendChild(itemName);
        row.appendChild(itemPrice);
        row.appendChild(itemQuantity);
        row.appendChild(itemTotal);

        cartSummaryTable.appendChild(row);
    });

    cartTotal.textContent = `Rs ${total.toFixed(2)}`;
}
function setupCheckoutFormHandler(checkoutForm, cart, thankYouMessage) {
checkoutForm.addEventListener("submit", function handleCheckoutFormSubmission(event) {
    event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty. Add items to proceed.");
            return;
        }

//creating a format for the date to display...the delivery date to be 4 days from present day
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 4);
        const options = { month: 'long', year: 'numeric', day: 'numeric' };
        const formattedDate = deliveryDate.toLocaleDateString(undefined, options);

        thankYouMessage.innerHTML = `Thank you for your order! Your estimated delivery date is ${formattedDate}.`;
//displaying the thank you message with the dae 
        thankYouMessage.style.display = "block";
        clearCart();//claering the local storage 
        setTimeout(() => {
            redirectToPharmacyPage();
        }, 2000); 
    });
}
// function to clear loacl Storage
function clearCart() {
    localStorage.removeItem("cart");
}
//redirecting so the local storage and cart gets refreshed 
function redirectToPharmacyPage() {
    window.location.href = "pharmacypage.html";
}
initializePharmacyCheckoutPage();

// takeorder.html version2 takeorder.js if orderId is received then get order data and put the food items in the bill container

function getDataEditOrder(orderId) {
    const option = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    }

    const url = `${baseURL}orders/order/${orderId}/`;

    refreshAccessToken2(url, option)
        .then(data => {
            console.log('Getting Data with OrderID:', data);
            populateBillContainer(data);
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });
}


function populateBillContainer(orderData) {
    billItems.length = 0; // Clear existing bill items
    
    orderData.food_items.forEach(item => {
        addItemToBill(item.id, item.name, item.price, item.quantity);
    });

    renderBillItems();
    updateNetTotal();
}

function addItemToBill(itemId, itemName, itemPrice, quantity = 1) {
    const existingItem = billItems.find(item => item.id === itemId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        billItems.push({ id: itemId, name: itemName, price: itemPrice, quantity: quantity });
    }
    sendDataToSave();
    renderBillItems();
}


document.addEventListener('DOMContentLoaded', function () {
    // ... existing code ...

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    if (orderId) {
        console.log(`Order ID: ${orderId}`);
        getDataEditOrder(orderId);
    }

    // ... rest of the existing code ...
});


// These changes will allow the takeorder.js script to fetch the order data when an orderId is provided, and populate the bill container with the food items from that order. The existing bill total and net total calculations will automatically update based on the populated items.


document.addEventListener('DOMContentLoaded', function () {
    const menuCategories = document.querySelectorAll('.menu-category-item');
    const menuItemsContainer = document.querySelector('.menu-items');
    const billContainer = document.querySelector('.bill-container');
    const billTotal = document.querySelector('.ta-price');
    const netTotal = document.querySelector('.na-price');
    const discBox = document.querySelector('.disc-box');

    const menuItems = {
        'Category 1': [
            { id: 1, name: 'Item 1', price: 9.99 },
            { id: 2, name: 'Item 2', price: 7.99 },
            { id: 3, name: 'Item 3', price: 5.99 }
        ],
        'Category 2': [
            { id: 4, name: 'Item 4', price: 12.99 },
            { id: 5, name: 'Item 5', price: 8.99 },
            { id: 6, name: 'Item 6', price: 6.99 },
            { id: 7, name: 'Item 7', price: 6.99 },
            { id: 8, name: 'Item 8', price: 6.99 },
            { id: 5, name: 'Item 5', price: 8.99 }, //
            { id: 6, name: 'Item 6', price: 6.99 },
            { id: 7, name: 'Item 7', price: 6.99 },
            { id: 8, name: 'Item 8', price: 6.99 },
            { id: 5, name: 'Item 5', price: 8.99 },
            { id: 6, name: 'Item 6', price: 6.99 },
            { id: 7, name: 'Item 7', price: 6.99 },
            { id: 8, name: 'Item 8', price: 6.99 },
            { id: 5, name: 'Item 5', price: 8.99 },
            { id: 6, name: 'Item 6', price: 6.99 },
            { id: 7, name: 'Item 7', price: 6.99 },
            { id: 8, name: 'Item 8', price: 6.99 },
            { id: 5, name: 'Item 5', price: 8.99 },
            { id: 6, name: 'Item 6', price: 6.99 },
            { id: 7, name: 'Item 7', price: 6.99 },
            { id: 8, name: 'Item 8', price: 6.99 },
            { id: 5, name: 'Item 5', price: 8.99 },
            { id: 6, name: 'Item 6', price: 6.99 },
            { id: 7, name: 'Item 7', price: 6.99 },
            { id: 8, name: 'Item 8', price: 6.99 }, //
            { id: 9, name: 'Item 9', price: 6.99 }
        ],
        'Category 3': [
            { id: 10, name: 'Item 7', price: 10.99 },
            { id: 11, name: 'Item 8', price: 11.99 },
            { id: 12, name: 'Item 9', price: 9.99 }
        ]
    };

    const billItems = [];

    // menuCategories.forEach(category => {
    //     category.addEventListener('click', function () {
    //         const categoryName = this.querySelector('.category-name').textContent.trim();
    //         loadMenuItems(categoryName);
    //     });
    // });

    menuCategories.forEach(category => {
        category.addEventListener('click', function () {
            menuCategories.forEach(cat => cat.classList.remove('selected'));
            this.classList.add('selected');
            const categoryName = this.querySelector('.category-name').textContent.trim();
            loadMenuItems(categoryName);
        });
    });
    

    function loadMenuItems(category) {
        const items = menuItems[category] || [];

        menuItemsContainer.innerHTML = '';
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('menu-item');

            const itemNameDiv = document.createElement('div');
            itemNameDiv.classList.add('item-name');
            itemNameDiv.textContent = item.name;

            const itemPriceDiv = document.createElement('div');
            itemPriceDiv.classList.add('item-price');
            itemPriceDiv.textContent = `₹${item.price}`;

            itemElement.appendChild(itemNameDiv);
            // itemElement.appendChild(itemPriceDiv);
            menuItemsContainer.appendChild(itemElement);

            itemElement.addEventListener('click', function () {
                addItemToBill(item.id, item.name, item.price);
            });
        });
    }

    function addItemToBill(itemId, itemName, itemPrice) {
        const existingItem = billItems.find(item => item.id === itemId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            billItems.push({ id: itemId, name: itemName, price: itemPrice, quantity: 1 });
        }
        renderBillItems();
    }

    function updateItemQuantity(itemId, change) {
        const item = billItems.find(item => item.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeItemFromBill(itemId);
            } else {
                renderBillItems();
            }
        }
    }
    

    function renderBillItems() {
        billContainer.innerHTML = '';

        billItems.forEach(item => {
            // console.log(billItems);
            const billItemElement = document.createElement('div');
            billItemElement.classList.add('bill-item');

            const itemNameDiv = document.createElement('div');
            itemNameDiv.classList.add('bill-item-name');
            itemNameDiv.textContent = item.name;

            const minusButton = document.createElement('button');
            minusButton.classList.add('minus-btn');
            minusButton.textContent = '-';
            minusButton.addEventListener('click', () => updateItemQuantity(item.id, -1));

            const itemQtyDiv = document.createElement('div');
            itemQtyDiv.classList.add('bill-item-qty');
            itemQtyDiv.textContent = item.quantity;

            const plusButton = document.createElement('button');
            plusButton.classList.add('plus-btn');
            plusButton.textContent = '+';
            plusButton.addEventListener('click', () => updateItemQuantity(item.id, 1));

            const itemPriceDiv = document.createElement('div');
            itemPriceDiv.classList.add('bill-item-price');
            itemPriceDiv.textContent = `₹${(item.price * item.quantity).toFixed(2)}`;

            const deleteIcon = document.createElement('div');
            deleteIcon.classList.add('delete-icon');
            deleteIcon.innerHTML = '&#10006;'; // X symbol
            deleteIcon.addEventListener('click', () => removeItemFromBill(item.id));

            
            billItemElement.appendChild(itemNameDiv);

            billItemElement.appendChild(minusButton);
            billItemElement.appendChild(itemQtyDiv);
            billItemElement.appendChild(plusButton);

            billItemElement.appendChild(itemPriceDiv);
            billItemElement.appendChild(deleteIcon);
            billContainer.appendChild(billItemElement);
        });

        // Update the bill total
        billTotal.textContent = `₹${calculateTotal()}`;
        discBox.addEventListener('input', updateNetTotal);
        updateNetTotal();
    }

    function calculateTotal() {
        return billItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    }


    function removeItemFromBill(itemId) {
        const index = billItems.findIndex(item => item.id === itemId);
        if (index !== -1) {
            billItems.splice(index, 1);
            renderBillItems();
        }
    }

    function updateNetTotal() {
        const totalAmount = parseFloat(calculateTotal());
        const discountPercentage = parseFloat(discBox.value) || 0;
        
        let netAmount = totalAmount;
        if (discountPercentage > 0) {
            const discountAmount = totalAmount * (discountPercentage / 100);
            netAmount = totalAmount - discountAmount;
        }
        else if (discountPercentage === null) {
            const discountAmount = totalAmount * (discountPercentage / 100);
            netAmount = totalAmount - discountAmount;
        }
        
        netTotal.textContent = `₹${netAmount.toFixed(2)}`;
    }
    
    function selectFirstCategory() {
        const firstCategory = menuCategories[0];
        if (firstCategory) {
            firstCategory.classList.add('selected');
            const categoryName = firstCategory.querySelector('.category-name').textContent.trim();
            loadMenuItems(categoryName);
        }
    }
    
    
    selectFirstCategory();

});

// ----------------------------

const buttons = document.querySelectorAll('.selectable');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        console.log(`Selected button: ${button.textContent}`);
    });
});

function getSelectedButton() {
    const selectedButton = document.querySelector('.selectable.selected');
    return selectedButton ? selectedButton.textContent : null;
}

document.querySelector('.button-group').addEventListener('click', () => {
    const selected = getSelectedButton();
    console.log(`Currently selected button: ${selected}`);
});

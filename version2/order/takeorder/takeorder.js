// Get all items from Local Storage
function getAllFoodListFromStorage() {
    const storedFoodData = localStorage.getItem('allFoodList');
    if (storedFoodData) {
        if (storedFoodData === 'undefined') {
            console.log('No food list found in local storage');
            getFooditems();
        }
        const foodList = JSON.parse(storedFoodData);
        console.log('Category list from local storage:', foodList);
        // passToCategoryList(categoryList);
        return foodList;
    } else {
        console.log('No category list found in local storage');
        // Optionally, you can call getCategoryList() here to fetch from API if not in storage
        if (getFooditems()) {
            getAllFoodListFromStorage();
        }
    }

}

console.table(getAllFoodListFromStorage());


document.addEventListener('DOMContentLoaded', function () {
    const menuCategories = document.querySelectorAll('.menu-category-item');
    const menuItemsContainer = document.querySelector('.menu-items');
    const billContainer = document.querySelector('.bill-container');
    const billTotal = document.querySelector('.ta-price');
    const netTotal = document.querySelector('.na-price');
    const discBox = document.querySelector('.disc-box');

    const menuItems = {
        'Category 1': [
            { id: 11, name: 'Item 1', price: 99.99 },
            { id: 15, name: 'Item 2', price: 7.99 },
            { id: 16, name: 'Item 2', price: 7.99 },
            { id: 17, name: 'Item 2', price: 7.99 },
            { id: 13, name: 'Item 3', price: 5.99 }
        ],
        'Category 2': [
            { id: 4, name: 'Item 4', price: 12.99 },
            { id: 5, name: 'Item 5', price: 8.99 },
            { id: 6, name: 'Item 6', price: 6.99 },
            { id: 7, name: 'Item 7', price: 6.99 },
            { id: 8, name: 'Item 8', price: 6.99 },
            { id: 25, name: 'Item 5', price: 8.99 }, //
            { id: 26, name: 'Item 6', price: 6.99 },
            { id: 27, name: 'Item 7', price: 6.99 },
            { id: 28, name: 'Item 8', price: 6.99 },
            { id: 35, name: 'Item 5', price: 8.99 },
            { id: 46, name: 'Item 6', price: 6.99 },
            { id: 57, name: 'Item 7', price: 6.99 },
            { id: 68, name: 'Item 8', price: 6.99 },
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
        'Category 4': [
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

// document.querySelector('.button-group').addEventListener('click', () => {
//     const selected = getSelectedButton();
//     console.log(`Currently selected button: ${selected}`);
// });

function getBrowserHeaderHeight() {
    const screenHeight = window.screen.height; // Total screen height
    const screenWidth = window.screen.width; // Total screen width
    const viewportHeight = window.innerHeight; // Viewport height (excluding browser UI)
    const headerHeight = screenHeight - viewportHeight;
    const string = `Screen height: ${screenHeight}px, Viewport height: ${viewportHeight}px, Browser header height: ${headerHeight}px`;
    const string2 = `Screen width: ${screenWidth}px`;
    document.body.style.height = (viewportHeight - 1) + 'px';
    return string;
}

console.log(getBrowserHeaderHeight());


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('moreButton').addEventListener('click', function () {
        console.log('MORE button clicked');
        document.getElementById('morePopup').style.display = 'flex';
    });

    // const doneButton = document.getElementById('doneButton');
    // doneButton.disabled = true;
    // if ((document.querySelector('order-type-option-select')).value) {
    //     doneButton.disabled = false;
    // }

    // document.getElementById('doneButton').addEventListener('click', function () {
    //     console.log('Done button clicked');
    //     document.getElementById('morePopup').style.display = 'none';
    // });

    const getOrderType = document.querySelector('.get-order-type');
    const getOrderTypeInfo = document.querySelector('.get-order-type-info');


    doneButton.addEventListener('click', function (e) {
        const selectElement = document.querySelector('.order-type-option-select');
        if (selectElement && selectElement.value === "") {
            e.preventDefault();
            alert('Please select a table or room before proceeding');
            console.log('Please select a table or room before proceeding');
            // Optionally, you can add some visual feedback here
        } else if (selectElement && selectElement.value !== "") {
            e.preventDefault();

            getOrderType.textContent = document.querySelector('.type-selected').textContent;
            getOrderTypeInfo.textContent = selectElement.value;

            // alert('Selected a table or room before proceeding');
            document.getElementById('morePopup').style.display = 'none';
            // Optionally, you can add some visual feedback here
        } else {
            console.log('Done button clicked');
            getOrderType.textContent = document.querySelector('.type-selected').textContent;
            getOrderTypeInfo.textContent = '';
            document.getElementById('morePopup').style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var mobileInput = document.getElementById('mobile');
    var mobileInputCopy = document.getElementById('mobile-input');

    function validateAndSyncMobile(input, target) {
        // Remove any non-digit characters
        input.value = input.value.replace(/\D/g, '');

        // Limit to 10 digits
        if (input.value.length > 10) {
            input.value = input.value.slice(0, 10);
        }

        // Sync with the other input
        target.value = input.value;
    }

    mobileInput.addEventListener('input', function () {
        validateAndSyncMobile(this, mobileInputCopy);
    });

    mobileInputCopy.addEventListener('input', function () {
        validateAndSyncMobile(this, mobileInput);
    });
});

// --------------


// Display the Table/Room list upon selction of Order Type

let tableNumbersAppended = false;
let roomNumbersAppended = false;

document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.type-selectable');
    const orderTypeOptions = document.querySelector('.order-type-options');

    buttons.forEach(button => {
        button.addEventListener('click', function () {

            // Remove 'selected' class from all buttons
            buttons.forEach(btn => btn.classList.remove('type-selected'));

            // Add 'selected' class to clicked button
            this.classList.add('type-selected');

            // Update order-type-options based on selection
            switch (this.textContent) {
                case 'DINE-IN':
                    // orderTypeOptions.appendChild(getAllTableNumbers());
                    if (!tableNumbersAppended) {
                        orderTypeOptions.innerHTML = '';
                        roomNumbersAppended = false;
                        orderTypeOptions.appendChild(getAllTableNumbers());
                        tableNumbersAppended = true;
                    }
                    break;
                case 'ROOM SERVICE':
                    // orderTypeOptions.innerHTML = getAllRoomNumbers();
                    if (!roomNumbersAppended) {
                        orderTypeOptions.innerHTML = '';
                        tableNumbersAppended = false;
                        orderTypeOptions.appendChild(getAllRoomNumbers());
                        roomNumbersAppended = true;
                    }
                    break;
                case 'DELIVERY':
                case 'PICKUP':
                    orderTypeOptions.innerHTML = '';
                    tableNumbersAppended = false;
                    roomNumbersAppended = false;
                    orderTypeOptions.innerHTML = '';
                    break;
            }
        });
    });
});

function getAllTableNumbers() {
    // Get all tables to add
    // Array of table numbers
    const tableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    function createDineInOptions2() {
        return tableNumbers.map(number =>
            `<button class="table-button" data-table="${number}">Table ${number}</button>`
        ).join('');
    }

    function createDineInOptions() {
        return `<select id="table-select" class="order-type-option-select" required>
            <option value="">Select a table</option>
            ${tableNumbers.map(number =>
            `<option value="${number}">Table ${number}</option>`
        ).join('')}
        </select>`;
    }

    // Usage
    const orderTypeOptions = document.createElement('div');
    orderTypeOptions.className = 'table-numbers-group';
    orderTypeOptions.innerHTML = createDineInOptions();

    return orderTypeOptions;
}
function getAllRoomNumbers() {
    // Get all tables to add
    // Array of table numbers
    const roomNumbers = [101, 201, 301, 401];

    function createRoomServiceOptions2() {
        return roomNumbers.map(number =>
            `<button class="room-button" data-table="${number}">Room ${number}</button>`
        ).join('');
    }

    function createRoomServiceOptions() {
        return `<select id="room-select" class="order-type-option-select" required>    
            <option value="">Select a room</option>
            ${roomNumbers.map(number =>
            `<option value="${number}">Table ${number}</option>`
        ).join('')}
        </select>`;
    }

    // Usage
    const orderTypeOptions = document.createElement('div');
    orderTypeOptions.className = 'table-numbers-group';
    orderTypeOptions.innerHTML = createRoomServiceOptions();

    return orderTypeOptions;
}




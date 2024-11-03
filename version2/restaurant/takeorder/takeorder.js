
// ----------------Body
document.addEventListener('DOMContentLoaded', function () {
    // baseURL = 'https://dineops.onrender.com/api/';
    let finalBillItems = [];

    // Helper function to get a cookie value
    function getCookie(name) {
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    // Get all items from Local Storage
    allFoodItems = getAllFoodListFromStorage();
    console.table(allFoodItems);
    // Get all categories from Local Storage
    allCatgItems = getCategoryListFromStorage();
    console.table(allCatgItems);

    // Filter enabled items
    const enabledFoodItems = allFoodItems.filter(item => item.status === "enabled");
    console.table(enabledFoodItems);
    const enabledCatgItems = allCatgItems.filter(item => item.status === "enabled");
    console.table(enabledCatgItems);

    // console.table(allFoodItems.map(item => item.name));

    const distinctCategories = [];
    enabledCatgItems.forEach(item => {
        if (item.name && !distinctCategories.includes(item.name)) {
            distinctCategories.push(item.name);
        }
    });
    console.table(`distinctCategories : ${distinctCategories}`);


    const categorizedItems = {};
    enabledFoodItems.forEach(item => {
        if (item.category_name) {
            if (!categorizedItems[item.category_name]) {
                categorizedItems[item.category_name] = [];
            }
            categorizedItems[item.category_name].push({
                id: item.id,
                name: item.name,
                price: item.price
            });
        }
    });

    console.log(categorizedItems);

    let billItems = [];

    // Put Category names in the menu category section & manage the items adding in bill
    const categoryDiv = document.querySelector('.menu-category');
    distinctCategories.forEach(category => {
        const categoryDivItems = document.createElement('div');
        categoryDivItems.classList.add('menu-category-item');
        const categoryDivItemsName = document.createElement('div');
        categoryDivItemsName.classList.add('category-name');
        categoryDivItemsName.textContent = category;
        categoryDivItems.appendChild(categoryDivItemsName);
        categoryDiv.appendChild(categoryDivItems);
    });


    // Put Foods in the menu items section
    const menuCategories = document.querySelectorAll('.menu-category-item');
    const menuItemsContainer = document.querySelector('.menu-items');
    const billContainer = document.querySelector('.bill-container');
    const billTotal = document.querySelector('.ta-price');
    const netTotal = document.querySelector('.na-price');
    const discBox = document.querySelector('.disc-box');

    const menuItems = categorizedItems;

    // Adding click on Category Div
    menuCategories.forEach(category => {
        category.addEventListener('click', function () {
            menuCategories.forEach(cat => cat.classList.remove('selected'));
            this.classList.add('selected');
            const categoryName = this.querySelector('.category-name').textContent.trim();
            loadMenuItems(categoryName);
        });
    });

    // Load Food Items on click at Category Div
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

    // Add Food Item to Bill Container
    function addItemToBill(itemId, itemName, itemPrice) {
        // console.log(`bill items: ${billItems}`);
        const existingItem = billItems.find(item => item.id === itemId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            billItems.push({ id: itemId, name: itemName, price: itemPrice, quantity: 1 });
        }
        // console.log(`Current bill items:`, billItems);
        sendDataToSave();
        renderBillItems();
    }

    function sendDataToSave() {
        // finalBillItems = []
        finalBillItems = [...billItems];
        // finalBillItems = [...finalBillItems, ...billItems];

        console.log(`Final bill items 1:`, finalBillItems);
    }

    // Update Quantity of Food Item in Bill Container
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

    // Configure plus/minus delete buttons in Bill Container
    // and also calculate Total and Net Total

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

    // Calculate Total Amount
    function calculateTotal() {
        return billItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    }

    // Remove Food Item from Bill Container on Delete btn click
    function removeItemFromBill(itemId) {
        const index = billItems.findIndex(item => item.id === itemId);
        if (index !== -1) {
            billItems.splice(index, 1);
            renderBillItems();
        }
    }

    // Calculate Net Total Amount wrt Discount Percentage
    function updateNetTotal2() {
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

    // Calculate Net Total Amount wrt Discount Amount
    function updateNetTotal() {
        const totalAmount = parseFloat(calculateTotal());
        const discountAmount = parseFloat(discBox.value) || 0;

        let netAmount = totalAmount - discountAmount;
        if (netAmount < 0) netAmount = 0; // Ensure net amount doesn't go below zero

        netTotal.textContent = `₹${netAmount.toFixed(2)}`;
    }

    // Select first category on page load
    function selectFirstCategory() {
        const firstCategory = menuCategories[0];
        if (firstCategory) {
            firstCategory.classList.add('selected');
            const categoryName = firstCategory.querySelector('.category-name').textContent.trim();
            loadMenuItems(categoryName);
        }
    }


    selectFirstCategory();

    // Add selected class on category items
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


    // Get Browser Header Height
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

    // Configuring More Button
    document.getElementById('moreButton').addEventListener('click', function () {
        console.log('MORE button clicked');
        document.getElementById('morePopup').style.display = 'flex';
    });

    const getOrderType = document.querySelector('.get-order-type');
    const getOrderTypeInfo = document.querySelector('.get-order-type-info');
    const doneButton = document.querySelector('.doneButton');

    doneButton.addEventListener('click', function (e) {

        const selectedOrderType = document.querySelector('.type-selected');
        const mobileInput = document.getElementById('mobile');
        const nameInput = document.getElementById('name');
        const addressInput = document.getElementById('address');

        if (selectedOrderType && selectedOrderType.textContent === 'DELIVERY') {
            if (!mobileInput.value || !nameInput.value || !addressInput.value) {
                e.preventDefault();
                alert('For delivery orders, please provide mobile number, name, and address.');
                return;
            }
        }

        if (selectedOrderType && selectedOrderType.textContent === 'take_away') {
            if (!mobileInput.value || !nameInput.value) {
                e.preventDefault();
                alert('For delivery orders, please provide mobile number and name.');
                return;
            }
        }

        const selectElement = document.querySelector('.order-type-option-select');
        if (selectElement && selectElement.value === "") {
            e.preventDefault();
            alert('Please select a table or room before proceeding');
            console.log('Please select a table or room before proceeding');
            // Optionally, you can add some visual feedback here
        } else if (selectElement && selectElement.value !== "") {
            e.preventDefault();

            getOrderType.textContent = document.querySelector('.type-selected').textContent;
            // getOrderTypeInfo.textContent = selectElement.value;
            // getOrderTypeInfo.textContent = selectElement.textContent;

            // const selectedOption = roomSelect.options[roomSelect.selectedIndex].textContent;
            // document.querySelector('.get-order-type-info').textContent = selectedOption;

            // alert('Selected a table or room before proceeding');
            document.getElementById('morePopup').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
            // Optionally, you can add some visual feedback here
        } else {
            console.log('Done button clicked');
            getOrderType.textContent = document.querySelector('.type-selected').textContent;
            getOrderTypeInfo.textContent = '';
            document.getElementById('morePopup').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
        }

    });

    // Put Mobile Number from More to Main
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

    // Display the Table/Room list upon selction of Order Type
    let tableNumbersAppended = false;
    let roomNumbersAppended = false;
    // document.addEventListener('DOMContentLoaded', function () {
    const buttons2 = document.querySelectorAll('.type-selectable');
    const orderTypeOptions = document.querySelector('.order-type-options');

    buttons2.forEach(button => {
        button.addEventListener('click', function () {
            console.log('Button clicked:', this.textContent);

            // Remove 'selected' class from all buttons
            buttons2.forEach(btn => btn.classList.remove('type-selected'));

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
                case 'HOTEL':
                    // orderTypeOptions.innerHTML = getAllRoomNumbers();
                    if (!roomNumbersAppended) {
                        orderTypeOptions.innerHTML = '';
                        tableNumbersAppended = false;
                        orderTypeOptions.appendChild(getAllRoomNumbers());
                        roomNumbersAppended = true;
                    }
                    break;
                case 'DELIVERY':
                case 'TAKEAWAY':
                    orderTypeOptions.innerHTML = '';
                    tableNumbersAppended = false;
                    roomNumbersAppended = false;
                    orderTypeOptions.innerHTML = '';
                    break;
            }
        });
    });
    // });

    // Get all Table Numbers for Dine-In
    function getAllTableNumbers() {
        // Get all tables to add
        // const tableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const tableNumbers = getTablesListFromStorage();

        function createDineInOptions2() {
            return tableNumbers.map(number =>
                `<button class="table-button" data-table="${number}">Table ${number}</button>`
            ).join('');
        }

        function createDineInOptions() {
            return `<select id="table-select" class="order-type-option-select" required>
            <option value="" disabled selected>Select a table</option>
            ${tableNumbers.map(table =>
                `<option value="${table.id}" ${table.occupied ? 'disabled' : ''}>Table ${table.table_number} ${table.occupied ? ' (Occupied)' : ''}</option>`
            ).join('')}
        </select>`;
        }

        // Usage
        const orderTypeOptions = document.createElement('div');
        orderTypeOptions.className = 'table-numbers-group';
        orderTypeOptions.innerHTML = createDineInOptions();

        return orderTypeOptions;
    }

    // Get all Room Numbers for Hotel
    function getAllRoomNumbers() {
        // Get all tables to add
        // Array of table numbers
        // const roomNumbers2 = [101, 201, 301, 401];

        // Room numbers list from local storage roomsList
        const roomsListString = localStorage.getItem('roomsList');
        const roomsList = JSON.parse(roomsListString);
        const roomNumbers = roomsList.map(room => room.room_number);

        // Room id list from local storage roomsList respectively
        const roomIds = roomsList.map(room => room.id);

        // Create a dictionary mapping roomIds to roomNumbers
        const roomDictionary = {};
        roomIds.forEach((id, index) => {
            roomDictionary[id] = roomNumbers[index]; // Map roomId to roomNumber
        });


        console.warn('Room Numbers:', roomNumbers);
        console.warn('Room IDs:', roomIds);
        console.warn('Room Dictionary:', roomDictionary);

        function createRoomServiceOptions2() {
            return roomNumbers.map(number =>
                `<button class="room-button" data-table="${number}">Room ${number}</button>`
            ).join('');
        }

        function createRoomServiceOptions3() {
            return `<select id="room-select" class="order-type-option-select" required disabled>    
            <option value="">Select a room</option>
            ${roomNumbers.map(number =>
                `<option value="${number}">Room ${number}</option>`
            ).join('')}
        </select>`;
        }

        function createRoomServiceOptions() {
            return `<select id="room-select" class="order-type-option-select" required disabled>    
                <option value="">Select a room</option>
                ${Object.keys(roomDictionary).map(roomId =>
                `<option value="${roomId}">Room ${roomDictionary[roomId]}</option>` // Use roomId as value and roomNumber as text
            ).join('')}
            </select>`;
        }

        // Usage
        const orderTypeOptions = document.createElement('div');
        orderTypeOptions.className = 'table-numbers-group';
        orderTypeOptions.innerHTML = createRoomServiceOptions();

        return orderTypeOptions;
    }


    // Get data from Parameters of URL & using helper functions to set order type and select table/room
    // Parse URL parameters

    const urlParams = new URLSearchParams(window.location.search);
    const tableNumber = urlParams.get('table');
    const roomNumber = urlParams.get('room');
    const orderType = urlParams.get('orderType');
    const orderId = urlParams.get('orderId');
    const bookingId = urlParams.get('bookingId');
    const mobile = urlParams.get('mobile');
    const name = urlParams.get('name');
    const email = urlParams.get('email');

    // Use the parameters as needed
    if (tableNumber && orderType === 'dine_in') {
        console.log(`Dine-in order for table ${tableNumber}`);
        setOrderType('DINE-IN');
        selectTable(tableNumber);
    } else if (orderType === 'take_away') {
        console.log(`Takeaway`);
        document.getElementById('moreButton').click();
        setOrderType('TAKEAWAY');
        document.querySelector('.get-order-type').textContent = 'TAKEAWAY';
    } else if (orderType === 'delivery') {
        console.log(`Delivery`);
        document.getElementById('moreButton').click();
        setOrderType('DELIVERY');
        document.querySelector('.get-order-type').textContent = 'DELIVERY';
    } else if (orderId) {
        document.querySelector('.cancelled-btn').disabled = false;
        console.log(`Order ID: ${orderId}`);
        getDataEditOrder(orderId);
    } else if (roomNumber && bookingId) {
        console.log(`Hotel order for room ${roomNumber} with booking ID: ${bookingId}`);
        setOrderType('HOTEL');
        selectRoom(roomNumber);
    }

    if (mobile && name && email) {
        document.getElementById('mobile').value = mobile;
        document.getElementById('mobile-input').value = mobile;
        document.getElementById('name').value = name;
        document.getElementById('email').value = email;
        const roomSelect = document.getElementById('room-select');
        // get the text content of the selected option
        const selectedOption = roomSelect.options[roomSelect.selectedIndex].textContent;
        document.querySelector('.get-order-type-info').textContent = selectedOption;
    }


    // Helper functions to set order type and select table/room
    function setOrderType(type) {
        const typeButtons = document.querySelectorAll('.type-selectable');
        typeButtons.forEach(button => {
            if (button.textContent === type) {
                button.click();
                button.click();
            }
        });
    }

    function selectTable(number) {
        const tableData = localStorage.getItem('tablesList');
        const tablesList = JSON.parse(tableData);
        const table = tablesList.find(table => table.table_number == number);
        const tableId = table.id;
        console.log('Table Id:', tableId);


        const getOrderType = document.querySelector('.get-order-type');
        const getOrderTypeInfo = document.querySelector('.get-order-type-info');
        const tableSelect = document.getElementById('table-select');
        if (tableSelect) {
            tableSelect.value = tableId;
        }
        getOrderType.textContent = 'DINE-IN';
        getOrderTypeInfo.textContent = number;
    }

    function selectRoom(number) {
        const getOrderType = document.querySelector('.get-order-type');
        const getOrderTypeInfo = document.querySelector('.get-order-type-info');
        const roomSelect = document.getElementById('room-select');
        if (roomSelect) {
            roomSelect.value = number;
        }
        getOrderType.textContent = 'HOTEL';
        getOrderTypeInfo.textContent = number;
    }


    // Close button for the More Modal
    const closeBtn = document.querySelector('.close-btn');
    const morePopup = document.getElementById('morePopup');

    closeBtn.addEventListener('click', function () {
        morePopup.style.display = 'none';
    });

    // More Button for the More Modal to Open & Close
    const moreButton = document.getElementById('moreButton');
    // const morePopup = document.getElementById('morePopup');
    // const closeBtn = document.querySelector('.close-btn');
    const overlay = document.getElementById('overlay');

    moreButton.addEventListener('click', function () {
        morePopup.classList.add('show');
        overlay.style.display = 'block';
    });

    closeBtn.addEventListener('click', function () {
        morePopup.classList.remove('show');
        overlay.style.display = 'none';
    });

    // GET basic order details: Name, Phone, Order Type, Email, Address, Tbale/Room
    function getOrderDetails() {
        const mobileNumber = document.getElementById('mobile-input').value || document.getElementById('mobile').value;
        // const orderType = document.querySelector('.get-order-type').textContent;


        let orderType = document.querySelector('.get-order-type').textContent;
        if (orderType === 'DINE-IN') {
            orderType = 'dine_in';
        } else if (orderType === 'HOTEL') {
            orderType = 'hotel';
        } else if (orderType === 'TAKEAWAY') {
            orderType = 'take_away';
        } else if (orderType === 'DELIVERY') {
            orderType = 'delivery';
        }

        // let tableOrRoom = document.querySelector('.get-order-type-info').textContent;

        var tableOrRoom;
        if (document.getElementById('table-select')) {
            tableOrRoom = document.getElementById('table-select').value;
            // document.querySelector('.get-order-type-info').textContent = tableOrRoom;
        }

        const name = document.getElementById('name').value;
        const lname = document.getElementById('lname').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;


        const roomSelect2 = document.getElementById('room-select');
        const tableSelect2 = document.getElementById('table-select');

        let roomNumber2, bookingId2, tableOrRoom2;

        if (roomSelect2) {
            let roomNumber2 = roomSelect2.value;
            let bookingId2 = urlParams.get('bookingId');
            let tableOrRoom2 = null;
        }
        if (tableSelect2) {
            let tableOrRoom2 = tableSelect2.value;
            let roomNumber2 = null;
            let bookingId2 = null;
        }

        console.log(`mobileNumber: ${mobileNumber}`);
        console.log(`orderType: ${orderType}`);
        console.log(`name: ${name}`);
        console.log(`email: ${email}`);
        console.log(`address: ${address}`);
        console.log('tableOrRoom2:', tableOrRoom2);
        console.log('roomNumber2:', roomNumber2);
        console.log('bookingId2:', bookingId2);

        return {
            mobileNumber,
            orderType,
            tableOrRoom,
            roomNumber,
            bookingId,
            name,
            lname,
            email,
            address
        };
    }

    globalThis.takeDataToKOT = [];

    // SAVE: Getting all items data that are in bill after clicking Save Button
    const savebtn = document.querySelector('.save-btn')
    savebtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (savebtn.click) {
            console.log('save button clicked');
            console.table(finalBillItems);
            const orderDetails = getOrderDetails();
            console.table('Order Details:', orderDetails);

            const totalAmount = parseFloat(document.querySelector('.ta-price').textContent.replace('₹', ''));
            const netTotalAmount = parseFloat(document.querySelector('.na-price').textContent.replace('₹', ''));
            const discountAmount = parseFloat(document.querySelector('.disc-box').value) || 0;
            const notes = document.getElementById('order-note').value;

            const orderData = {
                phone: orderDetails.mobileNumber,
                email: orderDetails.email,
                first_name: orderDetails.name,
                last_name: orderDetails.lname,
                address_line_1: orderDetails.address,
                order_type: orderDetails.orderType,
                tables: [parseInt(orderDetails.tableOrRoom)],
                status: 'in_progress',
                food_items: finalBillItems.map(item => item.id),
                quantity: finalBillItems.map(item => item.quantity),
                // total_price: totalAmount,
                // discount: discountAmount,
                room_id: parseInt(orderDetails.roomNumber),
                booking_id: parseInt(orderDetails.bookingId),
                notes: notes
            };

            const orderData2 = {
                "phone": "1674564521",
                "email": "sourav@example.com",
                "dob": "2024-06-03",
                "address_line_1": "",
                "address_line_2": "",
                "first_name": "Sourav",
                "order_type": "dine_in",
                "table": 8,
                "food_items": [1, 2, 3, 4],
                "quantity": [5],
                "status": "in_progress",
                "notes": "zubi zubi",
                "coupon_used": ["69"]
            }

            const urlParams = new URLSearchParams(window.location.search);
            console.log('Order Data:', orderData);
            const orderId = urlParams.get('orderId');

            if (orderId) {
                saveOrderPATCH(orderData, orderId);
                // document.querySelector('.cancelled-btn').disabled = false;
                // document.querySelector('.hold-btn').disabled = false;
                // document.querySelector('.kot-btn').disabled = false;

            } else {
                saveOrderPOST(orderData);
                // document.querySelector('.hold-btn').disabled = false;
                // document.querySelector('.kot-btn').disabled = false;

            }

        }

        function saveOrderPOST(orderData) {
            console.table(orderData);
            const option = {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + getCookie('access_token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            }

            const url = `${baseURL}orders/order/`;

            refreshAccessToken2(url, option)
                // .then(response => response.json())
                .then(data => {
                    console.log('Data:', data);
                    console.table(data);
                    takeDataToKOT = data;
                    alert("POST: Saved Order Successfully");
                    document.querySelector('.cancelled-btn').disabled = false;
                    document.querySelector('.hold-btn').disabled = false;
                    document.querySelector('.kot-btn').disabled = false;
                    passOrderId = data.id;
                    passOrderKotCount = data.kot_count;

                })
                .catch(error => {
                    console.log('Error Saving Order:', error);
                });

        }


        function saveOrderPATCH(orderData, orderId) {
            console.table(`PATCH: Order Data:`, orderData);
            const option = {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + getCookie('access_token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            }

            console.log(option.body)

            const url = `${baseURL}orders/order/${orderId}/`;
            refreshAccessToken2(url, option)
                // .then(response => response.json())
                .then(data => {
                    console.log('Data:', data);
                    takeDataToKOT = data;
                    console.table(data);
                    alert("PATCH: Saved Order Successfully");
                    document.querySelector('.cancelled-btn').disabled = false;
                    document.querySelector('.hold-btn').disabled = false;
                    document.querySelector('.kot-btn').disabled = false;
                })
                .catch(error => {
                    console.log('Error Saving Order:', error);
                    alert('Error Saving Order');
                })
        }
    });

    // HOLD: Getting all items data that are in bill after clicking Hold Button
    const holdbtn = document.querySelector('.hold-btn')
    holdbtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (holdbtn.click) {
            console.log('hold button clicked');
            console.table(finalBillItems);
            const orderDetails = getOrderDetails();
            console.table('Order Details:', orderDetails);

            const urlParams = new URLSearchParams(window.location.search);
            // console.log('Order Data:', orderData);
            const orderId = urlParams.get('orderId');
            console.log('Order ID:', orderId);

            if (orderId) {
                holdOrder(orderId);
            }
        }

        function holdOrder(orderId) {
            const option = {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + getCookie('access_token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'on_hold'
                })
            }

            console.log(option.body)

            const url = `${baseURL}orders/order/${orderId}/`;
            refreshAccessToken2(url, option)
                // .then(response => response.json())
                .then(data => {
                    console.log('Data:', data);
                    console.table(data);
                    alert("PATCH: Order Hold Successfully");
                })
                .catch(error => {
                    console.log('Error Holding Order:', error);
                })
        }
    });

    // KOT: Getting all items data that are in bill after clicking KOT Button
    const kotbtn = document.querySelector('.kot-btn')
    kotbtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (kotbtn.click) {
            console.log('KOT button clicked');
            console.table(finalBillItems);
            const orderDetails = getOrderDetails();
            // console.table('Order Details:', orderDetails);

            // const urlParams = new URLSearchParams(window.location.search);
            // const orderId = urlParams.get('orderId');
            console.log('Order ID:', orderId);
            console.log(`takeDataToKOT:`, takeDataToKOT);


            if (orderId) {
                if (takeDataToKOT.kot_count > 0) {
                    // Show Re-KOT confirmation
                    if (confirm('This is a Re-KOT. Do you want to proceed?')) {
                        kotOrder(orderId);
                    }
                } else {
                    console.log('1st KOT!');
                    kotOrder(orderId);
                }
            } else {
                // get order id from passOrderId
                const passedOrderId = passOrderId;
                const passedOrderKotCount = passOrderKotCount;
                console.log('Order ID:', passedOrderId);
                if (passedOrderKotCount > 0) {
                    // Show Re-KOT confirmation
                    if (confirm('This is a Re-KOT. Do you want to proceed??')) {
                        kotOrder(passedOrderId);
                    }
                } else {
                    console.log('1st KOT');
                    kotOrder(passedOrderId);
                }
            }
        }


        function kotOrder(orderId) {
            const option = {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + getCookie('access_token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'kot'
                })
            }

            console.log(option.body)

            const url = `${baseURL}orders/order/${orderId}/`;
            refreshAccessToken2(url, option)
                // .then(response => response.json())
                .then(data => {
                    console.log('Data:', data);
                    console.table(data);
                    // alert("PATCH: Order KOT Successfully");

                    // Print KOT
                    printKOT(data);
                })
                .catch(error => {
                    console.log('Error KOT Order:', error);
                })
        }

        function printKOT2(orderData) {
            // Create a new window for printing
            const printWindow = window.open('', '_blank');

            // Generate KOT HTML content
            const kotContent = `
                <html>
                <head>
                    <title>Kitchen Order Ticket</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        h2 { text-align: center; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid black; padding: 5px; text-align: left; }
                    </style>
                </head>
                <body>
                    <h2>Kitchen Order Ticket</h2>
                    <p>Order ID: ${orderData.id}</p>
                    <p>Table: ${orderData.tables[0]}</p>
                    <p>Date: ${new Date().toLocaleString()}</p>
                    <table>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                        </tr>
                        ${orderData.food_items.map((item, index) => `
                            <tr>
                                <td>${allFoodItems.find(food => food.id === item).name}</td>
                                <td>${orderData.quantity[index]}</td>
                            </tr>
                        `).join('')}
                    </table>
                </body>
                </html>
            `;

            // Write the content to the new window and print
            printWindow.document.write(kotContent);
            printWindow.document.close();
            printWindow.print();
        }

        function printKOT(orderData) {
            let kotHead = ``;
            if (orderData.kot_count > 0) {
                kotHead = `<h5>Re-KOT: #${orderData.kot_count}</h5>`;
            } else if (orderData.kot_count === 0) {
                kotHead = `<h5>KOT</h5>`;
            } else {
                console.log('Error: Invalid kot_count value');
            }

            // const kotHead = `<h5>Re-KOT: #${orderData.kot_count}</h5>`;
            const kotContent = `
                <div>
                    <h5>Hotel Iswar & Family Restaurants</h5>
                    <p class="orderId">Order ID: 00${orderData.id}</p>
                    <h5>${kotHead}</h5>
                    <p class="table-room">Table No: ${orderData.tables[0] || '-'}</p>
                    <p class="table-room">Room No: ${orderData.room || '-'}</p>
                    <p>Date: ${new Date().toLocaleString()}</p>
                    <table>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                        </tr>
                        ${orderData.food_items.map((item, index) => `
                            <tr>
                                <td>${allFoodItems.find(food => food.id === item).name}</td>
                                <td>x ${orderData.quantity[index]}</td>
                            </tr>
                        `).join('')}
                    </table>

                    <h5>* * * *</h5>
                </div>
            `;

            printJS({
                printable: kotContent,
                type: 'raw-html',
                style: `
                    body { font-family: Arial, sans-serif; }
                    h4, h5 { text-align: center; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 0px solid black; padding: 5px; text-align: left; }
                    .orderId { font-size: 10px; font-weight: bold; text-align: center; }
                    .table-room { display: inline-block; width: 45%;  }
                `,
                targetStyles: ['*'],
                documentTitle: 'Kitchen Order Ticket',
                onPrintDialogClose: () => {
                    console.log('KOT printed successfully');
                },
                onError: (error) => {
                    console.error('Error printing KOT:', error);
                }
            });
        }

        function printKOT3(orderData) {
            const printWindow = window.open('', '_blank');

            const kotContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Kitchen Order Ticket</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        h2 { text-align: center; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid black; padding: 5px; text-align: left; }
                        @media print {
                            @page { margin: 0; }
                            body { margin: 1cm; }
                        }
                    </style>
                </head>
                <body>
                    <h2>Kitchen Order Ticket</h2>
                    <p>Order ID: ${orderData.id}</p>
                    <p>Table: ${orderData.tables[0]}</p>
                    <p>Date: ${new Date().toLocaleString()}</p>
                    <table>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                        </tr>
                        ${orderData.food_items.map((item, index) => `
                            <tr>
                                <td>${allFoodItems.find(food => food.id === item).name}</td>
                                <td>${orderData.quantity[index]}</td>
                            </tr>
                        `).join('')}
                    </table>
                    <script>
                        window.onload = function() {
                            window.print();
                            window.onafterprint = function() {
                                window.close();
                            };
                        };
                    </script>
                </body>
                </html>
            `;

            printWindow.document.write(kotContent);
            printWindow.document.close();
        }

        function printKOT5(orderData) {
            const kotContent = `
                <div style="padding: 10px; width: 74mm; font-size: 12px; font-family: 'Courier New', monospace;">
                    <h4 style="text-align: center; margin: 0;">Hotel Iswar & Family Restaurants</h4>
                    <h5 style="text-align: center; margin: 5px 0;">KOT</h5>
                    <h5 style="text-align: center; margin: 2px 0; font-size: 10px; ">Order ID: 00${orderData.id}</h5>
                    <p style="margin: 2px 0;">Table: ${orderData.tables[0] || '-'} | Room: ${orderData.room || '-'}</p>
                    <p style="margin: 2px 0;">Date: ${new Date().toLocaleString()}</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
                        <tr>
                            <th style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; text-align: left; padding: 2px;">Item</th>
                            <th style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; text-align: right; padding: 2px;">Qty</th>
                        </tr>
                        ${orderData.food_items.map((item, index) => `
                            <tr>
                                <td style="padding: 2px;">${allFoodItems.find(food => food.id === item).name}</td>
                                <td style="text-align: right; padding: 2px;">x ${orderData.quantity[index]}</td>
                            </tr>
                        `).join('')}
                    </table>
                    <p style="text-align: center; margin-top: 10px;">* * * *</p>
                </div>
            `;

            printJS({
                printable: kotContent,
                type: 'raw-html',
                style: `
                    @page { size: 74mm 105mm; margin: 0; }
                    body { margin: 0; padding: 5px; }
                `,
                targetStyles: ['*'],
                documentTitle: 'Kitchen Order Ticket',
                onPrintDialogClose: () => {
                    console.log('KOT printed successfully');
                },
                onError: (error) => {
                    console.error('Error printing KOT:', error);
                }
            });
        }


    });

    // CANC: Clicking Cancel Button to cancel the order
    const cancbtn = document.querySelector('.cancelled-btn')
    cancbtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (cancbtn.click) {
            console.log('cancel button clicked');
            console.table(finalBillItems);
            const orderDetails = getOrderDetails();
            console.table('Order Details:', orderDetails);

            const urlParams = new URLSearchParams(window.location.search);
            // console.log('Order Data:', orderData);
            const orderId = urlParams.get('orderId');
            console.log('Order ID:', orderId);

            if (orderId) {
                cancOrder(orderId);
            }

        }

        // API Call for Order Cancel
        function cancOrder(orderId) {
            const option = {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + getCookie('access_token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'cancelled'
                })
            }

            console.log(option.body)

            const url = `${baseURL}orders/order/${orderId}/`;
            refreshAccessToken2(url, option)
                // .then(response => response.json())
                .then(data => {
                    console.log('Data:', data);
                    console.table(data);
                    alert("PATCH: Order Cancelled Successfully");
                })
                .catch(error => {
                    console.log('Error Cancelling Order:', error);
                })
        }

    });

    // SETLLE: Clicking Settle Button to settle the order
    const settlebtn = document.querySelector('.settle-btn')
    settlebtn.addEventListener('click', function (e) {
        e.preventDefault();
        const paymentMethod = getSelectedPaymentMethod();

        // if (settlebtn.click) {
        //     console.log('settle button clicked');
        //     console.table('final bill items', finalBillItems);
        //     const orderDetails = getOrderDetails();
        //     console.table('Order Details:', orderDetails);
        //     console.log('takeOrderData:', takeDataToKOT);
        //     // console.log('Order ID:', orderId);
        //     // console.log('Selected payment method:', paymentMethod);

        //     // settleOrder(orderId, paymentMethod);
        // }

        const settleModal = document.getElementById('settleModal');
        const settleModalContainer = document.querySelector('.modal-container');
        const modalBodySettle = settleModal.querySelector('.modal-body');

        // setTimeout(() => settleModal.classList.add('show'), 10);
        // // modalBodySettle.innerHTML = modalContent;
        // settleModalContainer.style.display = 'block';
        // settleModal.style.display = 'block';

        // Change display to flex for centering
        settleModalContainer.style.display = 'flex';
        settleModal.style.display = 'block';
        setTimeout(() => settleModal.classList.add('show'), 10);

        const billNoInput = document.getElementById('bill-no');
        const subTotalInput = document.getElementById('sub-total');
        const discountInput = document.getElementById('bill-discount');
        const netTotalInput = document.getElementById('net-total');
        const cgstInput = document.getElementById('cgst');
        const sgstInput = document.getElementById('sgst');
        const netAmtInput = document.getElementById('net-amt');

        const naPrice = document.querySelector('.na-price').textContent;
        console.log('naPrice:', naPrice);
        // remove the ruppe symbol the 1st character
        const naPriceWithoutRupee = naPrice.substring(1);
        console.log('naPriceWithoutRupee:', naPriceWithoutRupee);

        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');
        const tabelNumber = urlParams.get('table');


        subTotalInput.value = parseFloat(naPriceWithoutRupee).toFixed(2);
        cgstInput.value = "2.5%";
        sgstInput.value = "2.5%";


        function settleOrder(orderId, paymentMethod) {
            const option = {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + getCookie('access_token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'settled',
                    payment_method: paymentMethod
                })
            }
            const url = `${baseURL}orders/order/${orderId}/`;
            refreshAccessToken2(url, option)
                // .then(response => response.json())
                .then(data => {
                    console.log('Data:', data);
                    console.table(data);
                    alert("PATCH: Order Settled Successfully");
                })
                .catch(error => {
                    console.log('Error KOT Order:', error);
                })
        }


    });

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
            // .then(response => response.json())
            .then(data => {
                console.log('Getting Data with OrderID:', data);
                // alert("Data received with OrderID");

                populateMoreModal(data);
                populateBillContainer(data);
                // coldReload();
            })

            .catch(error => {
                console.log('Error fetching data:', error);
            });
    }

    function populateMoreModal2(data) {
        // Populate the "more" modal input fields
        document.getElementById('mobile').value = data.phone || '';
        document.getElementById('name').value = data.first_name || '';
        document.getElementById('address').value = data.address_line_1 || '';
        document.getElementById('email').value = data.email || '';

        // Set order type
        const orderTypeButtons = document.querySelectorAll('.type-selectable');
        orderTypeButtons.forEach(button => {
            if (button.textContent.toLowerCase() === data.order_type.replace('_', '-')) {
                button.classList.add('type-selected');
            }
        });

        // Set table or room number based on order type
        const orderTypeOptions = document.querySelector('.order-type-options');
        if (data.order_type === 'dine_in') {
            orderTypeOptions.innerHTML = `<select id="table-select" class="order-type-option-select">
            <option value="${data.table_number}">Table ${data.table}</option>
        </select>`;
        } else if (data.order_type === 'hotel') {
            orderTypeOptions.innerHTML = `<select id="room-select" class="order-type-option-select">
            <option value="${data.table}">Room ${data.table}</option>
        </select>`;
        }
    }

    function populateMoreModal(data) {
        // Populate the "more" modal input fields
        document.getElementById('mobile').value = data.phone || '';
        document.getElementById('mobile-input').value = data.phone || '';
        document.getElementById('name').value = data.customer.first_name || '';
        document.getElementById('address').value = data.customer.address || '';
        document.getElementById('email').value = data.customer.email || '';
        document.getElementById('discount').value = data.discount || '';

        // Set order type
        const orderTypeButtons = document.querySelectorAll('.type-selectable');
        orderTypeButtons.forEach(button => {
            if (button.textContent.toLowerCase() === data.order_type.replace('_', '-')) {
                button.classList.add('type-selected');
                button.click();
            } else {
                button.classList.remove('type-selected');
            }
        });

        console.log('Order Type:', data.order_type);
        console.log(`table_number: ${data.table_number}`);

        // Set table or room number based on order type
        if (data.order_type === 'dine_in') {
            const tableSelect = document.getElementById('table-select');
            if (tableSelect) {
                tableSelect.value = data.tables[0];
            }
            document.querySelector('.doneButton').click();
        } else if (data.order_type === 'hotel') {
            const roomSelect = document.getElementById('room-select');
            if (roomSelect) {
                roomSelect.value = data.room;
            }
        }
    }

    function populateBillContainer(orderData) {

        console.log('Populating Bill Container with Order Data:', orderData);
        billItems = []; // Clear existing billItems

        orderData.food_items.forEach((foodId, index) => {
            const foodItem = allFoodItems.find(item => item.id === foodId);
            if (foodItem) {
                const quantity = orderData.quantity[index];
                billItems.push({
                    id: foodId,
                    name: foodItem.name,
                    price: foodItem.price,
                    quantity: quantity
                });
            }
        });

        sendDataToSave();
        renderBillItems();
        updateNetTotal();

    }

    function getSelectedPaymentMethod() {
        const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
        return selectedPaymentMethod ? selectedPaymentMethod.value : null;
    }

    // Close the settle modal
    document.querySelector('.close-settle').onclick = function () {
        const settleModal = document.getElementById('settleModal');
        const modalContainer = document.querySelector('.modal-container');

        settleModal.classList.remove('show');
        setTimeout(() => {
            modalContainer.style.display = 'none';
            settleModal.style.display = 'none';
        }, 300);
    }

});
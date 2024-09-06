// Putting Options in category list
function putCategoryInSelect(){
    let selectCategory = document.getElementById('new-item-catg');     // Create
    categoryData = getCategoryListFromStorage();
    console.log('Items.js called........')
    console.table(categoryData);

    // Insert options in selectCategory
    categoryData.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        selectCategory.appendChild(option);
    });


    // Put in Modal Select
    let editModalCategory = document.getElementById('editCategory');  // Modal
    categoryData = getCategoryListFromStorage();
    console.log('Items.js called........')
    console.table(categoryData);

    // Insert options in selectCategory
    categoryData.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        editModalCategory.appendChild(option);
    });
    
}

putCategoryInSelect();

// Add New Item to List
function addItemToList(name, price, category, description, imageSrc, status, id, veg) {
    const itemsContainer = document.querySelector('.all-list-table-items');

    console.log('Veg / NonVeg: ',veg);
    if(veg === true){
        var vegData = 'Veg'
    }else{
        var vegData = 'Non-Veg'
    }

    const itemHTML = `
        <div class="record-row">
            <div class="col-2" id="name">${name}</div>
            <div class="col-1" id="price">${price}</div>
            <div class="col-1" id="category">${category}</div>
            <div class="col-2" id="description">${description}</div>
            <div class="col-2" id="imagesrc"><img src="${imageSrc}" alt="${name}" width="50"></div>
            <div class="col-1" id="itemStatus">${status}</div>
            <div class="col-2" id="itemStatus">${vegData}</div>
            <div class="col-1">
                <i class="edit-btn fa-solid fa-pen-to-square"></i>
                <i class="fa fa-trash delete-btn" onclick=deleteFood(${id}); aria-hidden="true"></i>
            </div>
        </div>
        
    `;

    itemsContainer.insertAdjacentHTML('beforeend', itemHTML);

    // Get the last added record-row
    const lastAddedRow = itemsContainer.lastElementChild;

    // Add event listener to the edit button of the last added row
    const editButton = lastAddedRow.querySelector('.edit-btn');
    editButton.addEventListener('click', () => {
        openEditModal(name, price, category, description, imageSrc, status, id, veg);
    });
}


// API Call to delete food item - DELETE
function deleteFood(id){
    const option = {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    }
    const url = `http://127.0.0.1:8000/api/foods/fooditems/${id}/`;
    refreshAccessToken2(url, option)
    // .then(response => response.json())
    .then(data => {
        console.log('Data:', data);
        getFooditems();
    })
    .catch(error => {
        console.log('Error fetching data:', error);
    });

}

// Local Storage Call to get Category ID by Category Name from localStorage
function getCatgIdByName(name) {
    const categoryData = getCategoryListFromStorage();
    const category = categoryData.find(category => category.name === name);
    return category ? category.id : null;
}


// Open Update Modal
function openEditModal(name, price, category, description, imageSrc, status, id, veg) {
    const modal = document.getElementById('editModal');
    const editName = document.getElementById('editName');
    const editPrice = document.getElementById('editPrice');
    const editCategory = document.getElementById('editCategory');
    const editDescription = document.getElementById('editDescription');
    const editImage = document.getElementById('editImage');
    const editStatus = document.getElementById('editStatus');
    const editStatusText = document.getElementById('statusModalText');
    const editVegNon = document.getElementById('editVegNon');
    const editVegNonText = document.getElementById('vegnonTextModal');

    const itemId = document.createElement('input');
    itemId.type = 'hidden';
    itemId.name = 'itemId';
    itemId.id = 'itemId';
    itemId.value = id;
    modal.appendChild(itemId);

    editName.value = name;
    editPrice.value = price;
    editCategory.value = getCatgIdByName(category);
    editDescription.value = description;
    // editImage.setAttribute('value', imageSrc);
    // editImage.value = imageSrc;
    editStatusText.textContent = capitalizeFirstLetter(status);


    console.log(status);

    if (status === 'enabled') {
        console.log(status);
        editStatus.checked = true;
        // var statusText = 'enabled';
    } else {
        // var statusText = 'disabled';
    }

    if (veg === true){
        editVegNon.checked = false;
        editVegNonText.textContent = 'Veg';
    } else {
        editVegNon.checked = true;
        editVegNonText.textContent = 'Non-Veg';
    }

    // Pre-select the category in the dropdown
    const categoryOptions = editCategory.options;
    for (let i = 0; i < categoryOptions.length; i++) {
        if (categoryOptions[i].value === category) {
            categoryOptions[i].selected = true;
            break;
        }
    }

    modal.style.display = 'block';
}

// Close modal when clicking on the close button or outside of the modal
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('editModal').style.display = 'none';
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        document.getElementById('editModal').style.display = 'none';
    }
});


function updateModalStatus(checkbox) {
    document.getElementById('statusModalText').textContent = checkbox.checked ? 'Enabled' : 'Disabled';
}
function updateModalVegNon(checkbox) {
    document.getElementById('vegnonTextModal').textContent = checkbox.checked ? 'Non-Veg' : 'Veg';
}



// PUT API call after click(Update button)

document.getElementById('update-item').addEventListener('click', function (e) {
    e.preventDefault();
    // Get the item details from the form
    const itemId = document.getElementById('itemId').value;
    const itemName = document.getElementById('editName').value;
    const itemPrice = document.getElementById('editPrice').value;
    const itemDescription = document.getElementById('editDescription').value;
    const itemCategory = document.getElementById('editCategory').value;
    const itemImage = document.getElementById('editImage').value;
    const itemStatus = document.getElementById('editStatus');
    const itemVegNon = document.getElementById('editVegNon');

    // Create an object with the updated item details
    const updatedItem = {
        name: itemName,
        price: itemPrice,
        description: itemDescription,
        category_id: itemCategory,
        status: itemStatus.checked ? 'enabled' : 'disabled',
        id: itemId,
        veg: itemVegNon.checked ? false : true
    };

    console.table(updatedItem);

    updateItem(updatedItem);

    function updateItem(updatedItem) {
        option = {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + getCookie('access_token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: updatedItem.name,
                price: updatedItem.price,
                description: updatedItem.description,
                category_id: updatedItem.category_id,
                status: updatedItem.status,
                veg: updatedItem.veg
            })
        }

        const url = `http://127.0.0.1:8000/api/foods/fooditems/${updatedItem.id}/`

        // Send a PUT request to update the item

        refreshAccessToken(url, option)
            // .then(response => response.json())
            .then(data => {
                console.log('Item updated successfully:', data);
                getFooditems();
                // alert('Item updated successfully:', data);
                // Optionally, update the UI or show a success message
            })
            .catch(error => {
                console.error('Error updating item:', error);
                alert('Item not updated :', error);
                // Handle the error, show an error message to the user
            });
    }
});


// addItemToList('Chicken Masala Biriyani Masala', 10.00, 'South Indian - Veg', 'Description 1', 'https://via.placeholder.com/150');
addItemToList('Item 2', 20.00, 'Category 2', 'Description 2', '','enabled', '1', true);
// addItemToList('Item 3', 30.00, 'Category 3', 'Description 3', '');
// getFooditems();

// API Call GET Food Items
// function getFooditems() {
//     const option = {
//         method: 'GET',
//         headers: {
//             'Authorization': 'Bearer ' + getCookie('access_token'),
//             'Content-Type': 'application/json'
//         }
//     }

//     const url = 'http://127.0.0.1:8000/api/foods/fooditems/';

//     refreshAccessToken2(url, option)
//         // .then(response => response.json())
//         .then(data => {
//             console.log('Data:', data);
//             // document.getElementById('foods_data').innerHTML = JSON.stringify(data);

//             // const preElement = document.getElementById('foods_data');
//             // preElement.textContent = JSON.stringify(data, null, 2);
//             passToList(data);

//         })
//         .catch(error => {
//             console.log('Error fetching data:', error);
//         });

//     function passToList(data) {
//         data.forEach(item => {
//             addItemToList(item.name, item.price, item.category_name, item.description, '', item.status, item.id, item.veg);
//         });
//     }
// };


// getFooditems();
// getAllFoodListFromStorage();


if( foodData =  getAllFoodListFromStorage()){
    passToFoodList(foodData);
} else {
    console.log('No data in storage');
}

function passToFoodList(data) {
    data.forEach(item => {
        addItemToList(item.name, item.price, item.category_name, item.description, '', item.status, item.id, item.veg);
    });
}


// API Call POST Food Items - Create
document.getElementById('add-item').addEventListener('click', function (e) {
    e.preventDefault();

    const itemName = document.querySelector('#new-item-name').value;
    const itemPrice = document.querySelector('#new-item-price').value;
    const itemCategory = document.querySelector('#new-item-catg').value;
    const itemDescription = document.querySelector('#new-item-desc').value;
    const itemImage = document.querySelector('#new-item-img').files[0];
    const itemStatus = document.querySelector('#itemStatus');
    const itemVegNon = document.querySelector('#veg-non');

    // Status Enabled - Disabled
    if (itemStatus.checked === true) {
        var statusText = 'enabled';
        // alert('Status:', statusText);
    } else {
        var statusText = 'disabled';
        // alert('Status:', statusText);
    }

    // Non Veg - Veg
    if (itemVegNon.checked === true) {
        var vegNon = 'false';
    } else {
        var vegNon = 'true';
    }

    const itemData = {
        name: itemName,
        price: itemPrice,
        category: itemCategory,
        description: itemDescription,
        status: statusText,
        veg: vegNon
        // itemImage is a file, which can't be directly included in JSON
        // You may need to handle it separately if you need to send it
    };

    createFood(itemData);
});

// Change Checkbox text on Checkbox Change on Modal
function updateStatus(checkbox) {
    document.getElementById('statusText').textContent = checkbox.checked ? 'Enabled' : 'Disabled';
}
function updateVegNon(checkbox) {
    document.getElementById('veg-nonText').textContent = checkbox.checked ? 'Non Veg' : 'Veg';
}

// API Call POST Food Items - Create

function createFood(itemData) {
    console.log(itemData);
    const option = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: itemData.name,
            description: itemData.description,
            price: itemData.price,
            category_id: itemData.category,
            status: itemData.status,
            veg: itemData.veg
        })
    }

    const url = 'http://127.0.0.1:8000/api/foods/fooditems/';

    refreshAccessToken(url, option)
        // .then(response => response.json())
        .then(data => {
            console.log('Data:', data);
            console.table(data);
            getFooditems();
            // addItemToList(data.name, data.price, data.category_id, data.description, '', data.status, data.veg);
            alert("Food Item Created Successfully");
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });
}


// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}
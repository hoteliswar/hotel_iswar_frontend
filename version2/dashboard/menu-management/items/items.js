// document.addEventListener('DOMContentLoaded', function () {
// window.addEventListener('load', function() {

function addItemToList(name, price, category, description, imageSrc) {
    const itemsContainer = document.querySelector('.all-list-table-items');

    const itemHTML = `
        <div class="record-row">
            <div class="col-2" id="name">${name}</div>
            <div class="col-2" id="price">${price}</div>
            <div class="col-2" id="category">${category}</div>
            <div class="col-2" id="description">${description}</div>
            <div class="col-2" id="imagesrc"><img src="${imageSrc}" alt="${name}" width="50"></div>
            <div class="col-2">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">X</button>
            </div>
        </div>
        
    `;

    itemsContainer.insertAdjacentHTML('beforeend', itemHTML);

    // Get the last added record-row
    const lastAddedRow = itemsContainer.lastElementChild;

    // Add event listener to the edit button of the last added row
    const editButton = lastAddedRow.querySelector('.edit-btn');
    editButton.addEventListener('click', () => {
        openEditModal(name, price, category, description, imageSrc);
    });
}



function openEditModal(name, price, category, description, imageSrc) {
    const modal = document.getElementById('editModal');
    const editName = document.getElementById('editName');
    const editPrice = document.getElementById('editPrice');
    const editCategory = document.getElementById('editCategory');
    const editDescription = document.getElementById('editDescription');
    const editImage = document.getElementById('editImage');

    editName.value = name;
    editPrice.value = price;
    // editCategory.value = category;
    editDescription.value = description;
    // editImage.setAttribute('value', imageSrc);
    // editImage.value = imageSrc;

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

// Close modal when clicking on the close button or outside the modal
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('editModal').style.display = 'none';
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        document.getElementById('editModal').style.display = 'none';
    }
});


// Handle form submission for updating item
document.getElementById('editForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Handle the update logic here
    // You can access the updated values using the form elements
    // After updating, close the modal
    document.getElementById('editModal').style.display = 'none';
});

// addItemToList('Chicken Masala Biriyani Masala', 10.00, 'South Indian - Veg', 'Description 1', 'https://via.placeholder.com/150');
// addItemToList('Item 2', 20.00, 'Category 2', 'Description 2', '');
// addItemToList('Item 3', 30.00, 'Category 3', 'Description 3', '');

getFooditems();

// API Call GET Food Items
function getFooditems() {
    const option = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    }

    const url = 'http://127.0.0.1:8000/api/foods/fooditems/';

    refreshAccessToken2(url, option)
        // .then(response => response.json())
        .then(data => {
            console.log('Data:', data);
            // document.getElementById('foods_data').innerHTML = JSON.stringify(data);

            // const preElement = document.getElementById('foods_data');
            // preElement.textContent = JSON.stringify(data, null, 2);
            passToList(data);

        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });

    function passToList(data) {

        data.forEach(item => {

            // const foodData = {
            //     id: item.id,
            //     name: item.name,
            //     description: item.description,
            //     price: item.price,
            //     category: item.category,
            //     image: item.image,
            //     tenant: item.tenant
            // };
            addItemToList(item.name, item.price, item.category_id, item.description, '');

        });

    }
};
// });

// API Call POST Food Items - Create

document.getElementById('add-item').addEventListener('click', function (e) {
    e.preventDefault();

    const itemName = document.querySelector('#new-item-name').value;
    const itemPrice = document.querySelector('#new-item-price').value;
    const itemCategory = document.querySelector('#new-item-catg').value;
    const itemDescription = document.querySelector('#new-item-desc').value;
    const itemImage = document.querySelector('#new-item-img').files[0];

    // const formData = new FormData();
    // formData.append('name', itemName);
    // formData.append('price', itemPrice);
    // formData.append('category', itemCategory);
    // formData.append('description', itemDescription);
    // formData.append('image', itemImage);

    const itemData = {
        name: itemName,
        price: itemPrice,
        category: itemCategory,
        description: itemDescription,
        // itemImage is a file, which can't be directly included in JSON
        // You may need to handle it separately if you need to send it
    };

    createFood(itemData);
});

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
            category_id: 1
        })
    }

    const url = 'http://127.0.0.1:8000/api/foods/fooditems/';

    refreshAccessToken(url, option)
        // .then(response => response.json())
        .then(data => {
            console.log('Data:', data);
            console.table(data);
            addItemToList(data.name, data.price, data.category_id, data.description, '');
            alert("Food Item Created Successfully");
            exit();

        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });
}

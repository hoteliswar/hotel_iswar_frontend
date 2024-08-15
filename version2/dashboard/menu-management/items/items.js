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

addItemToList('Chicken Masala Biriyani', 10.00, 'South Indian - Veg', 'Description 1', 'https://via.placeholder.com/150');
addItemToList('Item 2', 20.00, 'Category 2', 'Description 2', '');
addItemToList('Item 3', 30.00, 'Category 3', 'Description 3', '');





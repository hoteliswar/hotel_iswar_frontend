function addCatgeoryToList(name, description, status, imageSrc) {
    const itemsContainer = document.querySelector('.all-list-table-items');

    // const itemHTML = `
    //     <div class="record-row">
    //         <div class="col-2" id="name">${name}</div>
    //         <div class="col-3" id="description">${description}</div>
    //         <div class="col-2" id="status">${status}</div>
    //         <div class="col-2" id="imagesrc"><img src="${imageSrc}" alt="${name}" width="50"></div>
    //         <div class="col-3">
    //             <button class="edit-btnn">Edit</button>
    //             <button class="delete-btn"></button>
    //             <i class="fa fa-trash delete-btn" aria-hidden="true"></i>
    //         </div>
    //     </div>
    // `;

    // <label class="switch">
    //     <input type="checkbox" id="categoryStatus" class="new-item-card-body-item-input" onchange="updateStatus(this)">
    //         <span class="slider round"></span>
    // </label>

    const itemHTML = `
        <div class="record-row">
            <div class="col-2" id="name">${name}</div>
            <div class="col-3" id="description">${description}</div>
            <div class="col-3" id="status">
                <label class="switch">
                    <input type="checkbox" class="listStatus" id="categoryStatus" ${status === 'Active' ? 'checked' : ''} disabled>
                    <span class=" slider sliderList round"></span>
                </label>
                <span id="statusDisableText">${status}</span>

            </div>
            <div class="col-2" id="imagesrc"><img src="${imageSrc}" alt="${name}" width="50"></div>
            <div class="col-2">
                <i class="edit-btnn fa-solid fa-pen-to-square"></i>
                <i class="fa fa-trash delete-btn" aria-hidden="true"></i>
            </div>
        </div>
        
    `;


    itemsContainer.insertAdjacentHTML('beforeend', itemHTML);

    // Get the last added record-row
    const lastAddedRow = itemsContainer.lastElementChild;

    // Add event listener to the edit button of the last added row
    const editButton = lastAddedRow.querySelector('.edit-btnn');
    editButton.addEventListener('click', () => {
        openUpdateModal(name, description, status, imageSrc);
    });
}

function openUpdateModal(name, description, status, imageSrc) {
    const modal = document.getElementById('editModal');
    const editName = document.getElementById('editName');
    const editDescription = document.getElementById('editDescription');
    const editStatus = document.getElementById('editStatus');
    const statusModalText = document.getElementById('statusModalText');
    const editImage = document.getElementById('editImage');

    editName.value = name;
    editDescription.value = description;

    if (status === 'Active') {
        editStatus.checked = true;
        statusModalText.textContent = 'Active';
    } else {
        editStatus.checked = false;
        statusModalText.textContent = 'Inactive';
    }

    // editStatus.value = status;
    // editImage.setAttribute('value', imageSrc);
    // editImage.value = imageSrc;

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

addCatgeoryToList('South Indian', 'Veg', 'Active', 'https://via.placeholder.com/150');
addCatgeoryToList('North Indian', 'Veg', 'Inactive', 'https://via.placeholder.com/150');
addCatgeoryToList('Chinese', 'Veg', 'Active', 'https://via.placeholder.com/150');
addCatgeoryToList('Italian', 'Veg', 'Inactive', 'https://via.placeholder.com/150');



// document.addEventListener('DOMContentLoaded', function() {
//     const checkbox = document.getElementById('categoryStatus');
//     const statusText = document.getElementById('statusText');

// });

function updateStatus(checkbox) {
    document.getElementById('statusText').textContent = checkbox.checked ? 'Active' : 'Inactive';
}

function updateModalStatus(checkbox) {
    document.getElementById('statusModalText').textContent = checkbox.checked ? 'Active' : 'Inactive';
}

function updateDisableStatus(checkbox) {
    document.getElementById('statusDisableText').textContent = checkbox.checked ? 'Active' : 'Inactive';
}


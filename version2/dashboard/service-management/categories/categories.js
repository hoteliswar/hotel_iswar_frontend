baseURL = 'https://dineops.onrender.com/api/';

function addCatgeoryToList(name, sub_category ,description, status, id) {
    const itemsContainer = document.querySelector('.all-list-table-items');

    const itemHTML = `
        <div class="record-row">
            <div class="col-2" id="name">${name}</div>
            <div class="col-2" id="sub_category">${sub_category}</div>
            <div class="col-3" id="description">${description}</div>
            <div class="col-3" id="status">
                <label class="switch">
                    <input type="checkbox" class="listStatus" id="categoryStatus" ${status === 'enabled' ? 'checked' : ''} disabled>
                    <span class=" slider sliderList round"></span>
                </label>
                <span id="statusDisableText">${capitalizeFirstLetter(status)}</span>

            </div>
            <div class="col-2">
                <i class="edit-btnn fa-solid fa-pen-to-square"></i>
                <i class="fa fa-trash delete-btn"  aria-hidden="true"></i>
            </div>
        </div>
        
    `;

    imageSrc = 'blank';

    itemsContainer.insertAdjacentHTML('beforeend', itemHTML);

    // Get the last added record-row
    const lastAddedRow = itemsContainer.lastElementChild;

    // Add event listener to the edit button of the last added row
    const editButton = lastAddedRow.querySelector('.edit-btnn');
    editButton.addEventListener('click', () => {
        console.log("Edit button clicked");
        console.log(name, sub_category, description, status, id);
        openUpdateModal(name, sub_category, description, status, id);
    });
}

// API Call to delete category - DELETE
function deleteCategory(id) {
    const option = {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    }
    const url = `${baseURL}foods/categories/${id}/`;
    refreshAccessToken2(url, option)
        // .then(response => response.json())
        .then(data => {
            console.log('Data:', data);
            getCategoryList();
            alert("Category Deleted..");
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });

}

// Open Update Category Modal
function openUpdateModal(name, sub_category, description, status, id) {
    const modal = document.getElementById('editModal');
    const editName = document.getElementById('editCatgName');
    const editSubCatgName = document.getElementById('editSubCatgName');
    const editDescription = document.getElementById('editCatgDescription');
    const editStatus = document.getElementById('editCatgStatus');
    const statusModalText = document.getElementById('statusModalText');
    const editImage = document.getElementById('editCatgImg');

    // Check if itemId input already exists
    let catgIdInput = modal.querySelector('#catgId');
    if (catgIdInput) {
        // If it exists, update its value
        catgIdInput.value = id;
    } else {
        const catgId = document.createElement('input');
        catgId.type = 'hidden';
        catgId.id = 'catgId';
        catgId.value = id;
        modal.appendChild(catgId);
    }

    console.log('Name in Open Update Modal:', name);
    console.log('ID in Open Update Modal:', id);

    editName.value = name;
    editSubCatgName.value = sub_category;
    editDescription.value = description;
    statusModalText.textContent = capitalizeFirstLetter(status);


    // if (status === 'enabled') {
    //     editStatus.checked = true;
    //     statusModalText.textContent = 'Enabled';
    // } else {
    //     editStatus.checked = false;
    //     statusModalText.textContent = 'Disabled';
    // }

    if (status === true) {
        console.log(status);
        editStatus.checked = true;
        // var statusText = 'enabled';
    } else {
        // var statusText = 'disabled';
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



function updateCatgStatus(checkbox) {
    document.getElementById('statusText').textContent = checkbox.checked ? 'Enabled' : 'Disabled';
}

function updateCatgModalStatus(checkbox) {
    document.getElementById('statusModalText').textContent = checkbox.checked ? 'Enabled' : 'Disabled';
}

function updateDisableStatus(checkbox) {
    document.getElementById('statusDisableText').textContent = checkbox.checked ? 'Enabled' : 'Disabled';
}


// getCategoryList();
// getCategoryListFromStorage();

// Create getServiceCategoryListFromStorage() in common.js

if (categoryData = getServiceCategoryListFromStorage()) {
    passToCategoryList(categoryData);
} else {
    console.log('No data in storage');
}

function passToCategoryList(data) {
    data.forEach(item => {
        addCatgeoryToList(item.name, item.sub_category, item.description, item.status, item.id);
    });
}

// Capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// EventListener to POST Category Items - Create
document.getElementById('add-services').addEventListener('click', function (e) {
    e.preventDefault();

    const catgName = document.querySelector('#catgName').value;
    const subCatgName = document.querySelector('#subCatgName').value;
    const catgDescription = document.querySelector('#catgDescription').value;
    const catgStatus = document.querySelector('#catgStatus');

    if (catgStatus.checked) {
        var catgStatusText = true;
        // alert('Status:', statusText);
    } else {
        var catgStatusText = false;
        // alert('Status:', statusText);
    }

    const catgData = {
        name: catgName,
        sub_category: subCatgName,
        description: catgDescription,
        status: catgStatusText
    };
    console.table(catgData);

    createCategory(catgData);
});

// API Call POST Food Items - Create
function createCategory(catgData) {
    console.log(catgData);
    const option = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: catgData.name,
            sub_category: catgData.sub_category,
            description: catgData.description,
            status: catgData.status
        })
    }

    const url = `${baseURL}hotel/service-categories/`;

    refreshAccessToken(url, option)
        // .then(response => response.json())
        .then(data => {
            console.log('Service Category:', data);
            console.table(data);
            //getCategoryList(); // new function for service categories
            alert("Service Category Created Successfully");
            coldReload();
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });
}

// API Call PUT Category Items - Update
document.getElementById('update-category').addEventListener('click', function (e) {
    e.preventDefault();

    const catgId = document.querySelector('#catgId').value;
    const catgName = document.querySelector('#editCatgName').value;
    const subCatgName = document.querySelector('#editSubCatgName').value;
    const catgDescription = document.querySelector('#editCatgDescription').value;
    const catgStatus = document.querySelector('#editCatgStatus');
    const catgImg = document.querySelector('#editCatgImg').value;

    const updatedCatgData = {
        id: catgId,
        sub_category: subCatgName,
        name: catgName,
        description: catgDescription,
        status: catgStatus.checked ? 'enabled' : 'disabled',
        image: catgImg
    };

    console.table(updatedCatgData);

    updatedCatg(updatedCatgData);

    function updatedCatg(updatedCatgData) {
        option = {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + getCookie('access_token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: updatedCatgData.name,
                sub_category: updatedCatgData.sub_category,
                description: updatedCatgData.description,
                status: updatedCatgData.status

            })
        }

        console.log(updatedCatgData.id);
        console.log(catgId);


        const url = `${baseURL}hotel/service-categories/${updatedCatgData.id}/`

        // Send a PATCH request to update the item

        refreshAccessToken(url, option)
            // .then(response => response.json())
            .then(data => {
                console.log("Category Updated Successfully")
                // getCategoryList();
                console.log('Category updated successfully:', data);
                alert('Category updated successfully:', data);
                coldReload();
                // Optionally, update the UI or show a success message
            })
            .catch(error => {
                console.error('Error updating item:', error);
                alert('Category not updated :', error);
                // Handle the error, show an error message to the user
            });
    }

});


function coldReload() {
    const page = document.getElementById('nav-item-categories');
    if (page) {
        page.click();
    }
    else {
        page.click();
    }
}
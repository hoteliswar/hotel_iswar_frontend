// const openRoomModal = document.getElementById('openAddModal');
document.addEventListener('click', function (e) {
    if (e.target.id === 'openAddModal') {
        showAddModal();
    }
});

// Show Add Room modal
function showAddModal() {

    const modal = document.getElementById('roomModal');
    // const modalBody = modal.querySelector('.modal-body');
    setTimeout(() => modal.classList.add('show'), 10);

    // modalBody.innerHTML = modalContent;

    modal.style.display = 'block';
}

// Close Add Modal
document.querySelector('.close').onclick = function () {
    const modal = document.getElementById('roomModal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

// add images

let uploadedImages = [];

document.getElementById('roomImage').addEventListener('change', function (event) {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function (e) {
            uploadedImages.push(e.target.result);
            updateImagePreview();
        }

        reader.readAsDataURL(file);
    }
});

function updateImagePreview() {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = ''; // Clear existing previews

    uploadedImages.forEach((imageSrc, index) => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-container';

        const img = document.createElement('img');
        img.src = imageSrc;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'x';
        removeBtn.onclick = function () {
            uploadedImages.splice(index, 1);
            updateImagePreview();
        };

        imgContainer.appendChild(img);
        imgContainer.appendChild(removeBtn);
        preview.appendChild(imgContainer);
    });
}

renderRoomData();

// Get All Rooms from local storage and put in Table
function renderRoomData() {
    console.log('renderRoomData');
    const roomList = JSON.parse(localStorage.getItem('roomsList')) || [];
    console.log(roomList);

    const appendRoom = document.querySelector('.append-all-room');

    // for each item in roomList
    roomList.forEach(room => {
        const roomRow = document.createElement('div');
        roomRow.classList.add('room-list-table');
        roomRow.classList.add('room-row');
        const roomNumber = document.createElement('div');
        roomNumber.classList.add('col-2');
        roomNumber.textContent = room.room_number;

        const roomPrice = document.createElement('div');
        roomPrice.classList.add('col-2');
        roomPrice.textContent = room.price;

        const roomType = document.createElement('div');
        roomType.classList.add('col-2');
        roomType.textContent = room.room_type;

        const description = document.createElement('div');
        description.classList.add('col-2');
        description.textContent = room.description;

        const bedType = document.createElement('div');
        bedType.classList.add('col-2');
        bedType.textContent = room.beds;

        const actions = document.createElement('div');
        actions.classList.add('col-2');
        actions.innerHTML = '<i class="fas fa-eye"></i>';
        actions.addEventListener('click', function () {
            // alert('View button clicked');
            viewRoomModal(room.id);
        });
        // actions.textContent = 'View';


        roomRow.appendChild(roomNumber);
        roomRow.appendChild(roomPrice);
        roomRow.appendChild(roomType);
        roomRow.appendChild(description);
        roomRow.appendChild(bedType);
        roomRow.appendChild(actions);
        appendRoom.appendChild(roomRow);
    })
}

function viewRoomModal(roomid) {

}

const saveRoombtn = document.getElementById('add-room-save-btn');
saveRoombtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.id === 'add-room-save-btn') {
        const roomNumber = document.getElementById('roomNumber').value;
        const roomPrice = document.getElementById('roomPrice').value;
        const roomType = document.getElementById('roomType').value;
        const roomBedType = document.getElementById('bedType').value;
        const roomStatus = document.getElementById('roomStatus').value;
        // const roomDescription = document.getElementById('amenities').value;
        const roomDescription = document.querySelectorAll('input[name="amenities"]:checked');
        const selectedAmenities = Array.from(roomDescription).map(cb => cb.value);
        // const roomImage = document.getElementById('roomImage').value;

        // const roomData = {
        //     room_number: roomNumber,
        //     price: roomPrice,
        //     room_type: roomType,
        //     beds: roomBedType,
        //     status: roomStatus,
        //     description: roomDescription,
        //     images: uploadedImages
        // }

        const formData = new FormData();
        formData.append('room_number', roomNumber);
        formData.append('price', roomPrice);
        formData.append('room_type', roomType);
        formData.append('beds', roomBedType);
        formData.append('status', roomStatus);
        formData.append('description', selectedAmenities);


        console.log('FormData entries:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
            // To display the formData need to iterate over the Object
        }

        const formDataObj = Object.fromEntries(formData.entries());
        console.log('FormData as object:', formDataObj);

        addNewRoom(formData);
    }
    // POST CALL TO API to add new room
    function addNewRoom(roomData) {
        const url = `${baseURL}hotel/rooms/`;
        const options = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getCookie('access_token'),
                // 'Content-Type': 'application/json' 
                // Remove 'Content-Type' header when sending FormData
            },
            body: roomData,
        };
        console.log(roomData);
        refreshAccessToken2(url, options)
            // .then(response => response.json())
            .then(data => {
                console.log('Data:', data);
                console.table(data);
                alert("Room Created Successfully");
                coldReload();
                coldReload();
            })
            .catch(error => {
                console.log('Error fetching data:', error);
            });

    }
})

function coldReload(){
    // window.location.reload();

    // window.addEventListener('load', function () {
    //     const hotelNav = document.querySelector('.dash-nav-category');
    //     const navRoom = hotelNav.getElementById('room');
    //     if (navRoom){
    //         navRoom.click();
    //     }
    // })
    getRoomsData();
    const appendRoom = document.querySelector('.append-all-room');
    appendRoom.innerHTML = '';
    renderRoomData();
}



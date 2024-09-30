// const openRoomModal = document.getElementById('openAddModal');
// document.addEventListener('DOMContentLoaded', function () {
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

    
    document.getElementById('roomImage').addEventListener('change', function (event) {
        let uploadedImages = [];
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

    // document.addEventListener('DOMContentLoaded', function () {
    //     renderRoomData();
    // })

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
            actions.textContent = 'View';


            roomRow.appendChild(roomNumber);
            roomRow.appendChild(roomPrice);
            roomRow.appendChild(roomType);
            roomRow.appendChild(description);
            roomRow.appendChild(bedType);
            roomRow.appendChild(actions);
            appendRoom.appendChild(roomRow);
        })
    }
// })
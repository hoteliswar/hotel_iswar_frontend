// loadBooking();
// function loadBooking() {
var currentDate = new Date();

var roomBookings = {
    101: [
        {
            guestName: "John Doe",
            age: 25,
            email: "john.doe@example.com",
            phoneNumber: "1234567890",
            checkIn: new Date(2024, 9, 3, 12, 0),
            checkOut: new Date(2024, 9, 8, 11, 0)
        },
        {
            guestName: "Amit Dev",
            age: 25,
            email: "john.doe@example.com",
            phoneNumber: "1234567890",
            checkIn: new Date(2024, 8, 6, 12, 0),
            checkOut: new Date(2024, 8, 7, 11, 0)
        }
    ],
    102: [
        {
            guestName: "Alice Johnson",
            age: 25,
            email: "john.doe@example.com",
            phoneNumber: "1234567890",
            checkIn: new Date(2024, 8, 4, 14, 0),
            checkOut: new Date(2024, 8, 7, 11, 0)
        },
        {
            guestName: "Alice Johnson",
            age: 25,
            email: "john.doe@example.com",
            phoneNumber: "1234567890",
            checkIn: new Date(2024, 7, 24, 14, 0),
            checkOut: new Date(2024, 7, 27, 11, 0)
        }
    ]
};


function generateCalendar(startDate) {
    const calendarDiv = document.getElementById('calendar');
    calendarDiv.innerHTML = '';

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create header row with dates and day names
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Room</th>';
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dayName = dayNames[date.getDay()];
        headerRow.innerHTML += `<th>${dayName}<br>${date.getDate()}/${date.getMonth() + 1}</th>`;
    }
    thead.appendChild(headerRow);

    // Create rows for each room
    for (const roomNumber in roomBookings) {
        const roomRow = document.createElement('tr');
        roomRow.innerHTML = `<td>${roomNumber}</td>`;

        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const cellContent = generateDayCells(roomNumber, date);
            roomRow.innerHTML += `<td>${cellContent}</td>`;
        }

        tbody.appendChild(roomRow);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    calendarDiv.appendChild(table);
}

function generateDayCells2(roomNumber, date) {
    let cellContent = '<div class="day-cell">';
    for (let hour = 0; hour < 24; hour++) {
        const cellDate = new Date(date);
        cellDate.setHours(hour);
        const { isBooked, isPast } = checkBookingStatus(roomNumber, cellDate);
        let cellClass = 'available';
        if (isBooked) {
            cellClass = isPast ? 'past-booked' : 'booked';
            const bookingInfo = getBookingInfo(roomNumber, cellDate);
            const tooltipContent = bookingInfo ?
                `Guest: ${bookingInfo.guestName}\nAge: ${bookingInfo.age}\nPhone: ${bookingInfo.phoneNumber}\nCheck-in: ${formatDate(bookingInfo.checkIn)}\nCheck-out: ${formatDate(bookingInfo.checkOut)}` : '';
            cellContent += `<div class="hour-cell ${cellClass}" data-tooltip="${tooltipContent}" onclick="showBookingModal(${roomNumber}, '${cellDate.toISOString()}')"></div>`;
        } else {
            cellContent += `<div class="hour-cell ${cellClass}"></div>`;
        }
    }
    cellContent += '</div>';
    return cellContent;
}

function generateDayCells(roomNumber, date) {
    let cellContent = '<div class="day-cell">';
    for (let hour = 0; hour < 24; hour++) {
        const cellDate = new Date(date);
        cellDate.setHours(hour);
        const { isBooked, isPast } = checkBookingStatus(roomNumber, cellDate);
        let cellClass = 'available';
        if (isBooked) {
            cellClass = isPast ? 'past-booked' : 'booked';
            const bookingInfo = getBookingInfo(roomNumber, cellDate);
            const tooltipContent = bookingInfo ?
                `Guest: ${bookingInfo.guestName}\nAge: ${bookingInfo.age}\nPhone: ${bookingInfo.phoneNumber}\nCheck-in: ${formatDate(bookingInfo.checkIn)}\nCheck-out: ${formatDate(bookingInfo.checkOut)}` : '';
            cellContent += `<div class="hour-cell ${cellClass}" data-tooltip="${tooltipContent}" onclick="showBookingModal(${roomNumber}, '${cellDate.toISOString()}')"></div>`;
        } else {
            cellContent += `<div class="hour-cell ${cellClass}" onclick="showNewBookingModal(${roomNumber}, '${cellDate.toISOString()}')"></div>`;
        }
    }
    cellContent += '</div>';
    return cellContent;
}

function generateDayCells99(roomNumber, date) {
    let cellContent = '<div class="day-cell">';
    for (let hour = 0; hour < 24; hour++) {
        const cellDate = new Date(date);
        cellDate.setHours(hour);
        const { isBooked, isPast } = checkBookingStatus(roomNumber, cellDate);
        let cellClass = 'available';
        if (isBooked) {
            cellClass = isPast ? 'past-booked' : 'booked';
            const bookingInfo = getBookingInfo(roomNumber, cellDate);
            const tooltipContent = bookingInfo ? `Guest: ${bookingInfo.guestName}\nCheck-in: ${formatDate(bookingInfo.checkIn)}\nCheck-out: ${formatDate(bookingInfo.checkOut)}` : '';
            cellContent += `<div class="hour-cell ${cellClass}" data-tooltip="${tooltipContent}" onclick="showBookingModal(${roomNumber}, '${cellDate.toISOString()}')"></div>`;
        } else {
            cellContent += `<div class="hour-cell ${cellClass}"></div>`;
        }
    }
    cellContent += '</div>';
    return cellContent;
}


function getBookingInfo(roomNumber, date) {
    const bookings = roomBookings[roomNumber];
    if (!bookings) return null;

    return bookings.find(booking => date >= booking.checkIn && date < booking.checkOut);
}

function formatDate(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}


function checkBookingStatus(roomNumber, date) {
    const bookings = roomBookings[roomNumber];
    if (!bookings) return { isBooked: false, isPast: false };

    const now = new Date();
    for (const booking of bookings) {
        if (date >= booking.checkIn && date < booking.checkOut) {
            return { isBooked: true, isPast: booking.checkOut < now };
        }
    }
    return { isBooked: false, isPast: false };
}

function updateCalendar() {
    generateCalendar(currentDate);
    updateCurrentMonth();

    // Update the selected month in the dropdown
    const monthSelect = document.getElementById('monthSelect');
    monthSelect.value = currentDate.getMonth();
}

function updateCurrentMonth() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    document.getElementById('currentMonth').textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
}

document.getElementById('prevWeek').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 7);
    updateCalendar();
});

document.getElementById('nextWeek').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 7);
    updateCalendar();
});

var monthSelect = document.getElementById('monthSelect');
for (let i = 0; i < 12; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = new Date(2024, i, 1).toLocaleString('default', { month: 'long' });
    monthSelect.appendChild(option);
}

monthSelect.addEventListener('change', (e) => {
    currentDate.setMonth(parseInt(e.target.value));
    currentDate.setDate(1);
    updateCalendar();
});

updateCalendar();

// Show booking modal
function showBookingModal(roomNumber, dateString) {
    const date = new Date(dateString);
    const bookingInfo = getBookingInfo(roomNumber, date);

    if (bookingInfo) {
        const modalContent = `
            <h2>Booking Details</h2>
            <p><strong>Room Number:</strong> ${roomNumber}</p>
            <p><strong>Guest Name:</strong> ${bookingInfo.guestName}</p>
            <p><strong>Age:</strong> ${bookingInfo.age}</p>
            <p><strong>Email:</strong> ${bookingInfo.email}</p>
            <p><strong>Phone Number:</strong> ${bookingInfo.phoneNumber}</p>
            <p><strong>Check-in:</strong> ${formatDate(bookingInfo.checkIn)}</p>
            <p><strong>Check-out:</strong> ${formatDate(bookingInfo.checkOut)}</p>
        `;

        const modal = document.getElementById('bookingModal');
        const modalBody = modal.querySelector('.modal-body');
        setTimeout(() => modal.classList.add('show'), 10);

        modalBody.innerHTML = modalContent;

        modal.style.display = 'block';
    }
}

document.querySelector('.close').onclick = function () {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

// document.addEventListener('DOMContentLoaded', function () {
//     document.addEventListener('click', function (e) {
//         if (e.target.id === 'newBooking-btn') {
//             newBooking();
//         }
//     });
// });

// Function to handle the new booking modal
document.addEventListener('click', function (event) {
    if (event.target && event.target.id === 'newBooking-btn') {
        const newBookingModal = document.getElementById('newBookingModal');
        if (newBookingModal) {
            setTimeout(() => newBookingModal.classList.add('show'), 10);
            newBookingModal.style.display = 'block';
        }

        roomList = document.querySelector('.m-room');

        if (roomList) {
            roomList.textContent = 'Room List';
            // allRooms();
        }
    }
});


// Close the new booking modal
document.querySelector('.close2').onclick = function () {
    const newBookingModal = document.getElementById('newBookingModal');
    newBookingModal.classList.remove('show');
    setTimeout(() => newBookingModal.style.display = 'none', 300);
}

function allRooms2() {
    const roomList = {
        101: "Available",
        102: "Available",
        201: "Available",
        202: "Booked",
        203: "Available",
        301: "Booked",
        302: "Occupied",
        303: "Occupied",
        401: "Occupied",
        402: "Available",
    }

    const allRoomDiv = document.createElement('div');
    allRoomDiv.className = 'all-room-available';

    for (const [roomNumber, status] of Object.entries(roomList)) {
        if (status === "Available") {
            const roomButton = document.createElement('button');
            roomButton.className = 'room-button available';
            roomButton.id = roomNumber;
            roomButton.textContent = `Room ${roomNumber}`;
            roomButton.onclick = () => selectRoom(roomNumber);
            allRoomDiv.appendChild(roomButton);
        }
        if (status === "Booked" || status === "Occupied") {
            const roomButton = document.createElement('button');
            roomButton.className = `room-button ${status.toLowerCase()}`;
            roomButton.id = roomNumber;
            roomButton.textContent = `Room ${roomNumber}`;
            roomButton.disabled = true;
            allRoomDiv.appendChild(roomButton);
        }

    }

    const modalRoomList = document.querySelector('.rooms-btn');
    modalRoomList.innerHTML = '';
    modalRoomList.appendChild(allRoomDiv);

}

function allRooms3() {
    const modalRoomListSelect = document.querySelector('.rooms-btn');
    const roomList = localStorage.getItem('roomsList');
    const roomListObj = JSON.parse(roomList);
    console.log('Testing');
    console.log(roomListObj);

    // Create options for each rooms and when clicked it will add another date field
    roomListObj.forEach(room => {
        const option = document.createElement('option');
        option.value = room.room_number;
        option.textContent = `Room ${room.room_number}`;
        modalRoomListSelect.appendChild(option);
    });
    modalRoomListSelect.addEventListener('change', function () {
        const selectedRoom = this.value;
        const dateField = document.createElement('input');
        dateField.type = 'date';
        dateField.name = 'bookingDate';
        dateField.required = true;
        document.querySelector('.booking-form').appendChild(dateField);
    });


}

function allRooms4() {
    const modalRoomListSelects = document.querySelectorAll('.rooms-btn');
    const roomList = localStorage.getItem('roomsList');
    const roomListObj = JSON.parse(roomList);
    console.log('Testing');
    console.log(roomListObj);

    modalRoomListSelects.forEach(select => {
        // Clear existing options
        select.innerHTML = '<option selected disabled>Select Room</option>';

        // Create options for each room
        roomListObj.forEach(room => {
            const option = document.createElement('option');
            option.value = room.room_number;
            option.textContent = `Room ${room.room_number}`;
            select.appendChild(option);
        });

        // Add change event listener to each select
        select.addEventListener('change', function () {
            const selectedRoom = this.value;
            console.log(`Selected room: ${selectedRoom}`);
            // You can add more functionality here if needed
        });
    });
}

function allRooms5() {
    const modalRoomListSelects = document.querySelectorAll('.rooms-btn');
    if (modalRoomListSelects.length > 0) {
        modalRoomListSelects.forEach(select => {
            populateRoomOptions(select);
        });
    } else {
        const singleSelect = document.querySelector('.rooms-btn');
        if (singleSelect) {
            populateRoomOptions(singleSelect);
        }
    }
}

function allRooms() {
    const modalRoomListSelects = document.querySelectorAll('.rooms-btn');
    modalRoomListSelects.forEach(select => {
        populateRoomOptions(select);
    });
}

function selectRoom(roomNumber) {
    // You can add functionality here to handle room selection
    console.log(`Room ${roomNumber} selected`);
    // document.getElementById('roomNumberInput').value = roomNumber;

    const modalRoomList = document.querySelector('.m-room');
    modalRoomList.innerHTML = '';
    newBookingForm(roomNumber);
}

// function newBookingForm(roomNumber){

// }

function showNewBookingModal(roomNumber, dateString) {
    const date = new Date(dateString);
    const newBookingModal = document.getElementById('newBookingModal');
    if (newBookingModal) {
        setTimeout(() => newBookingModal.classList.add('show'), 10);
        newBookingModal.style.display = 'block';
    }

    allRooms();
}

function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

document.addEventListener('DOMContentLoaded', allRooms);

const addMoreBtn = document.getElementById('add-more-btn');
const inputElementAddRoom = document.querySelector('.input-element-add-room');
let rowCount = 1;

addMoreBtn.addEventListener('click', function () {
    rowCount++;
    const newRow = createNewRow(rowCount);
    // inputElementAddRoom.appendChild(newRow);
});

function createNewRow(id) {
    const row = document.createElement('div');
    row.className = 'row';
    row.id = `room-${id}`;

    row.innerHTML = `
           <div class="input-element">
            <label for="roomNumber">Room</label>
            <select class="rooms-btn" id="roomSelect-${id}">
                <option selected disabled>Select Room</option>
            </select>
        </div>
        <div class="input-element ele-room">
            <label for="startDate-${id}">Start Date</label>
            <input type="date" id="startDate-${id}" name="startDate" required>
            <label for="endDate-${id}">End Date</label>
            <input type="date" id="endDate-${id}" name="endDate" required>
            <i class="fa-solid fa-circle-minus fa-2x remove-room-btn"></i>
        </div>
        `;

    const removeBtn = row.querySelector('.remove-room-btn');
    removeBtn.addEventListener('click', function () {
        row.remove();
    });

    // return row;
    inputElementAddRoom.appendChild(row);

    // Populate room options for this new row
    const selectElement = row.querySelector('.rooms-btn');
    populateRoomOptions(selectElement);
}

// Function to initialize the booking functionality
function initializeBooking() {
    const addMoreBtn = document.getElementById('add-more-btn');
    const inputElementAddRoom = document.querySelector('.input-element-add-room');
    let rowCount = 1;

    if (addMoreBtn) {
        addMoreBtn.addEventListener('click', function () {
            rowCount++;
            const newRow = createNewRow(rowCount);
            inputElementAddRoom.appendChild(newRow);
            populateRoomOptions(newRow.querySelector('.rooms-btn'));
        });
    }

    // Initial call to populate existing room selects
    allRooms();
}

function populateRoomOptions(select) {
    const roomList = localStorage.getItem('roomsList');
    const roomListObj = JSON.parse(roomList);

    // Clear existing options
    select.innerHTML = '<option selected disabled>Select Room</option>';

    // Create options for each room
    roomListObj.forEach(room => {
        const option = document.createElement('option');
        option.value = room.room_number;
        option.textContent = `Room ${room.room_number}`;
        select.appendChild(option);
    });

    // Add change event listener to the select
    select.addEventListener('change', function () {
        const selectedRoom = this.value;
        console.log(`Selected room: ${selectedRoom}`);
        // You can add more functionality here if needed
    });
}

// Export the initialization function
window.initializeBooking = initializeBooking;


// document.getElementById('new-booking-btn-2').addEventListener('click', function () {
//     const roomRows = document.querySelectorAll('.row'); // Select all dynamically added room rows
//     const bookingData = [];
//     console.log(bookingData)

//     roomRows.forEach((row, index) => {
//         const roomSelect = document.getElementById(`roomSelect-${index + 1}`);
//         const startDate = document.getElementById(`startDate-${index + 1}`);
//         const endDate = document.getElementById(`endDate-${index + 1}`);

//         // Validate to ensure room, start date, and end date are selected
//         if (roomSelect.value && startDate.value && endDate.value) {
//             bookingData.push({
//                 room: roomSelect.value,
//                 startDate: startDate.value,
//                 endDate: endDate.value
//             });
//         } else {
//             alert("Please fill all the required fields for each room.");
//             return;
//         }
//     });

//     console.log(bookingData); // You can handle this data as needed, like sending it to a backend API

//     // Now you can use `bookingData` array to process or send data as required
// });


document.getElementById('new-booking-btn').addEventListener('click', function (e) {
    e.preventDefault();
    const roomRows = document.querySelectorAll('.row');
    console.log(roomRows)
    const bookingData = [];

    roomRows.forEach((row, index) => {
        const roomSelect = row.querySelector('.rooms-btn');
        const startDate = row.querySelector('input[name="startDate"]');
        const endDate = row.querySelector('input[name="endDate"]');

        if (!roomSelect || !startDate || !endDate) {
            console.error(`Missing elements in row ${index + 1}:`, {
                roomSelect: !!roomSelect,
                startDate: !!startDate,
                endDate: !!endDate
            });
            alert(`Error: Some elements are missing in row ${index + 1}. Please check the console for details.`);
            return;
        }

        if (roomSelect.value && startDate.value && endDate.value) {
            bookingData.push({
                room: roomSelect.value,
                startDate: startDate.value,
                endDate: endDate.value
            });
        } else {
            console.warn(`Incomplete data in row ${index + 1}:`, {
                room: roomSelect.value,
                startDate: startDate.value,
                endDate: endDate.value
            });
            alert(`Please fill all the required fields for room ${index + 1}.`);
            return;
        }
    });

    if (bookingData.length === 0) {
        alert("Please add at least one room booking.");
        return;
    }

    console.log("Booking data:", bookingData);
    // Process or send bookingData as required
});
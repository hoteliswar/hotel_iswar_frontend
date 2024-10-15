document.getElementById('viewToggle').addEventListener('click', function() {
    const viewToggle = document.getElementById('viewToggle');
    const calendarWrapper = document.querySelector('.calender-wrapper');
    const listviewWrapper = document.querySelector('.listview-wrapper');
    const toggleText = document.querySelector('.toggle-text');

    viewToggle.addEventListener('change', function() {
        if (this.checked) {
            calendarWrapper.style.display = 'none';
            listviewWrapper.style.display = 'block';
            toggleText.textContent = 'List View';
            // Here you would call a function to populate the list view
            populateListView();
        } else {
            calendarWrapper.style.display = 'block';
            listviewWrapper.style.display = 'none';
            toggleText.textContent = 'Calendar View';
        }
    });
});

function populateListView() {
    // This function should populate the listview-wrapper with all bookings
    // You'll need to implement this based on your data structure
    const listviewWrapper = document.querySelector('.listview-wrapper');
    // listviewWrapper.innerHTML = '<h2>All Bookings</h2>';
    // Add code here to loop through all bookings and add them to the list view
}


var currentDate = new Date();

function convertToRequiredFormat2() {
    const apiDataString = localStorage.getItem('roomsList');
    if(!apiDataString){
        console.log('No data found');
    }

    let apiData;
    try {
        apiData = JSON.parse(apiDataString);
    } catch (error) {
        console.error('Error parsing roomsList data:', error);
        return {};
    }

    const localroomBookings = {};

    if (!Array.isArray(apiData)) {
        console.error('roomsList is not an array');
        return {};
    }
    // const localroomBookings = {};

    // apiData.forEach(room => {
    //     const roomNumber = room.room_number;

    //     // Create an entry for each room in the localroomBookings object
    //     localroomBookings[roomNumber] = room.bookings.map(booking => ({
    //         guestName: `Guest ${booking.id}`, // Placeholder for guest name
    //         age: 30, // Placeholder for age
    //         email: `guest${booking.id}@example.com`, // Placeholder for email
    //         phoneNumber: "1234567890", // Placeholder for phone number
    //         checkIn: new Date(
    //             booking.start_date.replace("T", " ").replace("Z", "")
    //         ),
    //         checkOut: new Date(
    //             booking.end_date.replace("T", " ").replace("Z", "")
    //         ),
    //         status: booking.is_active ? "booked" : "available"
        
    //     }));
    // });

    apiData.forEach(room => {
        const roomNumber = room.room_number;
        const currentDate = new Date();
    
        // Create an entry for each room in the localroomBookings object
        localroomBookings[roomNumber] = room.bookings.map(booking => {
            const checkIn = new Date(booking.start_date.replace("T", " ").replace("Z", ""));
            const checkOut = new Date(booking.end_date.replace("T", " ").replace("Z", ""));
    
            let status;
            if (checkIn < currentDate && checkOut < currentDate) {
                status = "checkout";
            } else if (checkIn > currentDate && checkOut > currentDate) {
                status = "booked";
            } else if (checkIn <= currentDate && checkOut > currentDate) {
                status = "checkin";
            } else {
                status = "available";
            }
    
            return {
                guestName: `Guest ${booking.id}`, // Placeholder for guest name
                age: 30, // Placeholder for age
                email: `guest${booking.id}@example.com`, // Placeholder for email
                phoneNumber: "1234567890", // Placeholder for phone number
                checkIn: checkIn,
                checkOut: checkOut,
                status: status
            };
        });
    });

    console.log(`localroomBookings: ${localroomBookings}`);

    return localroomBookings;
}

function convertToRequiredFormat() {
    const apiDataString = localStorage.getItem('roomsList');
    if(!apiDataString){
        console.log('No data found');
        return {};
    }

    let apiData;
    try {
        apiData = JSON.parse(apiDataString);
    } catch (error) {
        console.error('Error parsing roomsList data:', error);
        return {};
    }

    const localroomBookings = {};

    if (!Array.isArray(apiData)) {
        console.error('roomsList is not an array');
        return {};
    }

    apiData.forEach(room => {
        const roomNumber = room.room_number;
        localroomBookings[roomNumber] = room.bookings.map(bookingData => {
            const booking = bookingData.booking;
            const user = bookingData.user;
            const checkIn = new Date(booking.start_date);
            const checkOut = new Date(booking.end_date);
            const currentDate = new Date();

            let status;
            if (checkOut < currentDate) {
                status = "checkout";
            } else if (checkIn > currentDate) {
                status = "booked";
            } else {
                status = "checkin";
            }

            return {
                guestName: `${user.first_name} ${user.last_name}`,
                age: 25, // Placeholder as age is not provided in the original data
                email: user.email,
                phoneNumber: user.phone,
                checkIn: checkIn,
                checkOut: checkOut,
                status: status
            };
        });
    });

    console.log('localroomBookings:', localroomBookings);
    return localroomBookings;
}

// Converting API response to the desired format
var roomBookings = convertToRequiredFormat();
console.log(roomBookings);

var roomBookings2 = {
    101: [
        {
            guestName: "John Doe",
            age: 25,
            email: "john.doe@example.com",
            phoneNumber: "1234567890",
            checkIn: new Date("2024-10-10 12:10"),
            checkOut: new Date("2024-10-12 12:00"),
            status: "booked"
        },
        {
            guestName: "Amit Dev",
            age: 25,
            email: "john.doe@example.com",
            phoneNumber: "1234567890",
            checkIn: new Date(2024, 8, 6, 12, 0),
            checkOut: new Date(2024, 8, 7, 11, 0),
            status: "checkout"
        }
    ],
    102: [
        {
            guestName: "Alice Johnson",
            age: 25,
            email: "john.doe@example.com",
            phoneNumber: "1234567890",
            checkIn: new Date(2024, 8, 4, 14, 0),
            checkOut: new Date(2024, 8, 7, 11, 0),
            status: "checkout"
        },
        {
            guestName: "Alice Johnson",
            age: 25,
            email: "john.doe@example.com",
            phoneNumber: "1234567890",
            checkIn: new Date(2024, 7, 24, 14, 0),
            checkOut: new Date(2024, 7, 27, 11, 0),
            status: "checkout"
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

function generateDayCells5(roomNumber, date) {
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

function generateDayCells(roomNumber, date) {
    let cellContent = '<div class="day-cell">';
    for (let hour = 0; hour < 24; hour++) {
        const cellDate = new Date(date);
        cellDate.setHours(hour);
        const bookingInfo = getBookingInfo(roomNumber, cellDate);
        let cellClass = 'available';
        
        if (bookingInfo) {
            switch(bookingInfo.status) {
                case 'booked':
                    cellClass = 'booked';
                    break;
                case 'checkin':
                    cellClass = 'checkin';
                    break;
                case 'checkout':
                    cellClass = 'checkout';
                    break;
            }
            
            const tooltipContent = `Guest: ${bookingInfo.guestName}\nAge: ${bookingInfo.age}\nPhone: ${bookingInfo.phoneNumber}\nCheck-in: ${formatDate(bookingInfo.checkIn)}\nCheck-out: ${formatDate(bookingInfo.checkOut)}\nStatus: ${bookingInfo.status}`;
            cellContent += `<div class="hour-cell ${cellClass}" data-tooltip="${tooltipContent}" onclick="showBookingModal(${roomNumber}, '${cellDate.toISOString()}')"></div>`;
        } else {
            cellContent += `<div class="hour-cell ${cellClass}" onclick="showNewBookingModal(${roomNumber}, '${cellDate.toISOString()}')"></div>`;
        }
    }
    cellContent += '</div>';
    return cellContent;
}

function generateDayCells3(roomNumber, date) {
    let cellContent = '<div class="day-cell">';
    for (let hour = 0; hour < 24; hour++) {
        const cellDate = new Date(date);
        cellDate.setHours(hour);
        const { status, isPast } = checkBookingStatus(roomNumber, cellDate);
        let cellClass = 'available';
        
        switch(status) {
            case 'booked':
                cellClass = isPast ? 'past-booked' : 'booked';
                break;
            case 'checkin':
                cellClass = isPast ? 'past-checkin' : 'checkin';
                break;
            case 'checkout':
                cellClass = isPast ? 'past-checkout' : 'checkout';
                break;
        }

        if (status !== 'available') {
            const bookingInfo = getBookingInfo(roomNumber, cellDate);
            const tooltipContent = bookingInfo ?
                `Guest: ${bookingInfo.guestName}\nAge: ${bookingInfo.age}\nPhone: ${bookingInfo.phoneNumber}\nCheck-in: ${formatDate(bookingInfo.checkIn)}\nCheck-out: ${formatDate(bookingInfo.checkOut)}\nStatus: ${status}` : '';
            cellContent += `<div class="hour-cell ${cellClass}" data-tooltip="${tooltipContent}" onclick="showBookingModal(${roomNumber}, '${cellDate.toISOString()}')"></div>`;
        } else {
            cellContent += `<div class="hour-cell ${cellClass}" onclick="showNewBookingModal(${roomNumber}, '${cellDate.toISOString()}')"></div>`;
        }
    }
    cellContent += '</div>';
    return cellContent;
}

function generateDayCells4(roomNumber, date) {
    let cellContent = '<div class="day-cell">';
    for (let hour = 0; hour < 24; hour++) {
        const cellDate = new Date(date);
        cellDate.setHours(hour);
        const { status, isPast } = checkBookingStatus(roomNumber, cellDate);
        let cellClass = status;
        if (isPast) cellClass += ' past';

        const bookingInfo = getBookingInfo(roomNumber, cellDate);
        const tooltipContent = bookingInfo ?
            `Guest: ${bookingInfo.guestName}\nAge: ${bookingInfo.age}\nPhone: ${bookingInfo.phoneNumber}\nCheck-in: ${formatDate(bookingInfo.checkIn)}\nCheck-out: ${formatDate(bookingInfo.checkOut)}\nStatus: ${status}` : '';

        if (status !== 'available') {
            cellContent += `<div class="hour-cell ${cellClass}" data-tooltip="${tooltipContent}" onclick="showBookingModal(${roomNumber}, '${cellDate.toISOString()}')"></div>`;
        } else {
            cellContent += `<div class="hour-cell ${cellClass}" onclick="showNewBookingModal(${roomNumber}, '${cellDate.toISOString()}')"></div>`;
        }
    }
    cellContent += '</div>';
    return cellContent;
}

function getBookingInfo2(roomNumber, date) {
    const bookings = roomBookings[roomNumber];
    if (!bookings) return null;

    return bookings.find(booking => date >= booking.checkIn && date < booking.checkOut);
}

function getBookingInfo(roomNumber, date) {
    const bookings = roomBookings[roomNumber];
    if (!bookings) return null;

    return bookings.find(booking => {
        const bookingDate = new Date(date);
        return bookingDate >= booking.checkIn && bookingDate < booking.checkOut;
    });
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

function checkBookingStatus2(roomNumber, date) {
    const bookings = roomBookings[roomNumber];
    if (!bookings) return { status: 'available', isPast: false };

    const now = new Date();
    for (const booking of bookings) {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        if (date >= checkIn && date < checkOut) {
            let status = 'booked';
            if (date.toDateString() === checkIn.toDateString()) {
                status = 'checkin';
            } else if (date.toDateString() === new Date(checkOut.getTime() - 86400000).toDateString()) {
                status = 'checkout';
            }
            return { status, isPast: checkOut < now };
        }
    }
    return { status: 'available', isPast: false };
}

function checkBookingStatus3(roomNumber, date) {
    const bookings = roomBookings[roomNumber];
    if (!bookings) return { status: 'available', isPast: false };

    const now = new Date();
    for (const booking of bookings) {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        if (date >= checkIn && date < checkOut) {
            let status = booking.status; // Use the status from the booking object
            return { status, isPast: checkOut < now };
        }
    }
    return { status: 'available', isPast: false };
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
    document.getElementById('currentMonth').textContent = `${monthNames[currentDate.getMonth() ]} ${currentDate.getFullYear()}`;
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

// Function to handle the new booking modal
document.addEventListener('click', function (event) {
    if (event.target && event.target.id === 'newBooking-btn') {
        const newBookingModal = document.getElementById('newBookingModal');
        if (newBookingModal) {
            setTimeout(() => newBookingModal.classList.add('show'), 10);
            newBookingModal.style.display = 'block';
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


function showNewBookingModal(roomNumber, dateString) {

    const row = document.querySelector('.row');
    const date = new Date(dateString);
    const newBookingModal = document.getElementById('newBookingModal');
    if (newBookingModal) {
        setTimeout(() => newBookingModal.classList.add('show'), 10);
        newBookingModal.style.display = 'block';
    }

    const id = 1;
    const startDateInput = row.querySelector(`#startDate-${id}`);
    const endDateInput = row.querySelector(`#endDate-${id}`);
    const roomSelect = row.querySelector(`#roomSelect-${id}`);

    startDateInput.addEventListener('change', () => checkDatesAndPopulateRooms(id));
    endDateInput.addEventListener('change', () => checkDatesAndPopulateRooms(id));

    // inputElementAddRoom.appendChild(row);

    // allRooms();
}

function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

document.addEventListener('DOMContentLoaded', allRooms);

// const addMoreBtn = document.getElementById('add-more-btn');
// const inputElementAddRoom = document.querySelector('.input-element-add-room');
var rowCount = 1;
var rowCountStart = 0;

document.getElementById('add-more-btn').addEventListener('click', function () {
    rowCount++;
    const newRow = createNewRow(rowCount);
    // inputElementAddRoom.appendChild(newRow);
});


function createNewRow(id) {
    const inputElementAddRoom = document.querySelector('.input-element-add-room');
    const row = document.createElement('div');
    row.className = 'row';
    row.id = `room-${id}`;

    row.innerHTML = `
        <div class="input-element">
            <label for="roomSelect-${id}">Room</label>
            <select disabled class="rooms-btn" id="roomSelect-${id}">
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
        updateTotalBookingAmount(); // Update total amount after removing a row
    });

    const startDateInput = row.querySelector(`#startDate-${id}`);
    const endDateInput = row.querySelector(`#endDate-${id}`);
    const roomSelect = row.querySelector(`#roomSelect-${id}`);

    startDateInput.addEventListener('change', () => {
        checkDatesAndPopulateRooms(id);
        updateTotalBookingAmount(); // Update total amount when start date changes
    });
    endDateInput.addEventListener('change', () => {
        checkDatesAndPopulateRooms(id);
        updateTotalBookingAmount(); // Update total amount when end date changes
    });
    roomSelect.addEventListener('change', updateTotalBookingAmount); // Update total amount when room selection changes

    inputElementAddRoom.appendChild(row);
}

initializeFirstRow();

function initializeFirstRow() {
    const rows = document.querySelectorAll('.row');
    const row = rows[0];
    const startDateInput = row.querySelector(`#startDate-1`);
    const endDateInput = row.querySelector(`#endDate-1`);
    const roomSelect = row.querySelector(`#roomSelect-1`);

    // startDateInput.addEventListener('change', () => checkDatesAndPopulateRooms(1));
    // endDateInput.addEventListener('change', () => checkDatesAndPopulateRooms(1));

    startDateInput.addEventListener('change', () => {
        checkDatesAndPopulateRooms(1);
        updateTotalBookingAmount();
    });
    endDateInput.addEventListener('change', () => {
        checkDatesAndPopulateRooms(1);
        updateTotalBookingAmount();
    });
    roomSelect.addEventListener('change', updateTotalBookingAmount);

    // inputElementAddRoom.appendChild(row);
}

function checkDatesAndPopulateRooms(id) {
    const startDate = document.getElementById(`startDate-${id}`).value;
    const endDate = document.getElementById(`endDate-${id}`).value;
    const roomSelect = document.getElementById(`roomSelect-${id}`);

    if (startDate && endDate) {
        roomSelect.disabled = false;
        populateRoomOptions(roomSelect, new Date(startDate), new Date(endDate));
    } else {
        roomSelect.disabled = true;
        roomSelect.innerHTML = '<option selected disabled>Select Room</option>';
    }
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

function populateRoomOptions2(select) {
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

function populateRoomOptions(select, startDate, endDate) {
    const roomList = localStorage.getItem('roomsList');
    if (!roomList) {
        console.error('No roomsList found in localStorage');
        return;
    }

    let roomListObj;
    try {
        roomListObj = JSON.parse(roomList);
    } catch (error) {
        console.error('Error parsing roomsList:', error);
        return;
    }

    // Clear existing options
    select.innerHTML = '<option selected disabled>Select Room</option>';
    console.log("populateRoomOptions")
    // Create options for each room
    roomListObj.forEach(room => {
        const isAvailable = checkRoomAvailability(room, startDate, endDate);
        const option = document.createElement('option');
        option.value = room.id;
        option.textContent = `Room ${room.room_number} - ${room.room_type} ${isAvailable ? '' : '(Occupied)'}`;
        option.disabled = !isAvailable;
        option.dataset.price = room.price;
        select.appendChild(option);
    });

    // Add change event listener to the select
    select.addEventListener('change', function () {
        const selectedRoom = this.value;
        const selectedPrice = this.options[this.selectedIndex].dataset.price;
        console.log(`Selected room: ${selectedRoom}, Price: ${selectedPrice}`);
        updateTotalBookingAmount();
    });
}

function checkRoomAvailability(room, startDate, endDate) {
    return !room.bookings.some(booking => {
        const bookingStart = new Date(booking.start_date);
        const bookingEnd = new Date(booking.end_date);
        return (startDate < bookingEnd && endDate > bookingStart);
    });
}

// Export the initialization function
window.initializeBooking = initializeBooking;


// document.getElementById('new-booking-btn2').addEventListener('click', function (e) {
//     e.preventDefault();
//     const roomRows = document.querySelectorAll('.row');
//     console.log(roomRows)
//     const bookingData = [];

//     roomRows.forEach((row, index) => {
//         const roomSelect = row.querySelector('.rooms-btn');
//         const startDate = row.querySelector('input[name="startDate"]');
//         const endDate = row.querySelector('input[name="endDate"]');

//         if (!roomSelect || !startDate || !endDate) {
//             console.error(`Missing elements in row ${index + 1}:`, {
//                 roomSelect: !!roomSelect,
//                 startDate: !!startDate,
//                 endDate: !!endDate
//             });
//             alert(`Error: Some elements are missing in row ${index + 1}. Please check the console for details.`);
//             return;
//         }

//         if (roomSelect.value && startDate.value && endDate.value) {
//             bookingData.push({
//                 room: roomSelect.value,
//                 startDate: startDate.value,
//                 endDate: endDate.value
//             });
//         } else {
//             console.warn(`Incomplete data in row ${index + 1}:`, {
//                 room: roomSelect.value,
//                 startDate: startDate.value,
//                 endDate: endDate.value
//             });
//             alert(`Please fill all the required fields for room ${index + 1}.`);
//             return;
//         }
//     });

//     if (bookingData.length === 0) {
//         alert("Please add at least one room booking.");
//         return;
//     }

//     console.log("Booking data:", bookingData);
//     // Process or send bookingData as required
// });


function updateTotalBookingAmount2() {
    const roomRows = document.querySelectorAll('.row');
    let totalAmount = 0;

    roomRows.forEach(row => {
        const roomSelect = row.querySelector('.rooms-btn');
        const startDateInput = row.querySelector('input[name="startDate"]');
        const endDateInput = row.querySelector('input[name="endDate"]');

        if (roomSelect.value && startDateInput.value && endDateInput.value) {
            const price = parseFloat(roomSelect.options[roomSelect.selectedIndex].dataset.price);
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);

            // Calculate the number of nights
            const nights = (endDate - startDate) / (1000 * 60 * 60 * 24);

            // Add to total amount
            totalAmount += price * nights;
        }
    });

    // Update the display
    const totalAmountElement = document.querySelector('.total-booking-amount-value');
    if (totalAmountElement) {
        totalAmountElement.textContent = `₹ ${totalAmount.toFixed(2)}`;
    } else {
        console.error('Total amount display element not found');
    }

    // Update advance amount input max value
    const advanceInput = document.getElementById('advance-booking-amount');
    if (advanceInput) {
        advanceInput.max = totalAmount;
    }
}

document.getElementById('new-booking-btn').addEventListener('click', function (e) {
    e.preventDefault();
    console.log("Book btn clicked")
    const roomRows = document.querySelectorAll('.input-element-add-room .row');
    console.log(roomRows);
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
            // Convert dates to the required format
            const formattedStartDate = new Date(startDate.value + 'T12:00:00Z').toISOString();
            const formattedEndDate = new Date(endDate.value + 'T12:00:00Z').toISOString();

            bookingData.push({
                room: roomSelect.value,
                start_date: formattedStartDate,
                end_date: formattedEndDate
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

    const bookingPhone = document.getElementById('bookingPhone').value;
    const bookingEmail = document.getElementById('bookingEmail').value;
    const bookingFname = document.getElementById('bookingFname').value;
    const bookingLname = document.getElementById('bookingLname').value;
    const bookingAddress = document.getElementById('bookingAddress').value;
    const customerState = document.getElementById('customerState').value;
    const customerNationality = document.getElementById('customerNationality').value;
    const customerId = document.getElementById('customerId').value;
    const advanceBookingAmount = document.getElementById('advance-booking-amount').value;

    // If any of the above fields are empty, alert the user
    if (!bookingPhone || !bookingEmail || !bookingFname || !bookingLname || !bookingAddress || !customerState || !customerNationality) {
        if (!bookingPhone) {
            alert("Phone number is required.");
            return;
        }
        if (!bookingEmail) {
            alert("Email is required.");
            return;
        }
        if (!bookingFname) {
            alert("First name is required.");
            return;
        }
        if (!bookingLname) {
            alert("Last name is required.");
            return;
        }
        if (!bookingAddress) {
            alert("Address is required.");
            return;
        }
        if (!customerState) {
            alert("State is required.");
            return;
        }
        if (!customerNationality) {
            alert("Nationality is required.");
            return;
        }
    }

    if (advanceBookingAmount === null) {
        advanceBookingAmount = 0;
    }

    console.log("Booking data:", bookingData);
    // Process or send bookingData as required

    const booking = {
        'phone': bookingPhone,
        'email': bookingEmail,
        'first_name': bookingFname,
        'last_name': bookingLname,
        'address_line_1': bookingAddress,
        'address_line_2': customerState + " , " + customerNationality,
        // 'id': customerId,
        'advance_amount': advanceBookingAmount,
        // 'total_amount': totalBookingAmount,
        'rooms': bookingData,
        'status': 'pending'
    }
    console.log(booking);

    // Create a form data object and add the booking data to it
    const bookingFormData = new FormData();
    bookingFormData.append('phone', bookingPhone);
    bookingFormData.append('email', bookingEmail);
    bookingFormData.append('first_name', bookingFname);
    bookingFormData.append('last_name', bookingLname);
    bookingFormData.append('address_line_1', bookingAddress);
    bookingFormData.append('address_line_2', customerState + " , " + customerNationality);
    bookingFormData.append('advance_amount', advanceBookingAmount);
    bookingFormData.append('status', 1);
    bookingFormData.append('rooms', JSON.stringify(bookingData));

    console.log("FormData:", JSON.stringify(bookingFormData));

    for (let [key, value] of bookingFormData.entries()) {
        console.log(key, value);
    }

    submitBooking(bookingFormData);

    // POST call to API for booking
    function submitBooking(booking) {

        console.log("Booking data from submitBooking:", booking);

        const options = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getCookie('access_token'),
            },
            body: booking,
        };

        const url = `${baseURL}hotel/bookings/`;

        console.log("Booking data from submitBooking:", booking);
        refreshAccessToken2(url, options)
            // .then(response => response.json())
            .then(data => {
                console.log('Booked Data:', data);
                console.table(data);
                alert("Booked Successfully");
                window.location.href = '/hotel/hotel.html';
            })
            .catch(error => {
                console.log('Error fetching booked data:', error);
            });

    }

});

function updateTotalBookingAmount3() {
    const roomRows = document.querySelectorAll('.input-element-add-room .row');
    let totalAmount = 0;

    roomRows.forEach(row => {
        const roomSelect = row.querySelector('.rooms-btn');
        const startDateInput = row.querySelector('input[name="startDate"]');
        const endDateInput = row.querySelector('input[name="endDate"]');

        if (roomSelect.value && startDateInput.value && endDateInput.value) {
            const price = parseFloat(roomSelect.options[roomSelect.selectedIndex].dataset.price);
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);

            // Calculate the number of nights
            const nights = (endDate - startDate) / (1000 * 60 * 60 * 24);

            // Add to total amount
            totalAmount += price * nights;
        }
    });

    // Update the display
    const totalAmountElement = document.querySelector('.total-booking-amount-value');
    if (totalAmountElement) {
        totalAmountElement.textContent = `₹ ${totalAmount.toFixed(2)}`;
    } else {
        console.error('Total amount display element not found');
    }

    // Update advance amount input max value
    const advanceInput = document.getElementById('advance-booking-amount');
    if (advanceInput) {
        advanceInput.max = totalAmount;
    }
}

function updateTotalBookingAmount() {
    const roomRows = document.querySelectorAll('.input-element-add-room .row');
    let totalAmount = 0;

    roomRows.forEach(row => {
        const roomSelect = row.querySelector('.rooms-btn');
        const startDateInput = row.querySelector('input[name="startDate"]');
        const endDateInput = row.querySelector('input[name="endDate"]');

        if (roomSelect.value && startDateInput.value && endDateInput.value) {
            const price = parseFloat(roomSelect.options[roomSelect.selectedIndex].dataset.price);
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);

            // Calculate the number of nights
            const nights = (endDate - startDate) / (1000 * 60 * 60 * 24);

            // Add to total amount
            totalAmount += price * nights;
        }
    });

    // Update the display
    const totalAmountElement = document.querySelector('.total-booking-amount-value');
    if (totalAmountElement) {
        totalAmountElement.textContent = `₹ ${totalAmount.toFixed(2)}`;
    } else {
        console.error('Total amount display element not found');
    }

    // Update advance amount input max value
    const advanceInput = document.getElementById('advance-booking-amount');
    if (advanceInput) {
        advanceInput.max = totalAmount;
    }
}
// range of dates should be disabled and occupied

// const bookingPhone = document.getElementById('bookingPhone');
// const bookingEmail = document.getElementById('bookingEmail');
// const bookingFname = document.getElementById('bookingFname');
// const bookingLname = document.getElementById('bookingLname');
// const bookingAddress = document.getElementById('bookingAddress');
// const customerState = document.getElementById('customerState');
// const customerNationality = document.getElementById('customerNationality');
// const customerStateDiv = document.getElementById('customerState-div');
// const stateInputSelect = document.getElementById('state-input-select');

// const stateInput = document.createElement('input');
// stateInput.type = 'text';
// stateInput.name = 'customerState';
// stateInput.id = 'customerState';
// stateInput.placeholder = 'State, Country';

// Configure bookingPhone
document.getElementById('bookingPhone').addEventListener('input', function () {
    if (bookingPhone.value.length > 10) {
        bookingPhone.value = bookingPhone.value.slice(0, 10);
    }
});

// Configure customerNationality
document.getElementById('customerNationality').addEventListener('change', function () {
    const stateInputSelect = document.getElementById('state-input-select');

    if (customerNationality.value === 'others') {
        stateInputSelect.innerHTML = '';
        stateInputSelect.appendChild(createStateInput());


    } else if (customerNationality.value === 'indian') {
        stateInputSelect.innerHTML = '';
        stateInputSelect.appendChild(createStateDropdown());
    }
});


// Function to create and append options
function createOptions(groupLabel, options, selectElement) {
    const optgroup = document.createElement('optgroup');
    optgroup.label = groupLabel;
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.text;
        optgroup.appendChild(opt);
    });
    selectElement.appendChild(optgroup);
}

// Create select element dynamically
function createStateDropdown() {

    const statesAndUTs = {
        "States": [
            { value: "andhra_pradesh", text: "Andhra Pradesh" },
            { value: "arunachal_pradesh", text: "Arunachal Pradesh" },
            { value: "assam", text: "Assam" },
            { value: "bihar", text: "Bihar" },
            { value: "chhattisgarh", text: "Chhattisgarh" },
            { value: "goa", text: "Goa" },
            { value: "gujarat", text: "Gujarat" },
            { value: "haryana", text: "Haryana" },
            { value: "himachal_pradesh", text: "Himachal Pradesh" },
            { value: "jharkhand", text: "Jharkhand" },
            { value: "karnataka", text: "Karnataka" },
            { value: "kerala", text: "Kerala" },
            { value: "madhya_pradesh", text: "Madhya Pradesh" },
            { value: "maharashtra", text: "Maharashtra" },
            { value: "manipur", text: "Manipur" },
            { value: "meghalaya", text: "Meghalaya" },
            { value: "mizoram", text: "Mizoram" },
            { value: "nagaland", text: "Nagaland" },
            { value: "odisha", text: "Odisha" },
            { value: "punjab", text: "Punjab" },
            { value: "rajasthan", text: "Rajasthan" },
            { value: "sikkim", text: "Sikkim" },
            { value: "tamil_nadu", text: "Tamil Nadu" },
            { value: "telangana", text: "Telangana" },
            { value: "tripura", text: "Tripura" },
            { value: "uttar_pradesh", text: "Uttar Pradesh" },
            { value: "uttarakhand", text: "Uttarakhand" },
            { value: "west_bengal", text: "West Bengal" }
        ],
        "Union Territories": [
            { value: "andaman_and_nicobar_islands", text: "Andaman and Nicobar Islands" },
            { value: "chandigarh", text: "Chandigarh" },
            { value: "dadra_and_nagar_haveli_and_daman_and_diu", text: "Dadra and Nagar Haveli and Daman and Diu" },
            { value: "delhi", text: "Delhi" },
            { value: "lakshadweep", text: "Lakshadweep" },
            { value: "puducherry", text: "Puducherry" },
            { value: "ladakh", text: "Ladakh" },
            { value: "jammu_and_kashmir", text: "Jammu and Kashmir" }
        ]
    };

    const selectElement = document.createElement('select');
    selectElement.name = "customerState";
    selectElement.id = "customerState";

    // Add the default option
    const defaultOption = document.createElement('option');
    defaultOption.selected = true;
    defaultOption.disabled = true;
    defaultOption.textContent = "Select State";
    selectElement.appendChild(defaultOption);

    // Create states options
    createOptions("States", statesAndUTs.States, selectElement);

    // Create union territories options
    createOptions("Union Territories", statesAndUTs["Union Territories"], selectElement);

    return selectElement;
}

function createStateInput() {
    const stateInput = document.createElement('input');
    stateInput.type = 'text';
    stateInput.name = 'customerState';
    stateInput.id = 'customerState';
    stateInput.placeholder = 'State, Country';
    return stateInput;
}




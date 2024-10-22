document.getElementById('viewToggle').addEventListener('click', function () {
    const viewToggle = document.getElementById('viewToggle');
    const calendarWrapper = document.querySelector('.calender-wrapper');
    const listviewWrapper = document.querySelector('.listview-wrapper');
    const toggleText = document.querySelector('.toggle-text');

    viewToggle.addEventListener('change', function () {
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

// document.getElementById('viewToggle').click();

function populateListView() {
    convertToRequiredFormat_ListView();
}

// JSON formating for List View
async function convertToRequiredFormat_ListView() {
    try {
        const apiDataString = await getAllBookings();
        // console.log(`apiDataString: ${JSON.stringify(apiDataString)}`);
        if (!apiDataString || apiDataString.length === 0) {
            console.log('No data found');
            return {};
        }

        let apiData;
        try {
            apiData = JSON.parse(apiDataString);
            console.log(`apiData: ${apiData}`);
        } catch (error) {
            console.error('Error parsing bookingsList data:', error);
            return {};
        }

        // Get roomsList from localStorage and parse it
        const roomsListString = localStorage.getItem('roomsList');
        let roomsList;
        try {
            roomsList = JSON.parse(roomsListString);
        } catch (error) {
            console.error('Error parsing roomsList:', error);
            return {};
        }

        // Create a map of room ID to room number
        const roomIdToNumberMap = {};
        roomsList.forEach(room => {
            roomIdToNumberMap[room.id] = room.room_number;
        });

        const allBookings = {};
        const currentDate = new Date();

        apiData.forEach(booking => {
            booking.rooms.forEach(room => {
                const roomNumber = roomIdToNumberMap[room.room]; // Map room ID to room number
                if (!roomNumber) {
                    console.warn(`Room number not found for room ID: ${room.room}`);
                    return; // Skip this room if we can't find its number
                }

                if (!allBookings[roomNumber]) {
                    allBookings[roomNumber] = [];
                }

                const guestDetail = booking.guest_detail[0]; // Assuming there's always at least one guest
                const checkIn = new Date(room.start_date);
                const checkOut = new Date(room.end_date);
                const bookingDate = new Date(booking.booking_date);

                let status;
                if (booking.status === 'pending') {
                    if (room.start_date > currentDate.toISOString()) {
                        status = 'pending';
                    } else if (room.start_date < currentDate.toISOString()) {
                        status = 'noshow';
                    }
                } else if (room.check_in_details && room.check_out_date) {
                    status = 'checkout';
                } else if (room.check_in_details && !room.check_out_date) {
                    status = 'checkin';
                } else if (booking.status === 'confirmed') {
                    status = 'confirmed'
                }

                allBookings[roomNumber].push({
                    guestName: `${guestDetail.first_name} ${guestDetail.last_name}`,
                    age: 25, // Placeholder as age is not provided
                    email: guestDetail.email,
                    bookingDate: bookingDate, //how to get the bookingDate
                    phoneNumber: guestDetail.phone,
                    checkIn: checkIn,
                    checkOut: checkOut,
                    status: status
                });
            });
        });

        console.table('allBookings:', allBookings);
        renderListView(allBookings);
        // return allBookings;
    } catch (error) {
        console.error('Error in convertToRequiredFormat_ListView:', error);
        return {};
    }
}

// GET API Call to get all bookings and storing in Local
function getAllBookings() {
    const option = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    }
    url = `${baseURL}hotel/bookings/`;
    return refreshAccessToken2(url, option)
        .then(data => {
            console.log('Bookings Data:', data);
            localStorage.setItem('bookingsList', JSON.stringify(data));
            // return data;
            return JSON.stringify(data); // Return stringified data
        })
        .catch(error => {
            console.log('Error fetching table:', error);
            throw error; // Re-throw the error to be caught in the calling function
        });
}

// Rendering List View
function renderListView(allBookings) {
    const listviewWrapper = document.querySelector('.booking-list-body');
    listviewWrapper.innerHTML = ''; // Clear existing content

    // Display booking details for each booking in each room and sort by date
    for (const roomNumber in allBookings) {
        const bookings = allBookings[roomNumber];
        console.log(bookings);
        bookings.sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));

        bookings.forEach(booking => {
            const roomDiv = document.createElement('div');
            roomDiv.classList.add('row');
            roomDiv.innerHTML = `
                <div class="col-1">${roomNumber}</div>
                <div class="col-2">${booking.bookingDate.toLocaleString()}</div>
                <div class="col-2">${booking.guestName}</div>
                <div class="col-2">${booking.checkIn.toLocaleString()}</div>
                <div class="col-2">${booking.checkOut.toLocaleString()}</div>
                <div class="col-1 status-${booking.status}">${booking.status}</div>
                <div class="col-1 "> <i class="fa-solid fa-eye eye" id="eye"></i> </div>
            `;
            listviewWrapper.appendChild(roomDiv);
        });
    }
}

var currentDate = new Date();

// JSON formating for calender
function convertToRequiredFormat() {
    const bookingsData = JSON.parse(localStorage.getItem('bookingsList'));
    const roomsList = JSON.parse(localStorage.getItem('roomsList'));

    if (!bookingsData || !roomsList) {
        console.log('No data found');
        return {};
    }

    // Create a map of room ID to room number
    const roomIdToNumberMap = {};
    roomsList.forEach(room => {
        roomIdToNumberMap[room.id] = room.room_number;
    });

    console.log(`roomIdToNumberMap: ${roomIdToNumberMap}`);

    // null is used for replacing values (not needed here).
    // 2 is the number of spaces for indentation, which makes it more readable.
    console.log(JSON.stringify(roomIdToNumberMap, null, 2));
    console.log(JSON.stringify(roomIdToNumberMap));


    const roomBookings = {};
    const currentDate = new Date();

    bookingsData.forEach(booking => {
        booking.rooms.forEach(room => {
            const roomNumber = roomIdToNumberMap[room.room];
            console.log(`roomNumber: ${roomNumber}`);
            if (!roomNumber) {
                console.warn(`Room number not found for room ID: ${room.room}`);
                return;
            }

            if (!roomBookings[roomNumber]) {
                roomBookings[roomNumber] = [];
            }

            const guestDetail = booking.guest_detail[0]; // Assuming there's always at least one guest
            const checkInDate = new Date(room.start_date);
            const checkOutDate = new Date(room.end_date);
            let status;

            console.log(room.start_date);
            console.log(currentDate);

            if (booking.status === 'pending') {
                if (room.start_date > currentDate.toISOString()) {
                    status = 'pending';
                } else if (room.start_date < currentDate.toISOString()) {
                    status = 'noshow';
                }
            } else if (room.check_in_details && room.check_out_date) {
                status = 'checkout';
            } else if (room.check_in_details && !room.check_out_date) {
                status = 'checkin';
            } else if (booking.status === 'confirmed') {
                status = 'confirmed'
            }

            roomBookings[roomNumber].push({
                guestName: `${guestDetail.first_name} ${guestDetail.last_name}`,
                age: 25, // Placeholder as age is not provided
                email: guestDetail.email,
                phoneNumber: guestDetail.phone,
                checkIn: checkInDate,
                checkOut: checkOutDate,
                status: status,
                bookingDate: new Date(booking.booking_date),
                bookingId: booking.id
            });
        });
    });

    // Sort bookings for each room by check-in date
    for (const roomNumber in roomBookings) {
        roomBookings[roomNumber].sort((a, b) => a.checkIn - b.checkIn);
    }

    console.log('roomBookings:', roomBookings);
    return roomBookings;
}

// Converting API response to the desired format
var roomBookings = convertToRequiredFormat();
console.log(roomBookings);

// Instead of using forEach, we'll use Object.entries to iterate over the object
Object.entries(roomBookings).forEach(([roomNumber, bookings]) => {
    console.log(`Room ${roomNumber}:`);
    console.table(bookings);
});

// Sample JSON format for calender
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

// Generate Calender
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

// Generate Day Cells for each rooms in calender
function generateDayCells(roomNumber, date) {
    let cellContent = '<div class="day-cell">';
    for (let hour = 0; hour < 24; hour++) {
        const cellDate = new Date(date);
        cellDate.setHours(hour);
        const bookingInfo = getBookingInfo(roomNumber, cellDate);
        let cellClass = 'available';

        if (bookingInfo) {
            switch (bookingInfo.status) {
                case 'booked':
                    cellClass = 'booked';
                    break;
                case 'checkin':
                    cellClass = 'checkin';
                    break;
                case 'checkout':
                    cellClass = 'checkout';
                    break;
                case 'pending':
                    cellClass = 'pending';
                    break;
                case 'noshow':
                    cellClass = 'noshow';
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

// Finding Booking Info from JSON for a Room with a particular Date
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
    if (!bookings) return { status: 'available', isPast: false };

    const now = new Date();
    for (const booking of bookings) {
        if (date >= booking.checkIn && date < booking.checkOut) {
            if (booking.status === 'checkout') {
                return { status: 'checkout', isPast: booking.checkOut < now };
            } else if (booking.status === 'checkin') {
                return { status: 'checkin', isPast: booking.checkOut < now };
            } else {
                return { status: 'booked', isPast: booking.checkOut < now };
            }
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

// Show booking details modal
function showBookingModal(roomNumber, dateString) {
    const date = new Date(dateString);
    const bookingInfo = getBookingInfo(roomNumber, date);
    console.table(bookingInfo);

    if (bookingInfo) {
        console.log(bookingInfo);
        let modalContent = `
            <h2>Booking Details</h2>
            <p><strong>Room Number:</strong> ${roomNumber}</p>
            <p><strong>Guest Name:</strong> ${bookingInfo.guestName}</p>
            <!--<p><strong>Age:</strong> ${bookingInfo.age}</p>-->
            <p><strong>Email:</strong> ${bookingInfo.email}</p>
            <p><strong>Phone Number:</strong> ${bookingInfo.phoneNumber}</p>
            <p><strong>Start-Date&Time:</strong> ${formatDate(bookingInfo.checkIn)}</p>
            <p><strong>End-Date&Time:</strong> ${formatDate(bookingInfo.checkOut)}</p>
        `;
        if (bookingInfo.status === 'pending' || bookingInfo.status === 'noshow') {
            modalContent += `
                <p><strong>Status:</strong> ${bookingInfo.status}</p>
            `;
            const checkInBtn = document.createElement('button');
            checkInBtn.className = 'btn-checkin';
            checkInBtn.id = 'btn-checkin';
            checkInBtn.textContent = 'Check-In';
            // checkInBtn.addEventListener('click', () => checkInBooking(bookingInfo));
            // checkInBtn.onclick = () => checkInBooking(bookingInfo);
            modalContent += checkInBtn.outerHTML;

        }
        if (bookingInfo.status === 'checkin') {
            modalContent += `
                <p><strong>Status:</strong> ${bookingInfo.status}</p>
                <button class="btn-checkout" id="btn-checkout" onclick="checkOutBooking();">Check-Out</button>
            `;
        }

        const modal = document.getElementById('bookingModal');
        const modalBody = modal.querySelector('.modal-body');
        setTimeout(() => modal.classList.add('show'), 10);

        modalBody.innerHTML = modalContent;

        modal.style.display = 'block';
    }

    // Adding event listener to check-in button inside booking details modal
    document.getElementById('btn-checkin').addEventListener('click', () => checkInBooking(bookingInfo, roomNumber));

}

// Onclick action for CheckIn from Booking details modal
function checkInBooking(bookingInfo, roomNumber) {
    renderCheckinModal(bookingInfo, roomNumber);
    // let modalContent = ` `;
    console.log("Check-In btn clicked");
    const modal = document.getElementById('checkinModal');
    const modalBody = modal.querySelector('.modal-body');
    setTimeout(() => modal.classList.add('show'), 10);

    // modalBody.innerHTML = modalContent;

    modal.style.display = 'block';
}

// Render data in Check-In Modal
function renderCheckinModal(bookingInfo, roomNumber) {
    // console.log(JSON.stringify(bookingInfo, null, 2));

    console.log(bookingInfo);
    console.log(bookingInfo.bookingId);

    const dataById = getBookingById(bookingInfo.bookingId);

    dataById.then(result => {
        console.log('Raw JSON string:', result);
        putBookingDataInModal(result, roomNumber)

        console.log('Booking ID:', result.id);
        console.log('Booking ID:', result.booking_date);
    }).catch(error => {
        console.error('Error fetching booking data:', error);
    });

    function putBookingDataInModal(result, roomNumber) {

        // // fetch id of roomNumber from local storage roomsList
        const roomsListString = localStorage.getItem('roomsList');
        const roomsList = JSON.parse(roomsListString);
        const room = roomsList.find(room => room.room_number == roomNumber);

        let roomId;
        if (room) {
            roomId = room.id; // Get the room ID
            console.log("Room ID:", roomId);
        } else {
            console.error("Room not found for room number:", roomNumber);
        }

        console.log("Line 559")


        const roomNumberId = document.getElementById('cim-roomNumber');
        const checkinDateTime = document.getElementById('cim-checkinDateTime');
        const firstName = document.getElementById('cim-firstName');
        const lastName = document.getElementById('cim-lastName');
        const phone = document.getElementById('cim-guestphone');
        const email = document.getElementById('cim-guestemail');

        roomNumberId.value = roomNumber;
        roomNumberId.dataset.roomId = roomId;
        roomNumberId.dataset.bookingId = bookingInfo.bookingId;
        firstName.value = result.guest_detail[0].first_name;
        lastName.value = result.guest_detail[0].last_name;
        phone.value = result.guest_detail[0].phone;
        email.value = result.guest_detail[0].email;
    }

}

// Get Booking Data by ID: GET API Call
function getBookingById(bookingId) {
    const option = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        }
    }
    url = `${baseURL}hotel/bookings/${bookingId}`;
    return refreshAccessToken2(url, option)
        .then(data => {
            console.log('Bookings Data by ID:', data);
            return data;
            // return JSON.stringify(data); // Return stringified data
        })
        .catch(error => {
            console.log('Error fetching table:', error);
            throw error; // Re-throw the error to be caught in the calling function
        });
}

// Onclick action for Add more guest info row in Check-In Modal
document.getElementById('add-more-btn-checkin').addEventListener('click', function () {
    addGuestInfoRow();
});

// Add new guest info row in Check-In Modal
function addGuestInfoRow() {
    // Create a new div for the guest info row
    const newRow = document.createElement('div');
    newRow.className = 'row-block';

    // Set the inner HTML for the new row
    newRow.innerHTML = `
        <div class="input-element-checkin">
            <label for="cim-firstName">First Name</label>
            <input type="text" id="cim-firstName" name="firstName" placeholder="First Name" required>
        </div>
        <div class="input-element-checkin">
            <label for="cim-lastName">Last Name</label>
            <input type="text" id="cim-lastName" name="lastName" placeholder="Last Name" required>
        </div>
        <div class="input-element-checkin sm">
            <label for="cim-guestphone">Guest Phone</label>
            <input type="text" id="cim-guestphone" name="guestphone" placeholder="Guest Phone" required>
        </div>
        <div class="input-element-checkin sm">
            <label for="cim-guestemail">Guest Email</label>
            <input type="email" id="cim-guestemail" name="guestemail" placeholder="Guest Email" required>
        </div>
        <div class="input-element-checkin sm">
            <label for="cim-dob">D.O.B.</label>
            <input type="date" id="cim-dob" name="dob" required>
        </div>
        <div class="input-element-checkin lg">
            <label for="cim-address-1">Full Address</label>
            <textarea type="text" id="cim-address-1" name="address-1" placeholder="Full Address" required rows="3" ></textarea>
        </div>
        <div class="input-element-checkin">
            <label for="cim-customerNationality">Nationality</label>
            <select name="" id="cim-customerNationality">
                <option value="" selected disabled>Select Nationality</option>
                <option value="indian">Indian</option>
                <option value="others">Others</option>
            </select>
        </div>
        <div class="input-element-checkin" id="customerState-div">
            <label for="cim-customerState">State / Province</label>
            <div id="state-input-select">
                <select name="customerState" id="cim-customerState">
                    <option selected disabled>Select State</option>
                    <!-- States -->
                    <option value="andhra_pradesh">Andhra Pradesh</option>
                    <option value="arunachal_pradesh">Arunachal Pradesh</option>
                    <option value="assam">Assam</option>
                    <option value="bihar">Bihar</option>
                    <option value="chhattisgarh">Chhattisgarh</option>
                    <option value="goa">Goa</option>
                    <option value="gujarat">Gujarat</option>
                    <option value="haryana">Haryana</option>
                    <option value="himachal_pradesh">Himachal Pradesh</option>
                    <option value="jharkhand">Jharkhand</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="kerala">Kerala</option>
                    <option value="madhya_pradesh">Madhya Pradesh</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="manipur">Manipur</option>
                    <option value="meghalaya">Meghalaya</option>
                    <option value="mizoram">Mizoram</option>
                    <option value="nagaland">Nagaland</option>
                    <option value="odisha">Odisha</option>
                    <option value="punjab">Punjab</option>
                    <option value="rajasthan">Rajasthan</option>
                    <option value="sikkim">Sikkim</option>
                    <option value="tamil_nadu">Tamil Nadu</option>
                    <option value="telangana">Telangana</option>
                    <option value="tripura">Tripura</option>
                    <option value="uttar_pradesh">Uttar Pradesh</option>
                    <option value="uttarakhand">Uttarakhand</option>
                    <option value="west_bengal">West Bengal</option>
                    <!-- Union Territories -->
                    <option value="andaman_and_nicobar_islands">Andaman and Nicobar Islands</option>
                    <option value="chandigarh">Chandigarh</option>
                    <option value="dadra_and_nagar_haveli_and_daman_and_diu">Dadra and Nagar Haveli and Daman and Diu</option>
                    <option value="delhi">Delhi</option>
                    <option value="lakshadweep">Lakshadweep</option>
                    <option value="puducherry">Puducherry</option>
                    <option value="ladakh">Ladakh</option>
                    <option value="jammu_and_kashmir">Jammu and Kashmir</option>
                </select>
            </div>
        </div>
        
        <div class="input-element-checkin">
            <label for="cim-coming">Coming from</label>
            <input type="text" id="cim-coming" name="coming" placeholder="Coming from" required>
        </div>
        <div class="input-element-checkin">
            <label for="cim-going">Going to</label>
            <input type="text" id="cim-going" name="going" placeholder="Going to" required>
        </div>
        <div class="input-element-checkin">
            <label for="cim-purpose">Purpose of Visit</label>
            <input type="text" id="cim-purpose" name="purpose" placeholder="Purpose of Visit" required>
        </div>
        <i class="fa-solid fa-circle-minus fa-2x remove-info-btn"></i>
    `;

    // Append the new row to the guest info section
    const guestInfoRow = document.getElementById('checkin-form');
    guestInfoRow.appendChild(newRow);

    // Add event listener to the remove button
    newRow.querySelector('.remove-info-btn').addEventListener('click', function () {
        guestInfoRow.removeChild(newRow);
    });
}


// Onclick action for CheckIn from Check-In Modal
document.getElementById('checkin-btn').addEventListener('click', checkInSubmit);

function checkInSubmit2() {

    const roomNumber = document.getElementById('cim-roomNumber').value;
    const checkinDateTime = document.getElementById('cim-checkinDateTime').value;

    console.log("Check-In btn clicked");
}

function checkInSubmit() {
    const roomNumber = document.getElementById('cim-roomNumber').value;
    const roomId = document.getElementById('cim-roomNumber').dataset.roomId;
    const bookingId = document.getElementById('cim-roomNumber').dataset.bookingId;
    const checkinDateTime = document.getElementById('cim-checkinDateTime').value;
    const checkinDateTimeISO = new Date(checkinDateTime).toISOString();

    // Get all guest info rows
    const guestInfoRows = document.querySelectorAll('.row-block');
    // const guestInfoRows = document.querySelectorAll('#guest-info-row-checkin .row-block');
    const guestsData = [];

    guestInfoRows.forEach((row, index) => {
        const firstName = row.querySelector('input[name="firstName"]');
        const lastName = row.querySelector('input[name="lastName"]');
        const guestPhone = row.querySelector('input[name="guestphone"]');
        const guestEmail = row.querySelector('input[name="guestemail"]');
        const guestDOB = row.querySelector('input[name="dob"]');
        const nationality = row.querySelector('#cim-customerNationality');
        const customerState = row.querySelector('#cim-customerState');
        const address = row.querySelector('#cim-address-1');
        const comingFrom = row.querySelector('input[name="coming"]');
        const goingTo = row.querySelector('input[name="going"]');
        const purpose = row.querySelector('input[name="purpose"]');
        const idcard = row.querySelector('input[name="idcard"]');
        // if any data missing show alert
        if (!firstName || !lastName || !guestPhone || !guestEmail || !nationality || !customerState || !comingFrom || !goingTo || !purpose) {
            console.log(`Missing element in row ${index + 1}:`, {
                firstName: !!firstName,
                lastName: !!lastName,
                guestPhone: !!guestPhone,
                guestEmail: !!guestEmail,
                address_line_1: !!address,
                nationality: !!nationality,
                customerState: !!customerState,
            });
            alert(`Error: Some elements are missing in row ${index + 1}. Please check the console for details.`);
            return;
        }

        if (firstName.value && lastName.value && guestPhone.value && guestEmail.value && nationality.value && customerState.value && comingFrom.value && goingTo.value && purpose.value) {
            guestsData.push({
                first_name: firstName.value,
                last_name: lastName.value,
                phone: guestPhone.value,
                email: guestEmail.value,
                address_line_1: address.value,
                address_line_2: nationality.value + ' ' + customerState.value,
                coming_from: comingFrom.value,
                going_to: goingTo.value,
                purpose: purpose.value,
                dob: guestDOB.value,
                foreigner: nationality.value === 'others' ? true : false,
                // guest_id: idcard.value,

            })
        } else {
            console.warn(`Incomplete data in row ${index + 1}:`, {
                firstName: firstName.value,
                lastName: lastName.value,
                guestPhone: guestPhone.value,
                guestEmail: guestEmail.value,
            });
            alert(`Please fill all the required fields for row ${index + 1}.`);
            return;
        }

    });

    console.log("Guests Data:", guestsData);

    // Create the final check-in object
    const checkInData = {
        booking_id: bookingId,
        room_id : roomId,
        check_in_date: checkinDateTimeISO,
        guests: guestsData
    };
    console.log("Check-In Data:", JSON.stringify(checkInData, null, 2));

    console.log(`Room Number: ${roomNumber}`);
    console.log(`Check-In Date and Time: ${checkinDateTime}`);
}

// Close action for checkin modal
document.querySelector('.close3').onclick = function () {
    const modal = document.getElementById('checkinModal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

// Onclick action for CheckOut from Booking details modal
function checkOutBooking() {
    console.log("Check-Out btn clicked");
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
                room: parseInt(roomSelect.value),
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
    bookingFormData.append('status', 'pending');
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
                // console.log(response.status);
                alert("Booked Successfully");
                // window.location.href = '/hotel/hotel.html';
            })
            .catch(error => {
                console.log('Error fetching booked data:', error);
            });

    }

});


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



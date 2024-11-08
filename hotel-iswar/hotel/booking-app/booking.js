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

getAllBookings();

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
                    status: status,
                    bookingId: booking.id
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
        console.table(bookings);
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
                <div class="col-1 "> <i class="fa-solid fa-eye eye" id="eye-${booking.id}"></i> </div>
            `;
            listviewWrapper.appendChild(roomDiv);

            // Add onclick event to the eye icon
            const eyeIcon = roomDiv.querySelector(`#eye-${booking.id}`);
            eyeIcon.addEventListener('click', function () {
                // Call the function to show booking details
                showBookingModalListView(roomNumber, booking.bookingId);
            });

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

function formatDate2(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);

    // Format date as dd/mm/yyyy
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    // Format time in 12-hour format with AM/PM
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
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

// Function to toggle booking details
function toggleBookingDetails(booking) {
    // Implement the logic to show/hide booking details
    console.log("Toggling details for booking:", booking);
    // You can add logic here to display or hide additional information about the booking
}

function showBookingModalListView(roomNumber, bookingId) {
    console.log("showBookingModalListView called");
    console.log(roomNumber);
    console.log(bookingId);
    console.log(roomBookings);

    // Find the booking in the roomBookings object
    const booking = roomBookings[roomNumber].find(booking => booking.bookingId === bookingId);
    console.log(booking);
    loadBookingModal(booking, roomNumber);
}

// Show booking details modal
function showBookingModal(roomNumber, dateString) {
    console.log("showBookingModal called");
    console.log(roomNumber);
    console.log(dateString);

    const date = new Date(dateString);
    console.log(date);
    const bookingInfo = getBookingInfo(roomNumber, date);
    console.table(bookingInfo);
    loadBookingModal(bookingInfo, roomNumber);
}

function loadBookingModal(bookingInfo, roomNumber) {
    if (bookingInfo) {
        console.log(bookingInfo);
        let modalContent = `
            
            <div class="booking-modal-data">
                <p><div class="booking-data-head">Booking Id:</div>  ${bookingInfo.bookingId}</p>
                <p><div class="booking-data-head">Room No:</div> ${roomNumber}</p>
                <p><div class="booking-data-head">Guest Name:</div> ${bookingInfo.guestName}</p>
                <!--<p><strong>Age:</strong> ${bookingInfo.age}</p>-->
                <p><div class="booking-data-head">Email:</div> ${bookingInfo.email}</p>
                <p><div class="booking-data-head">Phone:</div> ${bookingInfo.phoneNumber}</p>
                <p><div class="booking-data-head">Start-Date & Time:</div> ${formatDate(bookingInfo.checkIn)}</p>
                <p><div class="booking-data-head">End-Date & Time:</div> ${formatDate(bookingInfo.checkOut)}</p>
                <p><div class="booking-data-head">Status:</div> ${bookingInfo.status}</p>
            </div>
        `;


        if (bookingInfo.bookingId) {
            // Map room number with room id from local storage roomsList
            const roomsListString = localStorage.getItem('roomsList');
            const roomsList = JSON.parse(roomsListString);
            const room = roomsList.find(room => room.room_number == roomNumber);
            const roomId = room.id;

            // Get booking data from API by id
            // const bookingData = getBookingById(bookingInfo.bookingId);
            // console.log(bookingData);

            // Get booking data from local storage
            const bookingData = localStorage.getItem('bookingsList');
            const bookingDataObj = JSON.parse(bookingData);
            console.warn(bookingDataObj);

            const booking = bookingDataObj.find(booking => booking.id === bookingInfo.bookingId);
            console.warn(booking);

            console.log(roomId, roomNumber);


            // Display services booking and orders assosiated with booking

            // Display each service usage
            booking.rooms.forEach(room => {
                console.log(room);
                if (room.room == roomId && room.service_usages.length > 0) { // Check if the room ID matches
                    console.log(room);
                    modalContent += `<div class="booking-data-head">Services:</div>`;
                    room.service_usages.forEach(service => {
                        modalContent += `
                        <ul class="service-list">
                    <li>
                        <strong>Service Name:</strong> ${service.service_name} 
                        
                        <i class="fas fa-trash services-del" id="services-del" data-service-id="${service.id}"></i><br> 
                        
                        <strong>Usage Date:</strong> ${new Date(service.usage_date).toLocaleString()} <br>
                        
                        
                    </li></ul>
                `;
                    });
                }
            });


            // Display each order
            booking.rooms.forEach(room => {
                if (room.room === roomId && room.orders.length > 0) { // Check if the room ID matches
                    modalContent += `<div class="booking-data-head">Food Orders:</div>`;
                    room.orders.forEach(order => {
                        // Get food items list from localStorage
                        const allFoodList = JSON.parse(localStorage.getItem('allFoodList'));

                        // Create food items display string
                        const foodItemsDisplay = order.food_items.map((foodId, index) => {
                            const foodItem = allFoodList.find(item => item.id === foodId);
                            return `${foodItem.name.padEnd(20, '  ')} <div class="modal-qty">x${order.quantity[index]}</div>`;
                        }).join('<br>');

                        modalContent += `
                                <ul class="order-list"><li>
                                    <strong>Order ID:</strong> <div class="bookingmodal-data">${order.id} </div>
                                        <br>

                                    <strong>Food Items:</strong><br><div class="modal-food">${foodItemsDisplay}</div><br>

                                    <strong>Total Price:</strong><div class="bookingmodal-data"> ₹${order.total} (without GST)</div><br>
                                    <strong>Order Status:</strong><div class="bookingmodal-data"> ${order.status} </div><br>
                                    <strong>Ordered At:</strong><div class="bookingmodal-data"> ${new Date(order.created_at).toLocaleString()} </div><br>
                                    <a href="./../restaurant/takeorder/takeorder.html?orderId=${order.id}&room=${bookingInfo.bookingId}&orderType=hotel"><br>
                                        <i class="fas fa-edit booking-eye-order" data-status="${order.status}"></i>
                                    </a>
                                    <button class="serve-btn" id="serve-btn" data-order-id="${order.id}" data-status="${order.status}">Serve</button><br>
                                </li></ul>
                            `;

                    });
                }
            });



        }

        if (bookingInfo.status === 'pending' || bookingInfo.status === 'noshow') {
            // modalContent += `
            //     <p><strong>Status:</strong> ${bookingInfo.status}</p>
            // `;
            const checkInBtn = document.createElement('button');
            checkInBtn.className = 'btn-checkin';
            checkInBtn.id = 'btn-checkin';
            checkInBtn.textContent = 'Check-In';
            // checkInBtn.addEventListener('click', () => checkInBooking(bookingInfo, roomNumber));
            checkInBtn.onclick = () => checkInBooking(bookingInfo, roomNumber);
            modalContent += checkInBtn.outerHTML;

        }


        if (bookingInfo.status === 'checkin') {
            // modalContent += `
            //     <p><strong>Status:</strong> ${bookingInfo.status}</p>
            // `;

            const checkoutBtn = document.createElement('button');
            checkoutBtn.className = 'btn-checkout';
            checkoutBtn.id = 'btn-checkout';
            checkoutBtn.textContent = 'Check-Out';
            modalContent += checkoutBtn.outerHTML;

            const servicesBtn = document.createElement('button');
            servicesBtn.className = 'btn-services';
            servicesBtn.id = 'btn-services';
            servicesBtn.textContent = 'Services';
            // servicesBtn.addEventListener('click', () => servicesBooking(bookingInfo, roomNumber));
            // servicesBtn.onclick = () => servicesBooking(bookingInfo, roomNumber);
            modalContent += servicesBtn.outerHTML;

            const orderBtn = document.createElement('button');
            orderBtn.className = 'btn-order';
            orderBtn.id = 'btn-order';
            orderBtn.textContent = 'Order';
            modalContent += orderBtn.outerHTML;
        }


        const modal = document.getElementById('bookingModal');
        const modalBody = modal.querySelector('.modal-body');
        setTimeout(() => modal.classList.add('show'), 10);

        modalBody.innerHTML = modalContent;
        modal.style.display = 'block';
    }


    // Adding event listener to check-in button inside booking details modal
    const checkInBtn = document.getElementById('btn-checkin');
    const servicesBtn = document.getElementById('btn-services');
    const checkoutBtn = document.getElementById('btn-checkout');
    const orderBtn = document.getElementById('btn-order');

    if (checkInBtn) {
        document.getElementById('btn-checkin').onclick = () => checkInBooking(bookingInfo, roomNumber);
    }
    if (servicesBtn) {
        document.getElementById('btn-services').onclick = () => servicesBooking(bookingInfo, roomNumber);
    }
    if (checkoutBtn) {
        document.getElementById('btn-checkout').onclick = () => checkOutBooking(bookingInfo, roomNumber);
    }
    if (orderBtn) {
        document.getElementById('btn-order').onclick = () => orderBooking(bookingInfo, roomNumber);
    }

    const serveBtn = document.querySelectorAll('.serve-btn');
    // for each serveBtn add event listener
    if (serveBtn) {
        // document.getElementById('serve-btn').onclick = () => serveOrder(serveBtn.dataset.orderId);
        serveBtn.forEach(btn => {
            const serveBtnId = btn.dataset.orderId;
            const serveBtnStatus = btn.dataset.status;
            if (serveBtnStatus === 'serve') {
                // btn.style.display = 'none';
                btn.textContent = 'Served';
                btn.style.backgroundColor = '#5e5e5e';
                btn.style.color = '#fff';
                btn.style.cursor = 'not-allowed';
                btn.disabled = true;
            }
            btn.onclick = () => serveOrder(serveBtnId);
        });

    }

    const eyeOrder = document.querySelectorAll('.booking-eye-order');
    if (eyeOrder) {
        eyeOrder.forEach(btn => {
            const eyeOrderStatus = btn.dataset.status;
            if (eyeOrderStatus === 'serve') {
                btn.style.display = 'none';
                btn.style.cursor = 'not-allowed';
            }
        });
    }

    const servicesDel = document.querySelectorAll('.services-del');
    if (servicesDel) {
        servicesDel.forEach(btn => {
            btn.onclick = () => deleteService(btn.dataset.serviceId);
        });
    }

}



// Close the service booking modal
document.querySelector('.close4').onclick = function () {
    const newBookingModal = document.getElementById('serviceModal');
    newBookingModal.classList.remove('show');
    setTimeout(() => newBookingModal.style.display = 'none', 300);
}

// Close the checkOut modal
document.querySelector('.close5').onclick = function () {
    const newBookingModal = document.getElementById('checkOutModal');
    newBookingModal.classList.remove('show');
    setTimeout(() => newBookingModal.style.display = 'none', 300);
}

function serveOrder(orderId) {
    console.log("serveOrder called");
    console.log(orderId);
    serveOrderPATCH(orderId);

    function serveOrderPATCH(orderId) {
        const option = {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + getCookie('access_token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'serve'
            })
        }

        const url = `${baseURL}orders/order/${orderId}/`;
        refreshAccessToken2(url, option)
            // .then(response => response.json())
            .then(data => {
                console.log('Served Data:', data);
                console.table(data);
                alert("Order SERVED Successfully");
            })
            .catch(error => {
                console.log('Error SERVED Order:', error);
            })
    }
}

function deleteService(serviceId) {
    console.log("deleteService called");
    console.log(serviceId);

    deleteServicePATCH(serviceId);

    function deleteServicePATCH(serviceId) {
        const option = {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + getCookie('access_token'),
                'Content-Type': 'application/json'
            }            
        }

        const url = `${baseURL}hotel/service-usages/${serviceId}/`;
        refreshAccessToken2(url, option)
            .then(data => {
                // console.log('Deleted Service Data:', data);
                // console.table(data);
                alert("Service Deleted Successfully");
            })
            .catch(error => {
                console.log('Error Deleting Service:', error);
            })
    }
}


// Show booking details modal
function showBookingModal2(roomNumber, dateString) {
    const date = new Date(dateString);
    console.log(date);
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
                <button class="btn-services" id="btn-services" onclick="servicesBooking();">Services</button>
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

// continue service modal
function servicesBooking(bookingInfo, roomNumber) {
    renderServiceModal(bookingInfo, roomNumber)
    console.log("servicesBooking called");
    console.log(bookingInfo);
    console.log(roomNumber);

    const modal = document.getElementById('serviceModal');
    const modalBody = modal.querySelector('.modal-body');
    setTimeout(() => modal.classList.add('show'), 10);

    // modalBody.innerHTML = modalContent;
    modal.style.display = 'block';
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

// Onclick action for CheckOut from Booking details modal
function checkOutBooking(bookingInfo, roomNumber) {
    renderCheckoutModal(bookingInfo, roomNumber);

    // let modalContent = ` `;
    console.log("Check-Out btn clicked");
    const modal = document.getElementById('checkOutModal');
    const modalBody = modal.querySelector('.modal-body');
    setTimeout(() => modal.classList.add('show'), 10);

    // modalBody.innerHTML = modalContent;

    modal.style.display = 'block';
}

// Onclick action for Order from Booking details modal
function orderBooking(bookingInfo, roomNumber) {

    const mobile = bookingInfo.phoneNumber;
    const name = bookingInfo.guestName;
    const email = bookingInfo.email;

    // map room number with room id from local storage roomsList
    const roomsListString = localStorage.getItem('roomsList');
    const roomsList = JSON.parse(roomsListString);
    const room = roomsList.find(room => room.room_number == roomNumber);
    const roomId = room.id;

    console.log("Order btn clicked");
    // follow order booking url
    window.location.href = `./../restaurant/takeorder/takeorder.html?room=${roomId}&bookingId=${bookingInfo.bookingId}&orderType=hotel&mobile=${mobile}&name=${name}&email=${email}`;
}

// Render Service Modal
function renderServiceModal(bookingInfo, roomNumber) {
    console.log("renderServiceModal called");
    console.log(bookingInfo);
    console.log(roomNumber);
    const bookingId = bookingInfo.bookingId;

    const dataById = getBookingById(bookingInfo.bookingId);
    console.log(dataById);

    putBookingDataInServiceModal(bookingId, roomNumber);

    function putBookingDataInServiceModal(bookingId, roomNumber) {
        const roomElement = document.getElementById('serviceRoomNumber');
        roomElement.value = roomNumber;
        roomElement.dataset.bookingId = bookingId;

        const serviceElement = document.getElementById('serviceService');
        // append services options in serviceElement from local storage servicesList
        const servicesListString = localStorage.getItem('serviceList');
        const servicesList = JSON.parse(servicesListString);
        servicesList.forEach(service => {
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = service.name;
            serviceElement.appendChild(option);
        });
        // add data in each service option for price
        servicesList.forEach(service => {
            const option = serviceElement.querySelector(`option[value="${service.id}"]`);
            if (option) {
                option.dataset.price = service.price;
            }
        });

        const quantityElement = document.getElementById('serviceQuantity');
        quantityElement.value = 1;
    }

}

// Render CheckOut Modal
function renderCheckoutModal(bookingInfo, roomNumber) {
    console.log("renderCheckoutModal called");
    console.log(bookingInfo);
    console.log(roomNumber);
    const bookingId = bookingInfo.bookingId;

    putBookingDataInCheckoutModal(bookingId, roomNumber);

    function putBookingDataInCheckoutModal(bookingId, roomNumber) {
        const roomElement = document.getElementById('checkoutRoomNumber');
        roomElement.value = roomNumber;
        roomElement.dataset.bookingId = bookingId;

        const roomData = localStorage.getItem('roomsList');
        const roomsList = JSON.parse(roomData);
        const room = roomsList.find(room => room.room_number == roomNumber);
        const roomId = room.id;
        roomElement.dataset.roomId = roomId;


    }
}

// If service is selected then calculate total price from dataset price based on Quantity
document.getElementById('serviceService').addEventListener('change', () => {
    const serviceSelect = document.getElementById('serviceService');
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex]; // Get the selected option
    const price = parseFloat(selectedOption.dataset.price);
    const quantity = document.getElementById('serviceQuantity').value;
    const totalPrice = quantity * price;
    // console.log(`Selected Service: ${selectedService}`);
    console.log(`Price: ${price}`);
    console.log(`Quantity: ${quantity}`);
    console.log(`Total Price: ${totalPrice}`);
    document.getElementById('serviceTotalPrice').value = totalPrice;
});

// If quantity is changed then calculate total price from dataset price based on Quantity
document.getElementById('serviceQuantity').addEventListener('change', () => {
    const serviceSelect = document.getElementById('serviceService');
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex]; // Get the selected option
    const price = parseFloat(selectedOption.dataset.price);
    const quantity = document.getElementById('serviceQuantity').value;
    const totalPrice = quantity * price;
    // console.log(`Selected Service: ${selectedService}`);
    console.log(`Price: ${price}`);
    console.log(`Quantity: ${quantity}`);
    console.log(`Total Price: ${totalPrice}`);
    document.getElementById('serviceTotalPrice').value = totalPrice;
});

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
        console.log('Booking Date:', result.booking_date);
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

// Onclick action for Book Service from Service Modal
document.getElementById('service-btn').addEventListener('click', serviceSubmit);

// Onclick action for CheckOut from CheckOut Modal
document.getElementById('checkout-btn').addEventListener('click', checkOutSubmit);

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
        booking_id: parseInt(bookingId),
        room_id: parseInt(roomId),
        check_in_date: checkinDateTimeISO,
        guests: guestsData
    };
    postCheckInData(checkInData);
    console.log("Check-In Data:", JSON.stringify(checkInData, null, 2));

    console.log(`Room Number: ${roomNumber}`);
    console.log(`Check-In Date and Time: ${checkinDateTime}`);
}

function serviceSubmit() {
    console.log("Service btn clicked");
    const roomNumber = document.getElementById('serviceRoomNumber').value;
    const bookingId = document.getElementById('serviceRoomNumber').dataset.bookingId;
    const service = document.getElementById('serviceService').value;
    const quantity = document.getElementById('serviceQuantity').value;
    const totalPrice = document.getElementById('serviceTotalPrice').value;
    console.log(`Room Number: ${roomNumber}`);
    console.log(`Booking ID: ${bookingId}`);
    console.log(`Service: ${service}`);
    console.log(`Quantity: ${quantity}`);
    console.log(`Total Price: ${totalPrice}`);

    // Find roomId from roomNumber by mapping from localStorage roomsList
    const roomsList = localStorage.getItem('roomsList');
    if (!roomsList) {
        console.error('No roomsList found in localStorage');
        return;
    }
    const roomsListObj = JSON.parse(roomsList);
    const roomId = roomsListObj.find(room => room.room_number === roomNumber).id;

    const serviceData = {
        booking_id: parseInt(bookingId),
        room_id: parseInt(roomId),
        service_id: parseInt(service),
        quantity: parseInt(quantity),
        total_price: totalPrice,
    }

    postServiceData(serviceData);

}

function checkOutSubmit() {
    console.log("Check-Out btn clicked");
    const roomNumber = document.getElementById('checkoutRoomNumber').value;
    const bookingId = document.getElementById('checkoutRoomNumber').dataset.bookingId;
    const roomId = document.getElementById('checkoutRoomNumber').dataset.roomId;
    const checkoutDateTime = document.getElementById('checkoutCheckoutDateTime').value;
    console.log(`Room Number: ${roomNumber}`);
    console.log(`Booking ID: ${bookingId}`);
    console.log(`Room ID: ${roomId}`);

    if (!checkoutDateTime) {
        alert("Check-Out Date & Time: Required");
        return;
    }
    const checkoutDateTimeISO = new Date(checkoutDateTime).toISOString();
    console.log(`Check-Out Date and Time: ${checkoutDateTimeISO}`);

    const checkOutData = {
        booking_id: parseInt(bookingId),
        room_id: parseInt(roomId),
        check_out_date: checkoutDateTimeISO,
    }

    postCheckOutData(checkOutData);
}

//  POST API Call for checkin   
function postCheckInData(checkInData) {
    console.log(`postCheckInData: ${checkInData}`);
    console.log("Check-In Data:", JSON.stringify(checkInData, null, 2));

    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(checkInData),
    };
    const url = `${baseURL}hotel/checkin/`;
    refreshAccessToken2(url, options)
        .then(data => {
            console.log("Check-In Data posted:", data);
            return data;
        })
        .catch(error => {
            console.error("Error posting check-in data:", error);
        });
}

// POST API Call for service
function postServiceData(serviceData) {
    console.log(`postServiceData: ${serviceData}`);
    console.log("Service Data:", JSON.stringify(serviceData, null, 2));

    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceData),
    };
    const url = `${baseURL}hotel/service-usages/`;

    refreshAccessToken2(url, options)
        .then(data => {
            console.log("Service Booked for Room:", data);
            alert("Service Booked for Room");
            return data;
        })
        .catch(error => {
            console.error("Error posting check-in data:", error);
        });

}

// POST API Call for Check Out
function postCheckOutData(checkOutData) {
    console.log(`postCheckoutData: ${checkOutData}`);
    console.log("Check Out Data:", JSON.stringify(checkOutData, null, 2));

    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(checkOutData),
    };
    const url = `${baseURL}hotel/checkout/`;

    refreshAccessToken2(url, options)
        .then(data => {
            console.log("Check Out for Room:", data);
            alert("Checked Out for Room");
            return data;
        })
        .catch(error => {
            console.error("Error posting check-out data:", error);
        });

}

// Close action for checkin modal
document.querySelector('.close3').onclick = function () {
    const modal = document.getElementById('checkinModal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

// Onclick action for CheckOut from Booking details modal
function checkOutBooking2() {
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

// Put Rooms as options in the select element
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
        console.log(`isAvailable ${room.room_number} for ${startDate} to ${endDate}: ${isAvailable}`);
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


function checkRoomAvailability2(room, startDate, endDate) {
    console.log(room.bookings);
    console.log(JSON.stringify(room));
    return !room.bookings.some(booking => {
        const bookingStart = new Date(booking.start_date);
        const bookingEnd = new Date(booking.end_date);
        return (startDate < bookingEnd && endDate > bookingStart);
    });
}

function checkRoomAvailability(room, startDate, endDate) {
    console.log(room.bookings);
    console.log(JSON.stringify(room));
    return !room.bookings.some(bookingData => {
        const bookingStart = new Date(bookingData.booking.start_date);
        const bookingEnd = new Date(bookingData.booking.end_date);
        return (startDate < bookingEnd && endDate > bookingStart);
    });
}

// Export the initialization function
window.initializeBooking = initializeBooking;

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



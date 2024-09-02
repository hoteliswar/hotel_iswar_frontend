let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Sample room data with bookings (room number as key, array of booking periods)
const roomBookings = {
    101: [
        { start: new Date(currentYear, 8, 1, 12, 0), end: new Date(currentYear, 8, 2, 12, 0) },
        { start: new Date(currentYear, 8, 2, 12, 0), end: new Date(currentYear, 8, 3, 12, 0) },
    ],
    102: [
        { start: new Date(currentYear, 8, 3, 12, 0), end: new Date(currentYear, 8, 4, 12, 0) },
        { start: new Date(currentYear, 8, 5, 12, 0), end: new Date(currentYear, 8, 6, 12, 0) },
    ],
    103: [
        { start: new Date(currentYear, 8, 6, 12, 0), end: new Date(currentYear, 8, 7, 12, 0) },
    ]
};

// Helper function to get the start of the week
function startOfWeek(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust if day is Sunday
    return new Date(date.setDate(diff));
}

// Function to check if a room is booked during a specific 12-hour period
function isRoomBooked(roomBookings, startTime, endTime) {
    for (const booking of roomBookings) {
        if (startTime >= booking.start && startTime < booking.end) {
            return true;
        }
    }
    return false;
}

// Helper function to generate the week view with room booking statuses
function generateWeekCalendar2(date) {
    const calendarDiv = document.getElementById('calendar');
    const start = startOfWeek(date);
    const daysInWeek = 7;
    let calendar = '<table>';

    // Table header with room numbers and day names
    calendar += '<tr><th>Room</th>';
    for (let i = 0; i < daysInWeek; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        calendar += `<th>${day.toDateString().slice(0, 3)}<br>${day.getDate()}</th>`;
    }
    calendar += '</tr>';

    // Generate rows for each room
    Object.keys(roomBookings).forEach(room => {
        calendar += `<tr><td>${room}</td>`;

        for (let i = 0; i < daysInWeek; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);

            const firstHalfStart = new Date(day);
            firstHalfStart.setHours(0, 0, 0, 0);
            const firstHalfEnd = new Date(firstHalfStart);
            firstHalfEnd.setHours(12, 0, 0, 0);

            const secondHalfStart = new Date(day);
            secondHalfStart.setHours(12, 0, 0, 0);
            const secondHalfEnd = new Date(secondHalfStart);
            secondHalfEnd.setDate(secondHalfEnd.getDate() + 1);
            secondHalfEnd.setHours(0, 0, 0, 0);

            const firstHalfStatus = isRoomBooked(roomBookings[room], firstHalfStart, firstHalfEnd) ? 'booked' : 'available';
            const secondHalfStatus = isRoomBooked(roomBookings[room], secondHalfStart, secondHalfEnd) ? 'booked' : 'available';

            calendar += `<td>
                <div class="half-day ${firstHalfStatus}" title="${firstHalfStatus === 'booked' ? 'Booked from 12 AM to 12 PM' : 'Available'}">
                    ${firstHalfStatus === 'booked' ? 'Booked' : 'Available'}
                    <div class="tooltip">Booked from 12 AM to 12 PM</div>
                </div>
                <div class="half-day ${secondHalfStatus}" title="${secondHalfStatus === 'booked' ? 'Booked from 12 PM to 12 AM' : 'Available'}">
                    ${secondHalfStatus === 'booked' ? 'Booked' : 'Available'}
                    <div class="tooltip">Booked from 12 PM to 12 AM</div>
                </div>
            </td>`;
        }

        calendar += '</tr>';
    });

    calendar += '</table>';
    calendarDiv.innerHTML = calendar;

    // Update the month heading
    updateMonthHeading(start, date);
}

function generateWeekCalendar3(date) {
    const calendarDiv = document.getElementById('calendar');
    const start = startOfWeek(date);
    const daysInWeek = 7;
    let calendar = '<table>';

    // Table header with room numbers and day names
    calendar += '<tr><th>Room</th>';
    for (let i = 0; i < daysInWeek; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        calendar += `<th>${day.toDateString().slice(0, 3)}<br>${day.getDate()}</th>`;
    }
    calendar += '</tr>';

    // Generate rows for each room
    Object.keys(roomBookings).forEach(room => {
        calendar += `<tr><td>${room}</td>`;

        for (let i = 0; i < daysInWeek; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);

            const bookingStart = new Date(day);
            bookingStart.setHours(12, 0, 0, 0);

            const bookingEnd = new Date(bookingStart);
            bookingEnd.setDate(bookingEnd.getDate() + 1);
            bookingEnd.setHours(12, 0, 0, 0);

            const bookingStatus = isRoomBooked(roomBookings[room], bookingStart, bookingEnd) ? 'booked' : 'available';

            calendar += `<td>
                <div class="full-day ${bookingStatus}" title="${bookingStatus === 'booked' ? 'Booked from 12 PM to 12 PM' : 'Available'}">
                    ${bookingStatus === 'booked' ? 'Booked' : 'Available'}
                    <div class="tooltip">Booked from 12 PM to 12 PM</div>
                </div>
            </td>`;
        }

        calendar += '</tr>';
    });

    calendar += '</table>';
    calendarDiv.innerHTML = calendar;

    // Update the month heading
    updateMonthHeading(start, date);
}

function generateWeekCalendar(date) {
    const calendarDiv = document.getElementById('calendar');
    const start = startOfWeek(date);
    const daysInWeek = 7;
    
    console.log(`Start: ${start}`);
    
    
    let calendar = '<table>';
    
    // Table header with room numbers and day names
    calendar += '<tr><th>Room</th>';
    for (let i = 0; i < daysInWeek; i++) {
        const day = new Date(start);
        
        day.setDate(start.getDate() + i);
        calendar += `<th>${day.toDateString().slice(0, 3)}<br>${day.getDate()}</th>`;
    }
    calendar += '</tr>';

    // Generate rows for each room
    Object.keys(roomBookings).forEach(room => {
        calendar += `<tr><td>${room}</td>`;

        for (let i = 0; i < daysInWeek; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);

            const firstHalfStart = new Date(day);
            firstHalfStart.setHours(0, 0, 0, 0);
            const firstHalfEnd = new Date(firstHalfStart);
            firstHalfEnd.setHours(12, 0, 0, 0);

            const secondHalfStart = new Date(day);
            secondHalfStart.setHours(12, 0, 0, 0);
            const secondHalfEnd = new Date(secondHalfStart);
            secondHalfEnd.setDate(secondHalfEnd.getDate() + 1);
            secondHalfEnd.setHours(0, 0, 0, 0);

            const firstHalfStatus = isRoomBooked(roomBookings[room], firstHalfStart, firstHalfEnd) ? 'booked' : 'available';
            const secondHalfStatus = isRoomBooked(roomBookings[room], secondHalfStart, secondHalfEnd) ? 'booked' : 'available';

            calendar += `<td>
                <div class="half-day ${firstHalfStatus}" title="${firstHalfStatus === 'booked' ? 'Booked from 12 AM to 12 PM' : 'Available'}">
                    ${firstHalfStatus === 'booked' ? 'Booked' : 'Available'}
                    <div class="tooltip">Booked from 12 AM to 12 PM</div>
                </div>
                <div class="half-day ${secondHalfStatus}" title="${secondHalfStatus === 'booked' ? 'Booked from 12 PM to 12 AM' : 'Available'}">
                    ${secondHalfStatus === 'booked' ? 'Booked' : 'Available'}
                    <div class="tooltip">Booked from 12 PM to 12 AM</div>
                </div>
            </td>`;
        }

        calendar += '</tr>';
    });

    calendar += '</table>';
    calendarDiv.innerHTML = calendar;

    // Update the month heading
    updateMonthHeading(start, date);
}



// Function to update the month heading based on the start and end of the week
function updateMonthHeading(start, end) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const startMonth = start.getMonth();
    const endMonth = end.getMonth();
    let monthHeading = monthNames[startMonth];

    // If the week spans two months, show both months
    if (startMonth !== endMonth) {
        monthHeading += ` - ${monthNames[endMonth]}`;
    }

    document.getElementById('currentMonth').textContent = monthHeading;
}

// Function to update the calendar
function updateCalendar() {
    generateWeekCalendar(currentDate);
}

// Event listeners for the controls
document.getElementById('prevWeek').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 7);
    updateCalendar();
});

document.getElementById('nextWeek').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 7);
    updateCalendar();
});

document.getElementById('monthSelect').addEventListener('change', (event) => {
    currentMonth = parseInt(event.target.value, 10);
    currentDate = new Date(currentYear, currentMonth, 1);
    updateCalendar();
});

// Initialize the month select to the current month
document.getElementById('monthSelect').value = currentMonth;

// Generate the initial calendar for the current week
updateCalendar();
// billingDisplay();

getAllBilling();

function billingDisplay() {

    const billingData = localStorage.getItem('billingList');
    const bookingData = localStorage.getItem('bookingsList');

    const billingList = JSON.parse(billingData);
    const bookingList = JSON.parse(bookingData);

    console.log('Billing List:', billingList);
    console.log('Booking List:', bookingList);

    const combinedData = billingList.map(billing => {
        const booking = bookingList.find(booking => booking.id === billing.booking_id);
        return {
            ...billing,
            bookingData: booking || null
        };
    }).filter(item => item.bookingData !== null);

    console.log('Combined Data:', combinedData);

    return combinedData;
}

function billingDisplayUI() {

    const displayArea = document.querySelector('.append-all-room');

    displayArea.innerHTML = '';

    const combinedData = billingDisplay();

    combinedData.forEach(item => {
        console.log(item);

        const billingRow = document.createElement('div');
        billingRow.classList.add('room-list-table');
        billingRow.classList.add('room-row');

        const billingId = document.createElement('div');
        billingId.classList.add('col-1');
        billingId.textContent = item.bill_no;

        const bookingId = document.createElement('div');
        bookingId.classList.add('col-1');
        bookingId.textContent = item.booking_id;

        // const billingId = document.createElement('div');
        // billingId.classList.add('col-1');
        // billingId.textContent = item.bill_no;

        const guestName = document.createElement('div');
        guestName.classList.add('col-3');
        guestName.textContent = item.bookingData.guest_detail[0].first_name + ' ' + item.bookingData.guest_detail[0].last_name;

        const billedAmount = document.createElement('div');
        billedAmount.classList.add('col-2');
        billedAmount.textContent = item.net_amount;

        const paymentStatus = document.createElement('div');
        paymentStatus.classList.add('col-2');
        paymentStatus.textContent = item.status;

        const actions = document.createElement('div');
        actions.classList.add('col-1');
        actions.innerHTML = `<i class="fas fa-eye view-room-eye" data-room-id="${item.id}"></i>`;
        actions.addEventListener('click', function () {
            viewOrderModal(item);
        });

        billingRow.appendChild(billingId);
        billingRow.appendChild(bookingId);
        billingRow.appendChild(guestName);
        billingRow.appendChild(billedAmount);
        billingRow.appendChild(paymentStatus);
        billingRow.appendChild(actions);
        displayArea.appendChild(billingRow);

    });

}

billingDisplayUI();

function viewOrderModal(item) {

    const roomsData = JSON.parse(localStorage.getItem('roomsList'));

    const modal = document.getElementById('roomModal');
    // const modalBody = modal.querySelector('.modal-body');
    setTimeout(() => modal.classList.add('show'), 10);

    // modalBody.innerHTML = modalContent;
    modal.style.display = 'block';


    console.log(item);

    const modalBody = document.querySelector('.modal-body');

    let modalContent = `
            <div class="booking-modal-data">
            <p><div class="booking-data-head">Billing Id:</div>  ${item.bill_no}</p>
                <p><div class="booking-data-head">Booking Id:</div>  ${item.booking_id}</p>
                <p><div class="booking-data-head">Rooms:</div>
                 ${item.bookingData.rooms.map(room => {
        const roomDetail = roomsData.find(r => r.id == room.room);
        return roomDetail ? roomDetail.room_number : 'N/A';
    }).join(', ')} 
                </p>
                <p><div class="booking-data-head">GST Bill No:</div>  ${item.gst_bill_no}</p>
                <p><div class="booking-data-head">Guest Name:</div>  ${item.bookingData.guest_detail[0].first_name} ${item.bookingData.guest_detail[0].last_name}</p>
                <p><div class="booking-data-head">Customer GST No:</div>  ${item.customer_gst || 'N/A'}</p>
                <p><div class="booking-data-head">Billed Amount:</div>  ${item.net_amount}</p>
                <p><div class="booking-data-head">Payment Status:</div>  ${item.status}</p>
            </div>
    `;

    if (item.status == 'paid') {
        modalContent += `
        <button class= "view-bill-btn" id="view-bill-btn">View Bill</button>
        `;

    }
    if (item.status == 'unpaid') {
        modalContent += `
        <button class="view-bill-btn" id="view-bill-btn">View Bill</button>
        <button class="pay-bill-btn" id="pay-bill-btn">Pay Bill</button>
        `;

    }
    modalBody.innerHTML = modalContent;



    const viewBillBtn = document.getElementById('view-bill-btn');
    const payBillBtn = document.getElementById('pay-bill-btn');

    if (viewBillBtn) {
        document.getElementById('view-bill-btn').addEventListener('click', function () {
            viewBillModal(item);
        });
    }


    if (payBillBtn) {
        payBillBtn.addEventListener('click', function () {
            payBillModal(item);
        });
    }


}

// Close Add Modal
document.querySelector('.close').onclick = function () {
    const modal = document.getElementById('roomModal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

async function viewBillModal(item) {
    console.log('view bill modal');
    console.log(item);
    // generatePrintableBill(item);

    try {
        const billData = await getBillById(item.id);
        console.log('Bill Data:', billData);
        generatePrintableBill(billData);
        // generatePrintableBill(item);
    } catch (error) {
        console.log('Error getting bill:', error);
    }



}

async function getBillById(billId) {

    const url = `${baseURL}billing/bills/${billId}/`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }

    // return refreshAccessToken2(url, options)
    //     .then(data => {
    //         console.log(data);
    //         // return data;
    //     })  
    //     .catch(error => {
    //         console.log('Error in getBillById:', error);
    //     });


    const data = await refreshAccessToken2(url, options);
    console.log('Raw response:', data);  // Debug log
    return data;

}


// new 

async function generatePrintableBill2(billData) {
    try {
        console.log('Bill Data:', billData);
        const orderData = await getOrderById(billData.order_id);

        if (!orderData) {
            throw new Error('Failed to get order data');
        }

        console.log('Order Data:', orderData);

        // Create new window
        const billWindow = window.open('', '_blank');
        const doc = billWindow.document;

        // Add CSS
        const cssLink = doc.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = './../../order_bill/order_bill.css';
        doc.head.appendChild(cssLink);

        // Add print-specific styles
        const style = doc.createElement('style');
        // style.textContent = `
        //     @media print {
        //         .page-break {
        //             page-break-before: always;
        //         }
        //         .bill-wrapper {
        //             page-break-after: avoid;
        //         }
        //         .page-number {
        //             text-align: center;
        //             margin-top: 10px;
        //             font-size: 12px;
        //             color: #666;
        //         }
        //         .bill-container {
        //             display: flex;
        //             flex-direction: column;
        //             min-height: 100vh;
        //         }
        //         .bill-items {
        //             flex: 1;
        //         }
        //         .bill-footer {
        //             margin-top: auto;
        //         }
        //         .page-subtotal td {
        //             padding-top: 10px;
        //             font-weight: bold;
        //             border-top: 1px solid #ddd;
        //         }
        //     }
        // `;
        doc.head.appendChild(style);

        // Transform food items data
        const allFoodList = JSON.parse(localStorage.getItem('allFoodList'));
        const orderBillItems = orderData.food_items.map((foodId, index) => {
            const foodItem = allFoodList.find(item => item.id === foodId);
            return {
                foodId: foodId,
                itemName: foodItem.name,
                quantity: orderData.quantity[index],
                rate: parseFloat(foodItem.price),
                total: parseFloat(foodItem.price) * orderData.quantity[index]
            };
        });

        const ITEMS_PER_PAGE = 10;
        const totalPages = Math.ceil(orderBillItems.length / ITEMS_PER_PAGE);

        // Generate content for all pages
        let pagesHTML = '';
        for (let page = 1; page <= totalPages; page++) {
            pagesHTML += `
                ${page > 1 ? '<div class="page-break"></div>' : ''}
                <div class="bill-wrapper">
                    <div class="bill-container">
                        ${generateBillHeader()}
                        ${generateInvoiceSection()}
                        ${generateItemsSection(page, totalPages)}
                        ${generateFooter()}
                    </div>
                </div>
            `;
        }

        // Set the HTML content
        doc.body.innerHTML = pagesHTML;

        // Add number-to-words script
        const script = doc.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/number-to-words';
        script.onload = function () {
            populateBillData(billWindow, billData, orderData, orderBillItems);
        };
        doc.head.appendChild(script);

    } catch (error) {
        console.error('Error in generatePrintableBill:', error);
    }
}

function generateBillHeader() {
    return `
        <header class="bill-header">
            <div class="header-content">
                <div class="logo">
                    <img src="./../../order_bill/logo.png" alt="Restaurant Logo" class="restaurant-logo">
                </div>
                <div class="restaurant-details">
                    <h2>Hotel Iswar & Family Restaurant</h2>
                    <p>Address: Central Road, Silchar, Assam, 788001</p>
                    <p>Contact: +91 38423 19540 / +91 6003704064</p>
                    <p>Website: www.hoteliswar.in</p>
                    <p>GST No: 18BDXPS2451N1ZK</p>
                </div>
            </div>
        </header>
    `;
}

function generateInvoiceSection() {
    return `
        <section class="invoice-customer-info">
            <div class="invoice-info">
                <h3>Invoice</h3>
                <div>Bill No: <span id="bill-number"> </span></div>
                <div>GST Bill No: <span id="gst-bill-number"> </span></div>
                <div>Table: <span id="table-number"> </span></div>
                <div>Order Type: <span id="order-type"> </span></div>
            </div>

            <div class="bill-details">
                <h3>Customer Details</h3>
                <div>Name: <span id="customer-name">  </span></div>
                <div>Email: <span id="customer-email">  </span></div>
                <div>Phone: <span id="customer-phone">  </span></div>
                <div>GST No.: <span id="customer-gstno">  </span></div>
            </div>
        </section>
    `;
}

function generateItemsSection(pageNumber, totalPages) {
    return `
        <section class="bill-items">
            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody id="bill-items-body-${pageNumber}">
                    <!-- Items will be added here -->
                </tbody>
            </table>
            <div class="page-number">Page ${pageNumber} of ${totalPages}</div>
        </section>
    `;
}

function generateFooter() {
    return `
        <footer class="bill-footer">
            <div class="kot-section">
                <div class="kot-head">Kot Nos #</div>
                <div class="kot-nos"></div>
            </div>

            <div class="cashier-info">
                <div class="cashier-name">Cashier: </div>
                <div class="name"></div>
                <div class="cashier-date"></div>
            </div>

            <div class="license-nos">
                <div class="fssai">FSSAI LICENSE NO: 10324025000094</div>
            </div>

            <div class="bill-footer-text">
                * * * Thank you for Dining with us! * * *
            </div>
        </footer>
    `;
}

function populateBillData(billWindow, billData, orderData, orderBillItems) {
    const doc = billWindow.document;

    // Basic Info
    doc.getElementById('bill-number').textContent = billData.bill_no;
    doc.getElementById('table-number').textContent = orderData.tables?.[0] || '-';
    doc.getElementById('order-type').textContent = orderData.order_type;
    doc.getElementById('gst-bill-number').textContent = billData.gst_bill_no;

    // Customer Details
    doc.getElementById('customer-name').textContent = `${orderData.customer?.first_name || 'NA'} ${orderData.customer?.last_name || ''}`;
    doc.getElementById('customer-email').textContent = orderData.customer?.email || 'NA';
    doc.getElementById('customer-phone').textContent = orderData.customer?.phone || 'NA';
    doc.getElementById('customer-gstno').textContent = billData?.customer_gst || 'NA';

    // Split items into pages
    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(orderBillItems.length / ITEMS_PER_PAGE);

    for (let page = 1; page <= totalPages; page++) {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, orderBillItems.length);
        const pageItems = orderBillItems.slice(startIndex, endIndex);

        const billItemsBody = doc.getElementById(`bill-items-body-${page}`);

        // Add items for this page
        pageItems.forEach(item => {
            const row = doc.createElement('tr');
            row.innerHTML = `
                <td>${item.itemName}</td>
                <td>${item.quantity}</td>
                <td>${item.rate.toFixed(2)}</td>
                <td>${item.total.toFixed(2)}</td>
            `;
            billItemsBody.appendChild(row);
        });

        // Add totals only to the last page
        if (page === totalPages) {
            const totalsHTML = `
                <tr><td colspan="4">&nbsp;</td></tr>
                <tr class="bill-total total">
                    <td colspan="2"></td>
                    <td>Total</td>
                    <td>${billData.total}</td>
                </tr>
                <tr class="bill-total discount">
                    <td colspan="2"></td>
                    <td>Discount</td>
                    <td>${billData.discount}</td>
                </tr>
                <tr class="bill-total gst">
                    <td colspan="2"></td>
                    <td>CGST (2.50%)</td>
                    <td>${billData.cgst_amount}</td>
                </tr>
                <tr class="bill-total gst">
                    <td colspan="2"></td>
                    <td>SGST (2.50%)</td>
                    <td>${billData.sgst_amount}</td>
                </tr>
                <tr class="bill-total net-amount">
                    <td colspan="2"></td>
                    <td>Net Amount</td>
                    <td>₹${billData.net_amount}</td>
                </tr>
                <tr class="bill-total amount-in-words">
                    <td colspan="4">Amount in Words: 
                        <i>${capitalizeFirstLetter(billWindow.numberToWords.toWords(Math.floor(billData.net_amount)).replace(/-/g, ' '))} Rupees Only</i>
                    </td>
                </tr>
            `;
            billItemsBody.insertAdjacentHTML('beforeend', totalsHTML);
        }
    }

    // Footer info
    doc.querySelector('.kot-nos').textContent = orderData.kot_count || '0';
    doc.querySelector('.name').textContent = billData.cashier_by || '';
    doc.querySelector('.cashier-date').textContent = new Date(billData.created_at).toLocaleString();

    // Trigger print after a short delay
    setTimeout(() => {
        billWindow.print();
    }, 500);
}

// Helper function to capitalize first letter
function capitalizeFirstLetter2(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// new bill

async function generatePrintableBill(billData) {
    try {
        console.log('Bill Data:', billData);
        const roomsData = JSON.parse(localStorage.getItem('roomsList'));

        // Create new window
        const billWindow = window.open('', '_blank');
        const doc = billWindow.document;

        // Add CSS
        const cssLink = doc.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = './../../order_bill/order_bill.css';
        doc.head.appendChild(cssLink);

        // Generate content for hotel bill page
        let pagesHTML = `
            <div class="bill-wrapper">
                <div class="bill-container">
                    ${generateBillHeader()}
                    ${generateHotelInvoiceSection(billData)}
                    ${generateHotelItemsSection(billData, roomsData)}
                    ${generateHotelFooter(billData)}
                </div>
            </div>
        `;

        // If there are orders, add a page break and order details
        if (billData.order_details && billData.order_details.length > 0) {
            pagesHTML += `
                <div class="page-break"></div>
                <div class="bill-wrapper">
                    <div class="bill-container">
                        ${generateBillHeader()}
                        ${generateOrderItemsSection(billData)}
                        ${generateOrderFooter(billData)}
                    </div>
                </div>
            `;
        }

        // Set the HTML content
        doc.body.innerHTML = pagesHTML;

        // Add number-to-words script
        const script = doc.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/number-to-words';
        script.onload = function() {
            populateHotelBillData(billWindow, billData, roomsData);
        };
        doc.head.appendChild(script);

    } catch (error) {
        console.error('Error in generatePrintableBill:', error);
    }
}

function generateHotelInvoiceSection(billData) {
    return `
        <section class="invoice-customer-info">
            <div class="invoice-info">
                <h3>Hotel Bill</h3>
                <div>Bill No: <span id="bill-number">${billData.bill_no}</span></div>
                <div>GST Bill No: <span id="gst-bill-number">${billData.gst_bill_no}</span></div>
                <div>Date: <span id="bill-date">${new Date(billData.created_at).toLocaleDateString()}</span></div>
            </div>
            <div class="bill-details">
                <h3>Customer Details</h3>
                <div>Booking ID: <span id="booking-id">${billData.booking_id}</span></div>
                <div>GST No.: <span id="customer-gstno">${billData.customer_gst || 'N/A'}</span></div>
            </div>
        </section>
    `;
}

function generateHotelItemsSection(billData, roomsData) {
    return `
        <section class="bill-items">
            <h4>Room Details</h4>
            <table>
                <thead>
                    <tr>
                        <th>Room No</th>
                        <th>Days Stayed</th>
                        <th>Rate/Day</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody id="room-items-body">
                    ${billData.room_details.map(room => {
                        const roomInfo = roomsData.find(r => r.id === room.room_id);
                        return `
                            <tr>
                                <td>${roomInfo ? roomInfo.room_number : 'N/A'}</td>
                                <td>${room.days_stayed}</td>
                                <td>₹${room.room_price.toFixed(2)}</td>
                                <td>₹${room.total.toFixed(2)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>

            ${billData.service_details.length > 0 ? `
                <h4>Service Details</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Room No</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody id="service-items-body">
                        ${billData.service_details.map(service => {
                            const roomInfo = roomsData.find(r => r.id === service.room_id);
                            return `
                                <tr>
                                    <td>${service.service_name}</td>
                                    <td>${roomInfo ? roomInfo.room_number : 'N/A'}</td>
                                    <td>₹${service.price.toFixed(2)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            ` : ''}
        </section>
    `;
}

function generateHotelFooter(billData) {
    return `
        <footer class="bill-footer">
            <table class="total-table">
                <tr>
                    <td>Total Amount:</td>
                    <td>₹${billData.total}</td>
                </tr>
                <tr>
                    <td>CGST (2.50%):</td>
                    <td>₹${billData.cgst_amount}</td>
                </tr>
                <tr>
                    <td>SGST (2.50%):</td>
                    <td>₹${billData.sgst_amount}</td>
                </tr>
                <tr class="net-amount">
                    <td>Net Amount:</td>
                    <td>₹${billData.net_amount}</td>
                </tr>
            </table>
            <div class="amount-in-words">
                Amount in Words: <span id="amount-words"></span>
            </div>
            <div class="bill-footer-text">
                * * * Thank you for staying with us! * * *
            </div>
        </footer>
    `;
}

function populateHotelBillData(billWindow, billData, roomsData) {
    const doc = billWindow.document;
    
    // Set amount in words
    const amountWords = billWindow.numberToWords.toWords(Math.floor(billData.net_amount))
        .replace(/-/g, ' ');
    doc.getElementById('amount-words').textContent = 
        `${capitalizeFirstLetter(amountWords)} Rupees Only`;

    // Trigger print after a short delay
    setTimeout(() => {
        billWindow.print();
    }, 500);
}



function payBillModal(item) {
    console.log('pay bill modal');
    console.log(item);

    const settleModal = document.getElementById('paymentModal');
    const settleModalContainer = document.querySelector('.modal-container2');
    const modalBodySettle = settleModal.querySelector('.modal-body');

    // Change display to flex for centering
    settleModalContainer.style.display = 'flex';
    settleModal.style.display = 'block';
    setTimeout(() => settleModal.classList.add('show'), 10);

    // Populate the modal with bill data
    populatePaymentModal(item);
}

function populatePaymentModal(bill) {
    console.log('populate payment modal');
    console.log(bill);

    const billNo = document.getElementById('order-id');
    billNo.value = bill.bill_no;

    const netAmount = document.getElementById('net-amt');
    netAmount.value = bill.net_amount;

    const paymentBtn = document.getElementById('payment-btn');
    paymentBtn.addEventListener('click', function () {
        paymentPOST(bill);
    });
}

function paymentPOST(bill) {
    console.log('payment post');
    console.log(bill);

    const paidAmt = document.getElementById('paid-amt').value;
    const paymentMessage = document.getElementById('payment-message').value;
    // Get selected payment method
    function getSelectedPaymentMethod() {
        const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
        return selectedPayment ? selectedPayment.value : null;
    }
    const paymentMethod = getSelectedPaymentMethod();

    console.log(paidAmt, paymentMessage, paymentMethod);

    const paymentDetails = {
        'message': paymentMessage,
    }

    const paymentData = {
        'bill_id': bill.id,
        'paid_amount': paidAmt,
        'payment_method': paymentMethod,
        'payment_details': paymentDetails,
        'status': 'paid'
    }
    console.log(paymentData);

    if (paidAmt && paymentMethod) {
        paymentPOSTcall(paymentData);
    } else {
        alert('Please enter the payment amount and select a payment method', 'error');
    }


    function paymentPOSTcall(paymentData) {
        console.log('payment post call');
        console.log(paymentData);

        const url = `${baseURL}billing/bill-payments/`;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData)
        }

        refreshAccessToken2(url, options)
            .then(data => {
                console.log(data);
                alert('Payment Successful', 'success');
                // window.location.reload();
            })
            .catch(error => {
                console.log('Error in payment POST call:', error);
                alert('Payment Failed', 'error');
            });

    }

}



// Close the settle modal
document.querySelector('.close-payment').onclick = function () {
    const settleModal = document.getElementById('paymentModal');
    const modalContainer = document.querySelector('.modal-container2');

    settleModal.classList.remove('show');
    setTimeout(() => {
        modalContainer.style.display = 'none';
        settleModal.style.display = 'none';
    }, 300);
}



document.querySelector('.load-table-blocks').textContent = 'Loading...';

// Retrieve tableList from localStorage
function getTableListFromLocalStorage() {
    const storedTableList = localStorage.getItem('tablesList');
    console.log('Stored Table List:', storedTableList);
    return storedTableList ? JSON.parse(storedTableList) : [];
}

console.log('Table List:', getTableListFromLocalStorage());

// Function to render the table list in HTML
function renderTableList() {
    const tableList = getTableListFromLocalStorage();
    const tableContainer = document.querySelector('.load-table-blocks');
    
    tableContainer.innerHTML = '';
    
    tableList.forEach(table => {
        const tableElement = document.createElement('div');
        tableElement.classList.add('table-item');
        tableElement.innerHTML = `
            <span>Table ${table.table_number}</span>
            <span>Status: ${table.occupied}</span>
        `;
        tableContainer.appendChild(tableElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    try {
        console.log('DOMContentLoaded event fired');
        renderTableList();
    } catch (error) {
        console.error('Error rendering table list:', error);
    }
});


// You can also add functions to update the localStorage when tables are added or modified
function addTable(tableData) {
    const tableList = getTableListFromLocalStorage();
    tableList.push(tableData);
    localStorage.setItem('tablesList', JSON.stringify(tableList));
    renderTableList();
}

// Example usage:
// addTable({ number: 5, capacity: 4, status: 'available' });

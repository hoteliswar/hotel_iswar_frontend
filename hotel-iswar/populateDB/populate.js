// baseURL = 'https://dineops.onrender.com/api/';
baseURL = 'https://hotel-iswar-backend.onrender.com/api/';

// Function to create categories
async function createCategories() {
    const categories = [
        { name: 'Appetizers', status: 'enabled' },
        { name: 'Main Course', status: 'enabled' },
        { name: 'Desserts', status: 'enabled' },
        { name: 'Beverages', status: 'enabled' }
    ];

    for (const category of categories) {
        await fetch(`${baseURL}foods/categories/`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getCookie('access_token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(category)
        });
    }
    console.log('Categories created');
}

// Function to create food items
async function createFoodItems() {
    const foodItems = [
        { name: 'Chicken Wings', price: 9.99, category: 1, status: 'enabled' },
        { name: 'Caesar Salad', price: 7.99, category: 1 , status: 'enabled' },
        { name: 'Grilled Salmon', price: 18.99, category: 1, status: 'enabled' },
        { name: 'Beef Steak', price: 22.99, category: 1, status: 'enabled' },
        { name: 'Chocolate Cake', price: 6.99, category: 1, status: 'enabled' },
        { name: 'Ice Cream', price: 4.99, category: 1, status: 'enabled' },
        { name: 'Soda', price: 2.99, category: 1, status: 'enabled' },
        { name: 'Coffee', price: 3.99, category: 1, status: 'enabled' }
    ];

    for (const item of foodItems) {
        await fetch(`${baseURL}foods/fooditems/`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getCookie('access_token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });
        console.log(item)
    }
    console.log('Food items created');
}

// Function to create tables
async function createTables() {
    const tables = [
        { table_number: 1},
        { table_number: 2},
        { table_number: 3},
        { table_number: 4},
        { table_number: 5},
        { table_number: 6},
        { table_number: 7},
        { table_number: 8},
        { table_number: 9},
        { table_number: 10},
        { table_number: 11},
        { table_number: 12}
    ];

    for (const table of tables) {
        await fetch(`${baseURL}foods/tables/`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getCookie('access_token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(table)
        });
    }
    console.log('Tables created');
}

// Main function to populate the database
async function populateDatabase() {
    try {
        await createCategories();
        await createFoodItems();
        await createTables();
        console.log('Database populated successfully');
        document.querySelector('.message').textContent = 'Database populated successfully';
    } catch (error) {
        console.error('Error populating database:', error);
        document.querySelector('.message').textContent = `Error populating database: ${error}`;
    }
}

// Call the function to populate the database
populateDatabase();

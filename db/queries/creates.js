const db = require("../connection");

async function createTables() {
  // 1. Products / Inventory Table
  await db.query(`CREATE TABLE products (
                    product_id SERIAL PRIMARY KEY,
                    barcode VARCHAR(100) UNIQUE NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    category VARCHAR(100) DEFAULT 'General OTC',
                    cost_price DECIMAL(10,2) NOT NULL,
                    retail_price DECIMAL(10,2) NOT NULL,
                    vat_rate DECIMAL(5,2) DEFAULT 20.00,
                    stock_quantity INT DEFAULT 0,
                    min_stock_level INT DEFAULT 5,
                    is_p_medicine BOOLEAN DEFAULT FALSE
                  );`);

  // 2. Shifts Table (Till/Cashier Management & Z-Report Data)
  await db.query(`CREATE TABLE shifts (
                    shift_id SERIAL PRIMARY KEY,
                    cashier_name VARCHAR(100) NOT NULL,
                    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    closed_at TIMESTAMP,
                    opening_float DECIMAL(10,2) NOT NULL,
                    expected_cash DECIMAL(10,2) DEFAULT 0.00,
                    closing_actual_cash DECIMAL(10,2),
                    total_cash_sales DECIMAL(10,2) DEFAULT 0.00,
                    total_card_sales DECIMAL(10,2) DEFAULT 0.00,
                    cash_discrepancy DECIMAL(10,2) DEFAULT 0.00,
                    is_closed BOOLEAN DEFAULT FALSE
                  );`);

  // 3. Transactions Table (Sales Receipts)
  await db.query(`CREATE TABLE transactions (
                    transaction_id SERIAL PRIMARY KEY,
                    shift_id INT NOT NULL REFERENCES shifts(shift_id),
                    subtotal DECIMAL(10,2) NOT NULL,
                    vat_total DECIMAL(10,2) NOT NULL,
                    discount_total DECIMAL(10,2) DEFAULT 0.00,
                    total_amount DECIMAL(10,2) NOT NULL,
                    payment_method VARCHAR(20) NOT NULL, 
                    status VARCHAR(20) DEFAULT 'COMPLETED',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                  );`);

  // 4. Transaction Items Table (Line Items per Receipt)
  await db.query(`CREATE TABLE transaction_items (
                    transaction_item_id SERIAL PRIMARY KEY,
                    transaction_id INT NOT NULL REFERENCES transactions(transaction_id) ON DELETE CASCADE,
                    product_id INT NOT NULL REFERENCES products(product_id),
                    product_name VARCHAR(255) NOT NULL,
                    quantity INT NOT NULL,
                    unit_price DECIMAL(10,2) NOT NULL,
                    vat_rate DECIMAL(5,2) NOT NULL,
                    line_total DECIMAL(10,2) NOT NULL
                  );`);

  // 5. Inventory Adjustments Table (Stock Audits, Deliveries, Waste)
  await db.query(`CREATE TABLE inventory_adjustments (
                    adjustment_id SERIAL PRIMARY KEY,
                    product_id INT NOT NULL REFERENCES products(product_id),
                    change_quantity INT NOT NULL,
                    reason VARCHAR(50) NOT NULL, 
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                  );`);
}

module.exports = createTables;

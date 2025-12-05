import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


// ==================== TYPES ====================
export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: string;
  img: string;
  categoryId: number;
};
export type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};
export type CartItem = {
  cartId: number;
  productId: number;
  name: string;
  img: string;
  price: string;
  quantity: number;
};
type Order = {
  id: number;
  userId: number;
  totalPrice: number;
  orderDate: string;
  items?: any[];
  phone: string;
  paymentMethod: string;
};
// ==================== DATABASE ====================

// Mở hoặc tạo database 
let db: SQLite.SQLiteDatabase | null = null;

const getDB = async (): Promise<SQLite.SQLiteDatabase> => {
    if(db) return db;
    db = await SQLite.openDatabaseAsync('DatabaseSevenCake6.db');
    return db;
}

// ==================== DỮ LIỆU MẪU ====================
const initialCategories: Category[] = [
  { id: 1, name: 'Pudding' },
  { id: 2, name: 'Cup Cake' },
  { id: 3, name: 'Macaron' },
  { id: 4, name: 'Donuts' },
];

const initialProducts: Product[] = [
  { id: 1, name: 'Vanilla Pudding', price: '25.000', img: 'Vanilla_Pudding.jpg', categoryId: 1 },
  { id: 2, name: 'Gourmet Red Velvet Cupcake', price: '15.000', img: 'Gourmet_Red_Velvet_Cupcake.jpg', categoryId: 2 },
  { id: 3, name: 'Cherry Flan Pudding', price: '50.000', img: 'Cherry_Flan_Pudding.jpg', categoryId: 1 },
  { id: 4, name: 'Salted Caramel Macarons', price: '20.000', img: 'Salted_Caramel_Macarons.jpg', categoryId: 3 },
];
const initialUsers: User[] = [
  {id: 1, username: 'Chang', password: '777', role:'user'},
  {id: 2, username: 'admin', password: 'admin', role: 'admin'}
];

// ==================== KHỞI TẠO DB ====================
export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
  const database = await getDB();

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price TEXT,
      img TEXT,
      categoryId INTEGER,
      FOREIGN KEY (categoryId) REFERENCES categories (id)
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      username TEXT UNIQUE, 
      password TEXT, 
      role TEXT
    );
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      productId INTEGER,
      quantity INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (productId) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      totalPrice INTEGER,
      status TEXT,
      orderDate TEXT,
      phone TEXT,
      paymentMethod TEXT,
      FOREIGN KEY (userId) REFERENCES users(id)
    );


    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId INTEGER,
      productId INTEGER,
      quantity INTEGER,
      price TEXT,
      FOREIGN KEY (orderId) REFERENCES orders(id),
      FOREIGN KEY (productId) REFERENCES products(id)
    );


  `);

  // Chèn dữ liệu mẫu
  for (const category of initialCategories) {
    await database.runAsync(
      `INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?);`,
      [category.id, category.name]
    );
  }

  for (const product of initialProducts) {
    await database.runAsync(
      `INSERT OR IGNORE INTO products (id, name, price, img, categoryId) VALUES (?, ?, ?, ?, ?);`,
      [product.id, product.name, product.price, product.img, product.categoryId]
    );
  }

  for (const user of initialUsers) {
    await database.runAsync(
      `INSERT OR IGNORE INTO users (id, username, password, role) VALUES (?,?,?,?);`,
      [user.id,user.username, user.password, user.role]
    )
  }

  console.log('✅ Database initialized');
  if (onSuccess) onSuccess();
};

// ==================== CATEGORIES ====================
export const fetchCategories = async (): Promise<Category[]> => {
  const database = await getDB();
  const rows = await database.getAllAsync<Category>('SELECT * FROM categories;');
  return rows;
};

// Add Category
export const addCategory = async (name: string): Promise<boolean> => {
  try {
    const database = await getDB();
    await database.runAsync('INSERT INTO categories (name) VALUES (?);', [name]);
    Alert.alert('✅ Category added successfully:', name);
    return true;
  } catch {
    Alert.alert('❌ Error adding category');
    return false;
  }
}
// Update Category
export const updateCategory = async (id: number, newName: string): Promise<boolean> => {
  try {
    const database = await getDB();
    await database.runAsync(`UPDATE categories SET name = ? WHERE id = ?`, [newName, id]);
    Alert.alert(`✅ Category updated successfully:`, newName);
    return true;
  } catch {
    Alert.alert('❌ Error updating category');
    return false;
  }
}
// Delete category
export const deleteCategory = async (id: number): Promise<boolean> => {
  try {
    const database = await getDB();
    await database.runAsync(`DELETE FROM categories WHERE id = ?`,[id]);
    Alert.alert(`✅ Category deleted successfully`);
    return true;
  } catch {
    Alert.alert('❌ Error deleting category');
    return false;
  }
}
// ==================== PRODUCTS ====================
export const fetchProducts = async (): Promise<Product[]> => {
  const database = await getDB();
  const rows = await database.getAllAsync<Product>('SELECT * FROM products;');
  return rows;
};
// Add product
export const addProduct = async (product:Product): Promise<boolean> => {
  try {
    const database = await getDB();
    await database.runAsync(`INSERT INTO products (name, price, img, categoryId) VALUES (?, ?, ?, ?);`,
      [product.name, product.price, product.img, product.categoryId]
    )
    return true;
  } catch {
    Alert.alert('❌ Error adding product');
    return false;
  }
}
// Update Product
export const updateProduct = async (product:Product): Promise<boolean> => {
  try {
    const database = await getDB();
    await database.runAsync(`UPDATE products SET name = ?, price = ?, img = ?, categoryId = ? WHERE id = ?;`,
      [product.name, product.price, product.img, product.categoryId, product.id]
    )
    return true;
  } catch {
    Alert.alert('❌ Error updating product');
    return false;
  }
}
// Delete Product
export const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    const database = await getDB();
    await database.runAsync(`DELETE FROM products WHERE id = ?`,[id]);
    return true;
  } catch {
    Alert.alert('❌ Error deleting product');
    return false;
  }
}

// Login
export const getUserByUsername = async (username: string) => {
  const db = await getDB();
  return await db.getFirstAsync(`SELECT * FROM users WHERE username = ?`, [username]);
};

// ------------------ CRUD USERS -----------------
// ➕ Add User
export const addUser = async (username: string, password: string, role: string): Promise<boolean> => {
  try {
    const database = await getDB();
    await database.runAsync(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, password, role]
    );
    console.log('✅ User added');
    return true; // Thêm thành công
  } catch (error) {
    console.error('❌ Error adding user:', error);
    return false; // Thêm thất bại
  }
};

// UPDATE user
export const updateUser = async (user: User): Promise<boolean> => {
  try {
    const database = await getDB();
    await database.runAsync(
      'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?;',
      [user.username, user.password, user.role, user.id]
    );
    return true;
  } catch (err) {
    console.error("❌ Error updating user:", err);
    return false;
  }
};

// DELETE user
export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const database = await getDB();
    await database.runAsync('DELETE FROM users WHERE id = ?;', [id]);
    return true;
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    return false;
  }
};

// fetchUsers
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const database = await getDB();
    const rows = await database.getAllAsync<User>('SELECT * FROM users;');
    return rows;
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    return [];
  }
};

// get user by credentials
export const getUserByCredentials = async (username: string, password: string): Promise<User | null> => {
  try {
    const database = await getDB();
    const rows = await database.getAllAsync<User>(
      'SELECT * FROM users WHERE username = ? AND password = ?;',
      [username, password]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("❌ Error login:", err);
    return null;
  }
};

// get user by id
export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const database = await getDB();
    const rows = await database.getAllAsync<User>(
      'SELECT * FROM users WHERE id = ?;',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("❌ Error get user by id:", err);
    return null;
  }
};
// Update profile
export const updateUserProfile = async (id: number, username: string, password: string) => {
  const db = await getDB();
  await db.runAsync(
    `UPDATE users SET username = ?, password = ? WHERE id = ?`,
    [username, password, id]
  );
  Alert.alert('🔄 Cập nhật thông tin thành công');
};

// ====================Cart===============
const parsePrice = (priceString: string | number): number => {
    if (typeof priceString === 'number') return priceString; 
    
    if (typeof priceString === 'string') {
        const cleanedPrice = priceString.replace(/,/g, '');
        return parseInt(cleanedPrice, 10) || 0;
    }
    return 0;
};
// Add to cart 
export const addToCart = async (userId: number, productId: number): Promise<void> => {
  const db = await getDB();
  try {
    await db.runAsync(`
      INSERT INTO cart (userId, productId, quantity)
      VALUES (?, ?, 1)
      ON CONFLICT(userId, productId) DO UPDATE SET quantity = quantity + 1;
    `,[userId, productId]);
  } catch (err) {
    try {
      const exists = await db.getAllAsync<{ id: number; quantity: number }>(
        `SELECT id, quantity FROM cart WHERE userId = ? AND productId = ?;`,
        [userId, productId]
      );

      if (exists.length > 0) {
        const id = exists[0].id;
        const qty = exists[0].quantity + 1;
        await db.runAsync(`UPDATE cart SET quantity = ? WHERE id = ?`, [qty, id]);
      } else {
        await db.runAsync(
          `INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, 1);`,
          [userId, productId]
        );
      }
    } catch (e) {
      console.error('Error addToCart fallback:', e);
    }
  }
};

// Fetch cart
export const fetchCart = async (userId: number): Promise<CartItem[]> => {
  const db = await getDB();
  const rows = await db.getAllAsync<(CartItem & any)>(`
    SELECT cart.id AS cartId, cart.productId AS productId, products.name AS name, products.img AS img, products.price AS price, cart.quantity AS quantity
    FROM cart
    JOIN products ON cart.productId = products.id
    WHERE cart.userId = ?;
  `, [userId]);
  return rows.map(r => ({
    cartId: r.cartId,
    productId: r.productId,
    name: r.name,
    img: r.img,
    price: r.price,
    quantity: r.quantity
  }));
};

export const fetchCartItems = async (): Promise<CartItem[]> => {
  try {
    const logged = await AsyncStorage.getItem('loggedInUser');
    if (!logged) return [];
    const user = JSON.parse(logged);
    return await fetchCart(user.id);
  } catch (err) {
    console.error('fetchCartItems error', err);
    return [];
  }
};

// Update Quantity (giữ nguyên nhưng trả về alias dùng trong UI)
export const updateCartQuantity = async (cartId: number, quantity: number) => {
  const db = await getDB();
  await db.runAsync(`UPDATE cart SET quantity = ? WHERE id = ?`, [quantity, cartId]);
};

// Remove cart item (alias)
export const removeCartItem = async (cartId: number) => {
  const db = await getDB();
  await db.runAsync(`DELETE FROM cart WHERE id = ?`, [cartId]);
};

// UI dùng tên deleteCartItem -> cung cấp alias
export const deleteCartItem = async (cartId: number) => {
  return removeCartItem(cartId);
};

// Checkout 
export const checkout = async (
  userId: number,
  phone: string,
  paymentMethod: string
): Promise<boolean> => {
  try {
    const db = await getDB();
    const cartItems = await fetchCart(userId);

    if (!cartItems || cartItems.length === 0) return false;

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + parsePrice(item.price) * item.quantity,
      0
    );

    const orderDate = new Date().toISOString();

    const result = await db.runAsync(
      `INSERT INTO orders (userId, totalPrice, status, orderDate, phone, paymentMethod)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, totalPrice, 'Pending', orderDate, phone, paymentMethod]
    );

    const orderId = (result as any).lastInsertRowId;

    for (const item of cartItems) {
      await db.runAsync(
        `INSERT INTO order_items (orderId, productId, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    await db.runAsync(`DELETE FROM cart WHERE userId = ?`, [userId]);
    return true;

  } catch (err) {
    console.error("checkout error:", err);
    return false;
  }
};


export const checkoutOrder = async (phone: string, paymentMethod: string): Promise<boolean> => {
  try {
    const logged = await AsyncStorage.getItem('loggedInUser');
    if (!logged) {
      Alert.alert('Please log in to place an order');
      return false;
    }

    const user = JSON.parse(logged);
    const success = await checkout(user.id, phone, paymentMethod);

    Alert.alert(success ? '🎉 Order placed successfully' : '❌ Failed to place order');
    return success;

  } catch (err) {
    console.error('checkoutOrder error', err);
    Alert.alert('❌ Error while processing your order');
    return false;
  }
};


export const fetchOrders = async (userId?: number): Promise<any[]> => {
  try {
    const db = await getDB();

    const query = `
      SELECT o.id, o.totalPrice, o.status, o.orderDate, u.username 
      FROM orders o
      JOIN users u ON u.id = o.userId
      ${userId ? "WHERE o.userId = ?" : ""}
      ORDER BY o.orderDate DESC;
    `;

    const params = userId ? [userId] : [];
    return await db.getAllAsync(query, params) as any[];

  } catch (err) {
    console.error("❌ fetchOrders error:", err);
    return [];
  }
};


// Lấy lịch sử đơn hàng 
export const fetchOrdersByUser = async (): Promise<any[]> => {
  try {
    const logged = await AsyncStorage.getItem('loggedInUser');
    if (!logged) return [];

    const user = JSON.parse(logged);
    return await fetchOrders(user.id); // Tái sử dụng hàm phía trên!

  } catch (err) {
    console.error("❌ fetchOrdersByUser error:", err);
    return [];
  }
};


export const fetchOrdersWithItemsByUser = async () => {
  try {
    const logged = await AsyncStorage.getItem('loggedInUser');
    if (!logged) return [];

    const userId = JSON.parse(logged).id;
    const db = await getDB();

    const orders = await db.getAllAsync(`
      SELECT id, userId, totalPrice, status, orderDate
      FROM orders
      WHERE userId = ?
      ORDER BY orderDate DESC;
    `, [userId]) as any[];

    for (const order of orders) {
      // totalPrice đã là INTEGER → không cần ép kiểu
      const items = await db.getAllAsync(`
        SELECT 
          oi.productId,
          p.name AS productName,
          oi.quantity,
          oi.price
        FROM order_items oi
        JOIN products p ON p.id = oi.productId
        WHERE oi.orderId = ?;
      `, [order.id]);

      order.items = items ?? [];
    }

    return orders;

  } catch (err) {
    console.error("❌ fetchOrdersWithItemsByUser error:", err);
    return [];
  }
};


export const fetchOrderItems = async (orderId: number) => {
  const db = await getDB();
  return await db.getAllAsync(`
    SELECT p.name AS productName, oi.quantity, oi.price
    FROM order_items oi
    JOIN products p ON p.id = oi.productId
    WHERE oi.orderId = ?;
  `, [orderId]);
};

// Update
export const updateOrderStatus = async (orderId: number, newStatus: string) => {
  const db = await getDB();
  await db.runAsync(
    `UPDATE orders SET status = ? WHERE id = ?`,
    [newStatus, orderId]
  );
};

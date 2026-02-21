import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("ecommerce.db");

// 1. Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    category TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    address TEXT NOT NULL,
    total REAL NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY(order_id) REFERENCES orders(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

// 2. Seeding Logic (Fixed to ensure all 11 products exist)
const productCount = db.prepare("SELECT count(*) as count FROM products").get() as { count: number };

// Change 'true' to 'false' after your first run to stop the constant resetting
if (productCount.count < 11 || true) { 
  console.log("Refreshing database products...");
  db.prepare("DELETE FROM order_items").run();
  db.prepare("DELETE FROM reviews").run();
  db.prepare("DELETE FROM orders").run();
  db.prepare("DELETE FROM products").run();

  const seedProducts = [
    { name: "Xanax (Alprazolam)", price: 15.00, category: "Anxiety", image: "/images/xanax.jpg", description: "1 Strip (£15), 5 (£60), 10 (£90)" },
    { name: "Diazepam", price: 13.00, category: "Anxiety", image: "/images/diazepam.jpg", description: "1 Strip (£13), 5 (£70), 10 (£100)" },
    { name: "Zopiclone", price: 10.00, category: "Anxiety", image: "/images/zopiclone.jpg", description: "1 Strip (£10), 3 (£20), 5 (£35), 10 (£50)" },
    { name: "Pregabalin", price: 30.00, category: "Pain Killers", image: "/images/pregabalin.jpg", description: "4 Strips (£30), 6 (£40), 10 (£60)" },
    { name: "Gabapentin", price: 20.00, category: "Pain Killers", image: "/images/gabapentin.jpg", description: "4 Strips (£20), 6 (£35), 10 (£50)" },
    { name: "Pain O Soma", price: 20.00, category: "Pain Killers", image: "/images/pain-o-soma.jpg", description: "2 Strips (£20), 5 (£40), 10 (£70)" },
    { name: "Amber Leaf Tobacco", price: 25.00, category: "Tobacco", image: "/images/amber-leaf.jpg", description: "50g Pouch. Bulk deals available." },
    { name: "Amber Leaf Blonde", price: 24.00, category: "Tobacco", image: "/images/amber-leaf.jpg", description: "50g Pouch. Lighter leaf blend." },
    { name: "Gold Leaf Tobacco", price: 22.00, category: "Tobacco", image: "/images/amber-leaf.jpg", description: "50g Pouch. Premium rolling leaf." },
    { name: "Cali-Purple-Runts", price: 35.00, category: "Bud-Weed", image: "/images/cali-purple-runts.jpg", description: "3.5g (£35) up to 28g (£190)" },
    { name: "Stardawg", price: 25.00, category: "Bud-Weed", image: "/images/stardog.jpg", description: "3.5g (£25) up to 28g (£160)" }
  ];

  const insert = db.prepare("INSERT INTO products (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)");
  for (const p of seedProducts) {
    insert.run(p.name, p.description, p.price, p.image, p.category);
  }
}

// 3. Start Server
async function startServer() {
  const app = express();
  
  // FIX: Casting to any avoids the PathParams/RequestHandler conflict
  app.use(express.json() as any);

  app.get("/api/products", (req, res) => {
    const products = db.prepare(`
      SELECT p.*, 
             COALESCE(AVG(r.rating), 0) as avg_rating,
             COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      GROUP BY p.id
    `).all();
    res.json(products);
  });

  app.get("/api/products/:id", (req, res) => {
    const product = db.prepare(`
      SELECT p.*, 
             COALESCE(AVG(r.rating), 0) as avg_rating,
             COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.id = ?
      GROUP BY p.id
    `).get(req.params.id);
    
    if (product) {
      const reviews = db.prepare("SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC").all(req.params.id);
      res.json({ ...(product as any), reviews });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  app.post("/api/orders", (req, res) => {
    const { customer_name, customer_email, address, total, payment_method } = req.body;
    try {
      const info = db.prepare(`
        INSERT INTO orders (customer_name, customer_email, address, total, payment_method)
        VALUES (?, ?, ?, ?, ?)
      `).run(customer_name, customer_email, address, total, payment_method);
      res.status(201).json({ orderId: info.lastInsertRowid });
    } catch (e) {
      res.status(500).json({ error: "Order failed" });
    }
  });

  app.get("/api/orders/:id", (req, res) => {
    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });

  app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body;
    console.log(`Contact Form Submission to crezzyocco@gmail.com:`);
    console.log(`From: ${name} <${email}>`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    
    // In a real production environment, you would use a service like SendGrid, Mailgun, or Nodemailer here.
    // Example: await sendEmail({ to: 'crezzyocco@gmail.com', from: email, subject, text: message });
    
    res.status(200).json({ success: true });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    (app as any).use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")) as any);
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
# Auspify Task 4 - Full-Stack E-Commerce Platform

A complete, production-ready MERN stack e-commerce application built for the Auspify Technologies Full Stack Internship. 

## 🚀 Core Features

### User Features
- **Secure Authentication:** JWT-based Register and Login system.
- **Product Catalog:** Browse premium products with search functionality.
- **Shopping Cart:** Add, remove, and update quantities with persistent local storage state.
- **Checkout System:** Secure checkout process with shipping address collection.
- **Order History:** Users can view their past orders and track their status.

### Admin Features (Role-Based Access Control)
- **Sales Analytics:** Dashboard showing Total Revenue, Orders, Products, and Customers.
- **Product Management:** Full CRUD capabilities to Add and Delete products.
- **Order Management:** View all customer orders and update their shipping status (Pending, Processing, Shipped, Delivered).
- **Customer Directory:** View a list of all registered users on the platform.

## 🛠️ Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Framer Motion, React Router
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Security:** JSON Web Tokens (JWT), bcryptjs (password hashing)

## 💻 How to Run Locally

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/SmartCode-Hubs/auspify-task4-ecommerce.git
   \`\`\`

2. **Setup the Backend:**
   \`\`\`bash
   cd backend
   npm install
   # Create a .env file and add:
   # PORT=5000
   # MONGO_URI=your_mongodb_connection_string
   # JWT_SECRET=your_secret_key
   npm run dev
   \`\`\`

3. **Setup the Frontend:**
   \`\`\`bash
   cd ../frontend
   npm install
   npm run dev
   \`\`\`

4. **Seed the Database:**
   Once the backend is running, send a POST request to `http://localhost:5000/api/products/seed` to populate the store with initial products.

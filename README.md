K-Radiancy is a full-featured e-commerce web application dedicated to offering authentic Korean skincare products. Built with the MERN stack (MongoDB, Express, React, Node.js), it provides users with a smooth and responsive shopping experience, secure transactions, and intuitive UI.

🎯 Project Purpose
The K-Radiancy App aims to make the best Korean skincare brands easily accessible to global users. It focuses on:

Offering a reliable, user-friendly platform for browsing and purchasing products.
Providing secure authentication and user data management.
Enabling order tracking and payment handling in a professional, scalable architecture.

✨ Features
User registration and authentication
Product listing, search, and detailed views
Add to cart and cart preview
Checkout with payment selection
Order placement and history view
Admin dashboard for product/user/order management

🛠️ Technologies Used
Frontend:
React – Building dynamic, component-based UI
Redux – Managing global state for user/cart/order
Axios – Handling API requests to backend
React Router – Page routing and navigation

Backend:
Node.js & Express – Building REST APIs and server logic
MongoDB – Storing products, users, orders
Mongoose – ODM to interact with MongoDB
dotenv – Manage environment variables
cors & morgan – Enable cross-origin requests & logging
Authentication & Security
bcryptjs – Password hashing
jsonwebtoken (JWT) – User authentication tokens
express-async-handler – Simplify error handling in async routes

📦 Installation Guide
Backend Setup
Navigate to the backend folder:

cd backend
Install dependencies:

npm install
Create a .env file and add the following:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_CLOUD_NAME
CLOUDINARY_API_KEY=your_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=your_CLOUDINARY_API_SECRET
PORT=5000

Start the backend server:
nodemon  or node server.js

Frontend Setup
Navigate to my-app folder:

cd my-app
Install dependencies:

npm install
Start the frontend:

npm start

📦 Project Dependencies Overview
This document lists and explains all the major dependencies used in the frontend and backend of this project.

🖥️ my-app (Frontend) Dependencies (React)
Package	Description
@fortawesome/fontawesome-svg-core	Core utilities for FontAwesome icons.
@fortawesome/free-regular-svg-icons	Regular style icons (e.g., outlined) from FontAwesome.
@fortawesome/free-solid-svg-icons	Solid style icons (e.g., filled) from FontAwesome.
@fortawesome/react-fontawesome	React components for using FontAwesome icons.
axios	Promise-based HTTP client for making API calls.
bootstrap	Popular CSS framework for responsive design.
react	Core library for building user interfaces.
react-dom	React package for rendering components to the DOM.
react-scripts	Configuration and scripts used by Create React App (CRA).
react-bootstrap	React components built using Bootstrap styles.
react-router-dom	Client-side routing for React apps.
react-router-bootstrap	Integration between React Router and React-Bootstrap nav components.
react-icons	Icon library supporting FontAwesome, Material, and more.
react-toastify	Toast notification library for feedback messages.
mdb-react-ui-kit	Material Design UI components based on Bootstrap.
react-helmet	Manage HTML head (e.g., title, meta) for React apps.
react-helmet-async	Async-ready version of react-helmet for SSR support.
react-google-charts	React wrapper for rendering Google Charts.
web-vitals	Collects and reports performance metrics (e.g., LCP, FID).

🛠️ Backend Dependencies (Node.js/Express)
Package	Description
bcryptjs	Hash and compare passwords securely.
cloudinary	Upload, store, and manage images in the cloud.
dotenv	Load environment variables from .env into process.env.
express	Minimal and flexible web framework for Node.js.
jsonwebtoken	Sign and verify JSON Web Tokens (JWT) for user authentication.
mongoose	ODM (Object Data Modeling) library for MongoDB and Node.js.
multer	Middleware for handling multipart/form-data (e.g., file uploads).
nodemailer	Send emails from the backend (SMTP, Gmail, etc.).
nodemon	Development tool that restarts server on file changes automatically.

📁 Folder Structure (Suggested)
k-radiancy-mern-app/ │ ├── my-app/ # React Frontend │ └── package.json # Frontend dependencies │ ├── backend/ # Express server │ └── package.json # Backend dependencies │ └── README.md # This file

📢 Project Presentation
Good morning/afternoon everyone,

I’m thrilled to present K-Radiancy, a modern e-commerce application focused exclusively on Korean skincare. This project was created to meet the growing demand for high-quality K-beauty products with a reliable, accessible platform that puts the user experience first.

Built with the powerful MERN stack—MongoDB, Express, React, and Node.js—K-Radiancy ensures a responsive and performant architecture. On the frontend, React and Redux provide a seamless interface and consistent global state management, while Axios enables efficient data exchange with our backend.

The backend, using Express and MongoDB, is designed for scalability, security, and clean API development. We integrated JWT-based authentication to safeguard user sessions, and Mongoose gives us a clean, schema-based structure for our database.

Ultimately, K-Radiancy isn’t just a shop—it’s an experience tailored for skincare enthusiasts who care about product quality, ease of use, and modern design.

Thank you!

Feel free to contribute, test, or offer suggestions via issues and pull requests.

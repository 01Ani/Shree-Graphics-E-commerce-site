# Shree Graphics E-commerce Site

This is a **work in progress** proprietary e-commerce website designed for the printing industry, offering services like printed panels, offset printing, and other industrial printing solutions. The platform allows users to browse and purchase various printing services for commercial and personal use.

## 🚀 Features (Work in Progress)

- User registration and login (authentication using Passport.js)
- Create, read, update, and delete (CRUD) operations for products
- RESTful routing structure
- Flash messages for user feedback
- Error handling and form validation
- Product catalog with filtering options
- Shopping cart functionality
- Checkout simulation
- Admin dashboard for managing products

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- EJS Templating Engine
- Passport.js (Authentication)
- Bootstrap 5

## 📂 Folder Structure

<pre> ```Shree-Graphics-E-commerce-site/
├── config/ # Configuration files
│ └── middleware.js # Custom middleware (e.g., for authentication checks)
|
├── models/ # Mongoose models for MongoDB collections
│ ├── product.js # Product schema
│ ├── category.js # Category schema
│ └── user.js # User schema (if you have user authentication)
│
├── routes/ # Define application routes
│ ├── productRoutes.js # Routes for handling products
│ ├── categoryRoutes.js # Routes for handling categories
│ └── userRoutes.js # Routes for handling users (if applicable)
│
├── seeds/ # Data seeding scripts for populating the DB
│ ├── index.js # Main seeding file
│ └── seedHelpers.js # Helpers for seeding products, categories, etc.
│
├── public/ # Publicly accessible files (images, styles, scripts)
│ ├── css/ # Stylesheets (e.g., Bootstrap, custom styles)
│ ├── js/ # Client-side JavaScript
│ └── images/ # Product images and other media
│
├── views/ # Views for rendering pages (using EJS or any templating engine)
│ ├── layouts/ # Layout files (e.g., boilerplate, navigation bar)
│ ├── products/ # Product-related views (e.g., product list, product details)
│ ├── categories/ # Category-related views
│ └── users/ # User-related views (if applicable)
│
├── .gitignore # Files to be ignored by Git
├── app.js # Entry point of the app (Express setup)
├── package.json # Project metadata and dependencies
└── README.md # Project description and documentation``` </pre>

📄 License

This project is proprietary and cannot be used, copied, modified, or distributed without prior written permission from Shree Graphics.

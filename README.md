# MiniInsta

MiniInsta is a simple yet powerful social media platform built with the **MERN Stack** (**MongoDB**, **Express.js**, **React + TypeScript**, **Node.js**), featuring full authentication, post creation, commenting, and profile management.

## 🚀 Features

- 🔐 User Authentication (Register / Login)
- 📝 Create, Delete, and Like Posts
- 💬 Commenting System
- 👤 Profile Management with Image Upload
- 🔒 Protected Routes using JWT
- 🌐 Fully responsive frontend using Material UI

## 🛠️ Installation

1. **Clone the repository:**

   ```bash
   git clone <repository_link>
   cd mininsta
   ```

2. **Install dependencies:**

   ```bash
   npm install
   cd client
   npm install
   ```

3. **Setup environment variables:**

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
```

If needed, create one in `/client`:

```env
VITE_API_URL=http://localhost:5000
```

4. **Run the backend server:**

   ```bash
   npm run server
   ```

5. **Run the frontend app:**

   ```bash
   cd client
   npm run dev
   ```

## 🔗 API Endpoints

| Endpoint                | Method | Description              |
| ----------------------- | ------ | ------------------------ |
| `/api/users/register`   | POST   | Register a new user      |
| `/api/users/login`      | POST   | Log in an existing user  |
| `/api/users/profile`    | GET    | Get current user profile |
| `/api/posts/createPost` | POST   | Create a new post        |
| `/api/posts/all`        | GET    | Get all posts            |
| `/api/posts/:id/delete` | DELETE | Delete a specific post   |

## 📁 Project Structure

```
/ - Root
├── client/               # Frontend (React + TypeScript)
├── controllers/          # Express Controllers
├── models/               # Mongoose Models
├── routes/               # Express Routes
├── middlewares/          # JWT Auth & Multer
├── config/               # Cloudinary Config
├── server.js             # Express Server Entry Point
├── .env                  # Environment Variables
└── README.md             # Project Documentation
```

## 👨‍💻 Author

Developed with ❤️ by **Hasan Alsubaih**

## 🚀 Deployment

You can deploy:

- Frontend using **Vercel** or **Netlify**
- Backend using **Render**, **Railway**, or **Heroku**

Make sure to configure your environment variables in the hosting dashboard accordingly.

---

**Happy Coding! 🌟**

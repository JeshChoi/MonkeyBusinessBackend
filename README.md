# Monkey Business Backend

Welcome to the backend server for Monkey Business, the innovative social media platform. This backend is responsible for all CRUD operations, authentication, authorization, and data management.

## Technologies Used

- **Database**: MongoDB
- **Backend Framework**: Express.js
- **Authentication and Authorization**: JSON Web Tokens (JWT)

## Features

1. **JWT Authentication**: Secure authentication using JWT, ensuring user data privacy and security.
2. **Authorization**: Advanced authorization to differentiate user roles and permissions.
3. **CRUD Operations**: Allows Create, Read, Update, and Delete operations for users, posts, and comments on Monkey Business.

## Endpoints

### Users

- **GET** `/api/users`: Fetch all users.
- **POST** `/api/users`: Create a new user.
- **GET** `/api/users/:id`: Fetch a specific user.
- **PUT** `/api/users/:id`: Update a user's details.
- **DELETE** `/api/users/:id`: Delete a user.

### Posts

- **GET** `/api/posts`: Fetch all posts.
- **POST** `/api/posts`: Create a new post.
- **GET** `/api/posts/:id`: Fetch a specific post.
- **PUT** `/api/posts/:id`: Update a post's details.
- **DELETE** `/api/posts/:id`: Delete a post.

### Comments

- **GET** `/api/comments`: Fetch all comments.
- **POST** `/api/comments`: Create a new comment.
- **GET** `/api/comments/:id`: Fetch a specific comment.
- **PUT** `/api/comments/:id`: Update a comment's details.
- **DELETE** `/api/comments/:id`: Delete a comment.

> **Note**: Please replace the placeholder endpoints with the actual endpoints from your code if they differ.

## Getting Started

1. Clone the repository:
```
git clone https://github.com/Jomango2003/MonkeyBusinessBackend.git
```

2. Navigate into the directory:
```
cd MonkeyBusinessBackend
```

3. Install the necessary packages:
```
npm install
```

4. Start the server:
```
npm start
```

For detailed setup and additional configurations, please refer to the comments in the source code.

---
# 📦 **RateEverything — Technical Handoff (FULL SPEC)**

This document provides a complete technical overview of the RateEverything MERN project so any teammate / AI assistant can immediately continue development.

---

# 🟪 **1. Project Purpose**

RateEverything is a MERN application that lets authenticated users:

* Create items
* Upload optional metadata (category, later image URL)
* View and rate items (1–5 stars)
* Write reviews with text
* Automatically generate “judgement” metadata using an internal analysis engine
* See all reviews for each item
* Delete (later edit) their own reviews

Now includes **full JWT authentication**.

---

# 🟦 **2. Tech Stack**

### **Frontend**

* React 19
* React Router DOM 7
* Tailwind CSS
* Axios (with token interceptor)

### **Backend**

* Node.js (ESM modules)
* Express 4
* Mongoose 8
* JWT for authentication
* bcrypt for password hashing

### **Database**

* MongoDB (local)
* Collections: `users`, `items`

---

# 🟩 **3. Directory Structure**

```
RateEverything/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── api/
│       │   ├── axiosClient.js
│       │   ├── items.js
│       │   └── auth.js
│       ├── context/
│       │   ├── AuthContext.jsx   (contains context + provider)
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── PrivateRoute.jsx
│       │   └── RatingStars.jsx
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Home.jsx
│           ├── AddItem.jsx
│           ├── ItemDetails.jsx
│           └── NotFound.jsx
│
└── server/
    ├── package.json
    ├── .env.example
    └── src/
        ├── index.js
        ├── app.js
        ├── config/
        │   └── db.js
        ├── models/
        │   ├── User.js
        │   └── Item.js
        ├── controllers/
        │   ├── itemController.js
        │   └── authController.js
        ├── middleware/
        │   └── auth.js
        ├── routes/
        │   ├── itemRoutes.js
        │   └── authRoutes.js
        └── utils/
            └── analyzeReview.js
```

---

# 🟨 **4. Backend Overview**

## **4.1 Mongoose Models**

---

### **User Model (`User.js`)**

Fields:

```js
username: String (unique)
password: String (hashed with bcrypt)
```

Methods:

* Hash password on save (`pre("save")`)
* `comparePassword()` for login authentication

---

### **Item Model (`Item.js`)**

Structure:

```js
name: String
category: String
averageRating: Number (auto-updated)
reviews: [
  {
    username: String,        // from authenticated user
    rating: Number,          // 1–5
    review: String,          // text
    judgement: { ... },      // auto-generated
    createdAt: Date
  }
]
```

---

### **Judgement Engine (`analyzeReview.js`)**

Given `(review text, star rating)` it determines:

* sentiment
* exaggeration
* contradictions
* emojis
* category: `"hater" | "enjoyer" | "dramatic" | "emoji_lord" | "exaggerator" | "basic"`
* full judgement object stored inside each review

Integrated directly in `addReview()`.

---

# 🟥 **5. Backend API**

## **5.1 Auth Routes (`/auth`)**

### `POST /auth/register`

Body:

```json
{
  "username": "abc",
  "password": "123"
}
```

Creates a new user (hashed password).

---

### `POST /auth/login`

Body:

```json
{
  "username": "abc",
  "password": "123"
}
```

Returns:

```json
{
  "token": "...JWT...",
  "username": "abc"
}
```

Token encodes `{ username }`.
Used via `Authorization: Bearer <token>`.

---

## **5.2 Item Routes (`/items`)**

### `GET /items`

Returns all items.

---

### `GET /items/:id`

Returns full item + embedded reviews.

---

### `POST /items`

Create a new item.

Body:

```json
{
  "name": "...",
  "category": "..."
}
```

---

### `POST /items/:id/review` (Authenticated)

Body:

```json
{
  "username": "abc",
  "rating": 5,
  "review": "Great stuff"
}
```

Backend:

* Adds review inside document
* Passes review through the Judgement Engine
* Updates `averageRating`

---

### Planned:

### `DELETE /items/:itemId/review/:reviewId`

Allow users to delete their own reviews (uses `auth` middleware).

---

# 🟦 **6. Middleware**

### **auth.js**

Reads `Authorization: Bearer <token>` header.

Decoded into:

```
req.user = { username: ... }
```

Used for authenticated routes.

---

# 🟩 **7. Frontend Overview**

## **7.1 AuthContext**

Holds:

```js
user          // username
login()       // save token + user
logout()      // remove token + user
```

Tokens stored in `localStorage.token`.

---

## **7.2 Axios Interceptor**

(`axiosClient.js`)

Automatically attaches the token:

```js
Authorization: Bearer <token>
```

Used by all API functions.

---

## **7.3 Login + Register pages**

* Register → POST `/auth/register`
* Login → POST `/auth/login`
* On login, save `{token, username}` via context

---

## **7.4 Protected Routes**

`PrivateRoute.jsx`:

* Redirects to `/login` if no user is logged in
* Wraps Home, AddItem, ItemDetails

Example from `App.jsx`:

```jsx
<Route
  path="/item/:id"
  element={
    <PrivateRoute>
      <ItemDetails />
    </PrivateRoute>
  }
/>
```

---

## **7.5 Navbar**

* Shows Add Item
* Shows “Logged in as X”
* Logout button clears token + user

---


# 🟦 **9. Environment Variables (`.env.example`)**

```
MONGO_URI=mongodb://127.0.0.1:27017/
PORT=5000
JWT_SECRET=your_secret_here
```

No dev-specific instructions — teammate sets these independently.

---

# 🟪 **10. Development Notes**

* **Reviews are embedded inside items**, not in a separate collection
* **Auth does NOT yet enforce ownership on reviews** (but backend ready for upgrade)
* **Judgement Engine is synchronous** and lightweight
* No external API dependencies
* No build/bundle configuration needed for teammates


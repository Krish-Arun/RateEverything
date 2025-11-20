# 🚀 **RateEverything – Project README & Developer Handoff**

### *A MERN-based full-stack rating system with interactive UI, animated backgrounds, user authentication, and review analytics.*

---

# 📌 **1. Project Overview**

**RateEverything** is a full-stack MERN application where users can:

* Create items (movies, books, games, food, anything)
* Add an image URL for each item
* Leave a star-rating (1–5)
* Leave a written review
* See AI-inspired “judgement” tags on each review
  *(Generated via a controlled utility function)*
* See reviews from all users
* Delete their own reviews
* Browse items using live search
* Authenticate using secure JWT-based login/register
* Enjoy a modern UI featuring:

  * **Tilted 3D Cards (react-bits)**
  * **Animated Particles Background (WebGL/OGL)**
  * **Waves Background (Perlin noise)**
  * **shadcn/ui components**
  * Tailwind CSS theme system

---

# ⚙️ **2. Tech Stack**

## **Frontend**

* React (Vite)
* React Router DOM
* Tailwind CSS
* shadcn/ui components
* react-bits TiltedCard
* Custom Particles background (WebGL via OGL)
* Custom Waves background
* Context API for authentication
* Axios for API requests

## **Backend**

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* bcrypt password hashing
* dotenv for config

---

# 🗂️ **3. Project Structure**

```
RateEverything/
│
├── client/
│   ├── src/
│   │   ├── api/            → axios API wrappers
│   │   ├── components/     → Navbar, TiltedCard, Particles, Waves, RatingStars
│   │   ├── context/        → AuthContext (login/logout)
│   │   ├── pages/          → Home, AddItem, ItemDetails, Login, Register, NotFound
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/    → itemController, authController
│   │   ├── routes/         → itemRoutes, authRoutes
│   │   ├── models/         → Item, User
│   │   ├── utils/          → analyzeReview
│   │   ├── config/         → db.js (Mongo connection)
│   │   ├── app.js
│   │   └── index.js
│   └── package.json
│
└── README.md (this file)
```

---

# ⭐ **4. Core Features (Implemented)**

## **(1) Item Management**

* Add a new item with:

  * name
  * category
  * optional imageUrl
* Images render in **16:9 aspect ratio**
* Each item page shows:

  * Title
  * Category
  * Average rating
  * Image banner
  * User reviews

## **(2) Reviews System**

Each review includes:

* username
* rating (1–5 stars)
* written review
* auto-generated judgement tags via `analyzeReview()`
* timestamp
* delete button (only if review owner)

### Delete Review

Users can delete *only their own* review:

* Backend verifies JWT → checks username match → deletes review
* Frontend updates instantly

## **(3) AI-Style Judgement System**

Each review is processed through:

`server/src/utils/analyzeReview.js`

It generates:

* `judgementText`
* `judgementTags`
  (based on sentiment, keywords, and rating score)

This appears visually in ItemDetails in a shaded block.

---

# 🔐 **5. Authentication System**

Fully implemented login + register pages using stylish Wave backgrounds.

### Backend:

* `auth/register` stores hashed passwords
* `auth/login` verifies credentials + returns JWT
* JWT secret in `.env`
* Protected routes check bearer token

### Frontend:

* AuthContext stores token + username
* Axios interceptor attaches token to all protected requests
* Navbar shows username + logout
* Add/delete review requires logged-in user

---

# 🔎 **6. Search System**

In the **Home** page:

* Live search (real-time filtering)
* Searches across:

  * item names
  * review texts
  * item categories
* Category filter field is separate
* Search button triggers **scroll down animation** to item grid

Search is 100% front-end (no backend load).

---

# 🖼️ **7. UI/UX Enhancements**

## 1. **Tilted 3D Cards**

Used in Home page for each item:

* 3D tilt based on mouse
* Hover scaling
* Overlay fade
* Displays:

  * image
  * item name
  * category (badge)
  * rating

## 2. **Particles Background (OGL)**

Used on:

* Home page
* ItemDetails page

Particles respond to:

* mouse movement
* smooth rotation
* randomized sizes

Background is blurred behind content.

## 3. **Waves Background**

Used on:

* Login
* Register pages

Built using:

* Perlin-like noise
* organic wave lines
* responds to mouse movement

## 4. **shadcn/ui**

Used for:

* Inputs
* Buttons
* Cards
* Badges

## 5. ***Complete dark theme***

Tailwind is configured with:

* background
* border
* card
* foreground
  etc.

---

# 🧠 **8. ItemDetails Layout (Final)**

### Left side:

* Full-width item image
* Item name overlay
* Review form

  * RatingStars
  * Input field
  * Submit review

### Right side:

* All reviews
* Shows:

  * username
  * rating
  * review
  * judgement tags
  * delete button (if owner)

Layout:

```
|---------------------------|------------------------|
|         Left              |         Right          |
|---------------------------|------------------------|
|  Image Banner             |  User Reviews          |
|  Leave Review Form        |                        |
|---------------------------|------------------------|
```

---

# 🧰 **9. Dependencies List**

### Server

```
express
mongoose
bcrypt
jsonwebtoken
dotenv
cors
```

### Client

```
react
react-router-dom
axios
tailwindcss
shadcn/ui
motion/react
react-bits TiltedCard
OGL (renderer for Particles)
```

---

# 🧪 **10. How to Run the Project**

### 1. Clone the repo

```
git clone <repo-url>
cd RateEverything
```

---

### 2. Install dependencies

#### Server:

```
cd server
npm install
```

#### Client:

```
cd client
npm install
```

---

### 3. Start both

#### Server:

```
npm run dev
```

#### Client:

```
npm run dev
```

---

### 4. Environment Variables (server/.env)

```
MONGO_URI=mongodb://localhost:27017/RateEverything
JWT_SECRET=yourSecretKey123
PORT=5000
```

# 🎁 **11. Summary for PPT Slides**

Here’s a slide-ready summary you can use:

### *Slide 1 — Title*

RateEverything
A MERN-based intelligent rating platform

### *Slide 2 — Technologies*

React, Tailwind, shadcn, express, MongoDB, JWT auth, custom WebGL animations

### *Slide 3 — Key Features*

Add items, rate items, leave reviews, see judgement tags, delete reviews, search, auth

### *Slide 4 — UI/UX*

Particles background
Waves background
Tilted 3D card animations
Dark theme

### *Slide 5 — Architecture*

MERN split with clean controllers/routes
AuthContext
Axios interceptor

### *Slide 6 — Demo Flow*

Login → Home → Search → Item -> Leave review → Delete review

### *Slide 7 — Future Work*

Profiles, analytics, mobile support, edit reviews

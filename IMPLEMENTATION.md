# IMPLEMENTATION.md

This is a fullstack todo management system built as part of the fullstack intern assignment. It covers all core features, with clean UX, RESTful API design, and a responsive frontend using React + Tailwind.

## Tech Stack

### Backend:

- **Node.js + Express**
- **PostgreSQL** (hosted on Neon)
- **pg** for raw SQL queries
- **dotenv**, **cors**, **nodemon**

### Frontend:

- **React (Vite)**
- **Tailwind CSS v3**
- **Zustand** for global state
- **Axios** for API calls

## Features Implemented

### 1. **User Management**

- Seeded 5 users (john_wick, jon_snow, walter_white, tony_stark, harry_potter)
- User switcher dropdown on UI (`/api/users`)

---

### 2. **Todo Management**

- **Create**, **Read**, **Update**, and **Delete** todos
- Add `tags`, `priority`, and assign other users (`@mention`)
- Mark todos as **completed**
- Completed todos show with low opacity and strikethrough
- Backend routes: `/api/todos`, `/api/todos/:id`

---

### 3. **Notes**

- Add notes to todos (`POST /api/todos/:id/notes`)
- Displayed in the modal with timestamp
- Input to add note below existing notes

---

### 4. **Todo Details Modal**

- Opens on clicking a todo
- Displays: description, priority, tags, assigned users, notes
- Includes delete button, completion toggle, and add-note input

---

### 5. **List View + UI**

- Shows all todos for selected user
- Filter todos by **priority**
- Buttons to:
  - Add new todo (modal)
  - Export all todos (JSON download)

### 6. **Export Functionality**

- `GET /api/todos/export?user=username`
- Downloads all todos for that user as JSON

## Not Implemented (Optional/Stretch)

- Filtering by tag or assigned user
- Sorting todos (e.g., by date, priority)
- Pagination / infinite scroll
- Notes via separate icon (opens on full todo click instead)

## Setup Instructions

### Backend

1. Go to root directory `/`
2. Run:
   ```bash
   npm install
   ```
3. Create a Neon PostgreSQL project
4. Run the below schema in neon sql editor

   ```sql
   -- Users table
   CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   username VARCHAR(50) UNIQUE NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Todos table
   CREATE TABLE todos (
   id SERIAL PRIMARY KEY,
   title VARCHAR(255) NOT NULL,
   description TEXT,
   priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
   completed BOOLEAN DEFAULT FALSE,
   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Tags table
   CREATE TABLE tags (
   id SERIAL PRIMARY KEY,
   name VARCHAR(50) UNIQUE NOT NULL
   );

   -- Todo-Tags junction table
   CREATE TABLE todo_tags (
   todo_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
   tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
   PRIMARY KEY (todo_id, tag_id)
   );

   -- Todo-Users (assignments) junction table
   CREATE TABLE todo_users (
   todo_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
   PRIMARY KEY (todo_id, user_id)
   );

   -- Notes table
   CREATE TABLE notes (
   id SERIAL PRIMARY KEY,
   content TEXT NOT NULL,
   todo_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. Add .env file:
   ```
   DATABASE_URL=your_neon_connection_url
   PORT=3000
   ```
6. Run the backend on `http://localhost:3000`
   ```bash
    npm run dev
   ```

### Frontend

1. Go to `/frontend`
2. Run:
   ```bash
   npm install
   npm run dev
   ```
3. Run the frontend on `http://localhost:5173`
4. The frontend will connect to the local backend at `http://localhost:3000`

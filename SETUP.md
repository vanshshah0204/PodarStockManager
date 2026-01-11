# Podar Stock Manager - MongoDB Setup Guide

## Prerequisites

1. **MongoDB Database**: You need a MongoDB database. You have two options:

   **Option A: MongoDB Atlas (Cloud - Recommended)**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free account
   - Create a free cluster
   - Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/podarstock`)

   **Option B: Local MongoDB**
   - Install MongoDB on your computer
   - Make sure MongoDB is running
   - Default connection: `mongodb://localhost:27017/podarstock`

## Setup Steps

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Create .env file** in the root directory:
   ```
   MONGODB_URI=your_mongodb_connection_string_here
   PORT=5000
   ```

   **Example for MongoDB Atlas:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/podarstock
   PORT=5000
   ```

   **Example for Local MongoDB:**
   ```
   MONGODB_URI=mongodb://localhost:27017/podarstock
   PORT=5000
   ```

3. **Start the Backend Server**:
   ```bash
   npm run server
   ```
   The server will run on http://localhost:5000

4. **In a new terminal, start the Frontend**:
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:5173 (or similar)

## Running the Application

1. Make sure MongoDB is accessible (cloud or local)
2. Start the backend server: `npm run server`
3. Start the frontend: `npm run dev` (in a new terminal)
4. Open your browser to the frontend URL (usually http://localhost:5173)

## Database Initialization

The database will automatically initialize with default products when you first load the app if the database is empty.

## Notes

- The data is now stored in MongoDB and can be accessed from any device
- Make sure the backend server is running before using the frontend
- The `.env` file is already in `.gitignore` to keep your MongoDB credentials safe

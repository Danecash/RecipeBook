# 🍽️ **Recipe Book**

## 📌 Project Description

The Recipe Book is a web-based application that allows users to store, manage, and share their favorite recipes. It provides a structured way to organize recipes with ingredients, instructions, and categories. This project is built using Node.js with Express.js for the backend and integrates a database to store recipes.

## 🥞 Pancakes Recipe Metadata

| Key          | Description |
|-------------|------------------------------------------------------------|
| `_id`       | Unique identifier for the recipe in the database. |
| `name`      | The name of the recipe. |
| `category`  | The category of the dish (e.g., Breakfast, Lunch, Dinner). |
| `ingredients` | A list of ingredients required for the recipe. |
| `instructions` | Step-by-step cooking instructions for preparing the dish. |

- Backend: Node.js, Express.js
- Database: MongoDB Atlas (CLOUD)
- Frontend: to be implement

## 📂 Project Structure
```
/project-root
│── /config            # Database and app configuration
│── /node_modules      # Dependencies
│── /src               # Main application logic
│   ├── /controllers   # Handles business logic
│   ├── /models        # Database schemas
│   ├── /routes        # API routes
│   ├── /views         # Frontend templates (if using EJS)
│── /public            # Static assets (CSS, images, etc.)
│── package.json       # Project metadata
│── server.js          # Main entry point
│── README.md          # Project documentation
```
## TO GET STARTED
### Start the Server
```
node server.js
```
- The server will run at http://localhost:3000

## 📌 API Endpoints

| Method  | Endpoint      | Description          |
|---------|-------------|----------------------|
| **GET**    | `/recipes`     | Get all recipes |
| **POST**   | `/recipes`     | Add a new recipe |
| **GET**    | `/recipes/:id` | Get a recipe by ID |
| **PUT**    | `/recipes/:id` | Update a recipe |
| **DELETE** | `/recipes/:id` | Delete a recipe |


📜 License. 
This project is licensed under the MIT License.

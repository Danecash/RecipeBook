# 🍳 **Recipe Book | Elective 3 - Web Development | DS3A**

## 📌 Project Description

The Recipe Book is a web-based application that allows users to view, favorite and add recipe to share their favorite recipes. It provides a structured way to organize recipes with ingredients, instructions, and categories. This project is built using Node.js with Express.js for the backend and integrates a database to store recipes.

- Backend: Node.js, Express.js
- Database: MongoDB Atlas (CLOUD)
- Frontend: react, css

## 📂 Project Structure
```
/RECIPEBOOK
├── /backend                    # Backend logic
│   ├── /config                # Configuration files (e.g., DB setup)
│   ├── /middlewares           # Custom middleware functions
│   ├── /models                # Mongoose models / DB schemas
│   ├── /node_modules          # Backend dependencies
│   ├── /routes                # Express route definitions
│   ├── /uploads               # Uploaded files (e.g., images)
│   ├── /utils                 # Utility/helper functions
│   ├── .env                   # Environment variables
│   ├── main.js                # Backend entry point
│   ├── package.json           # Backend package metadata
│   └── package-lock.json      # Backend dependency lock file
│
├── /frontend                  # Frontend logic (React)
│   ├── /node_modules          # Frontend dependencies
│   ├── /public                # Static assets (public-facing)
│   ├── /src                   # React source code
│   │   ├── /assets            # Images, fonts, etc.
│   │   ├── /components        # Reusable React components
│   │   ├── /context           # React Context API providers
│   │   ├── /hooks             # Custom React hooks
│   │   ├── /pages             # Page components (e.g., AddRecipe, App)
│   │   ├── /services          # API service calls
│   │   ├── /styles            # CSS / SCSS styles
│   │   ├── /utils             # Frontend utility functions
│   │   ├── App.jsx            # Root App component
│   │   └── main.jsx           # React entry point
│   ├── .env                   # Frontend environment variables
│   ├── index.html             # HTML template
│   ├── package.json           # Frontend package metadata
│   ├── package-lock.json      # Frontend dependency lock file
│   ├── vite.config.js         # Vite configuration
│   ├── .gitignore             # Git ignored files
│   ├── .prettierrc            # Prettier configuration
│   ├── eslint.config.js       # ESLint configuration
│   └── README.md              # Frontend documentation
│
├── /node_modules              # Root-level dependencies
├── package-lock.json          # Root dependency lock file
└── README.md                  # Root documentation
```
## TO GET STARTED
### Start the Backend
```
cd backend
node server.js
```
- The server will run at http://localhost:3000

### Start the Frontend
```
cd frontend
npm run dev
```


### Developers: 
- Christine Joy Sorronda
- Dane Casey Casino
- Genheylou Felisilda
- Jezzel Faith Gier
- Usher Raymond Abainza

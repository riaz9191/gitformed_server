# GitFormed - GitHub-like Platform

## Description
GitFormed is a web application that mimics some features of GitHub. It allows users to create repositories, manage pull requests, and watch repositories for updates.

## Features
- **User Authentication:** Secure user authentication system to manage user accounts.
- **Repository Management:** Create, view, and delete repositories with details like creation time and owner's email.
- **Pull Requests:** Create and view pull requests associated with repositories, facilitating collaboration among developers.
- **Watched Repositories:** Users can watch repositories to receive updates about changes made to them.
- **Error Handling:** The application handles various error scenarios and provides appropriate responses.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript (React or Angular, for example)
- **Backend:** Node.js with Express
- **Database:** MongoDB
- **Authentication:** Session-based authentication
- **Deployment:** MongoDB Atlas for database hosting, and the application can be deployed on platforms like Heroku or AWS.

## Getting Started
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/riaz9191/gitformed_server

2. **Navigate to the project directory:**

   ```bash
   cd gitformed_server

3. **Install dependencies:**

   ```bash
   npm install

4. **Set Environment Variables:**
  - Create a .env file in the root directory and add the following variables:
    ```bash
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    PORT=5000

5. **Start the development server:**

    ```bash
    npm start

6. **Run the Application::**

    ```bash
    http://localhost:5000

**Usage**
1. **Create a Repository:**
- Go to the home page and click on the "Create Repository" button.
- Enter the repository name .
- Click "Create" to create the repository.
2. **Manage Repositories:**
- View all repositories by going to the "Repositories" section.
3. **Create Pull Requests:**
- Navigate to the "Pull Requests" section.
- Click on "Create Pull Request" and fill in the details.
- Click "Create" to submit the pull request.
4. **Execute Code:**
- Click "Execute Code" to run your code.
5. **Watch Repositories:**
- Visit the "Watched Repositories" section.
- Watch a repository by clicking on "Watch Repository" and providing the required information.

**Contributions Welcome**
We welcome contributions! Feel free to fork the repository and submit pull requests.

**License**
This project is licensed under the MIT License.

<p align="center">
  <a href="https://github.com/riaz9191/gitformed_server" target="_blank">
    <img src="https://img.shields.io/badge/View%20on%20GitHub-%23000000.svg?style=for-the-badge&logo=github" alt="View on GitHub">
  </a>
</p>

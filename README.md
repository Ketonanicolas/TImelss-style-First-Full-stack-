# Timeless Style - Product Management System

**Timeless Style** is a full-stack web application designed to manage products efficiently. Built with Node.js and Express.js, it offers a robust backend for handling product data.

## Features

- **Product Management**: Add, update, and delete products seamlessly.
- **User Authentication**: Secure user login and session management.
- **File Uploads**: Handle product images using Multer middleware.
- **Templating**: Dynamic views rendered with EJS templates.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Templating Engine**: EJS
- **Database**: MySQL
- **Authentication**: Express-session
- **File Uploads**: Multer
- **Styling**: (Specify if any CSS framework or preprocessor is used)

## Installation & Setup

### Prerequisites

- Node.js
- MySQL

### Steps

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/Ketonanicolas/TImelss-style-First-Full-stack-.git
   cd TImelss-style-First-Full-stack-
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

3. **Configure Environment Variables**:
4. DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   SESSION_SECRET=your_session_secret
   ```

4. **Initialize the Database**:
   - Ensure your MySQL server is running.
   - Create a database matching `DB_NAME`.
   - Run any migration scripts or use an ORM to set up the necessary tables.

5. **Start the Application**:
   ```sh
   npm start
   ```
   The server will run on the port specified in your environment variables or default to port 3000.

## Usage

- Access the application at `http://localhost:3000`.
- Use the navigation to manage products and view other features.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please reach out to [nainujiharsh@gmail.com](mailto:nainujiharsh@gmail.com).

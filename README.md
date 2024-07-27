# Project Description
This project aims to provide a comprehensive API endpoints for interacting with the website through API requests. The API offers endpoints for managing tasks and user profiles, including functionalities such as task retrieval, creation, updating, and deletion, as well as user authentication, registration, and avatar management.
# Website API Documentation
## Base url : https://task-manager-api-musa.onrender.com
## User API

### Register User
POST /users
- Description: Register a new user
- Request Body:
  - `username`: User's username
  - `email`: User's email
  - `password`: User's password
- Response: New user object and authentication token

### User Login
POST /users/login
- Description: User login
- Request Body:
  - `email`: User's email
  - `password`: User's password
- Response: User object and authentication token

### User Logout
POST /users/logout
- Description: Log out the current user
- Authentication: Required
- Response: Success message

### User Logout All Devices
POST /users/logout/all
- Description: Log out the current user from all devices
- Authentication: Required
- Response: Success message
### Get Current User
GET /users/me
- Description: Retrieve current user profile
- Authentication: Required
- Response: Current user object

### Update User
PATCH /users/me
- Description: Update current user profile
- Authentication: Required
- Request Body: Updated user fields
- Response: Updated user object

### Delete User
DELETE /users/me
- Description: Delete current user profile
- Authentication: Required
- Response: Deleted user object

### Upload User Avatar
POST /users/upload
- Description: Upload user avatar
- Authentication: Required
- Form Data: Avatar file
- Response: Base64 encoded avatar

### Get User Avatar
GET /users/:id/avatar
- Description: Get user avatar by user ID
- Response: User avatar image

### Delete User Avatar
DELETE /users/avatar
- Description: Delete user's avatar
- Authentication: Required
- Response: Success message

## Task API

### Get All Tasks
GET /tasks
- Description: Retrieve all tasks
- Authentication: Required
- Query Parameters:
  - Available query parameters for filtering, pagination, and sorting
- Response:
  - `totalTasks`: Total number of tasks
  - `page`: Current page number
  - `limit`: Number of tasks per page
  - `tasks`: Array of tasks

### Get Task by ID
GET /tasks/:id
- Description: Retrieve a task by ID
- Authentication: Required
- Response: Task object

### Create Task
POST /tasks
- Description: Create a new task
- Authentication: Required
- Request Body:
  - `description`: Task description
  - `completed`: Task completion status
- Response: Created task object

### Update Task
PATCH /tasks/:id
- Description: Update a task by ID
- Authentication: Required
- Request Body: Updated task fields
- Response: Updated task object

### Delete Task
DELETE /tasks/:id
- Description: Delete a task by ID
- Authentication: Required
- Response: Deleted task object



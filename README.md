# Task 1: Backend Login System with Auto-Restriction

This project implements a secure backend login system with auto-restriction logic, keeping track of failed attempts and locking accounts when necessary. It includes a React frontend and a Node.js/Express backend.

## ✅ Features

*   **Secure Authentication**: Validates email and password on the backend.
*   **Auto-Restriction**: Automatically locks the account after **4 consecutive failed login attempts**.
*   **Attempt Tracking**: Logs every login attempt with IP address and device information.
*   **User Image Upload**: Allows users to upload a profile photo during login.
*   **Automatic Unlocking**: Successful login resets the failed attempt counter and unlocks the account.
*   **Full Backend Logic**: All validation, counting, and locking mechanisms are securely handled on the server side.

## 🛠️ Tech Stack

*   **Frontend**: React (Create React App)
*   **Backend**: Node.js, Express
*   **Database**: (Assumed to be SQL/NoSQL based on description - adjust as needed)

## ⚙️ Backend Auto-Restriction Logic

1.  **Login Attempt**:
    *   User submits email and password.
    *   Backend validates credentials.

2.  **Incorrect Password**:
    *   `failed_attempts` count is incremented by 1.
    *   A **FAILED** record is inserted into `login_attempts` table.
    *   **Locking Condition**: If `failed_attempts > 4`:
        *   `is_locked` is set to `TRUE`.
        *   All further login attempts are blocked.
        *   A **LOCKED** record is inserted into `login_attempts`.

3.  **Successful Login**:
    *   **Reset**: `failed_attempts` is reset to 0.
    *   **Unlock**: `is_locked` is set to `FALSE`.
    *   **Record**: A **SUCCESS** record is inserted into `login_attempts`.
    *   **Photo**: specifically uploaded user photo is saved.

## 📝 Form Validation

### Login Form (Frontend)

*   **Email**:
    *   Required.
    *   Must be a valid email format.
*   **Password**:
    *   Required.
    *   Minimum 6 characters.
*   **User Image**:
    *   Optional.
    *   Must be a valid image format (`jpg`, `png`, `jpeg`).

## 🚀 Getting Started

### Prerequisites

*   Node.js installed
*   npm installed

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/anshxpress/task_1.git
    cd task_1
    ```

2.  **Frontend Setup**:
    ```bash
    cd login-frontend
    npm install
    npm start
    ```

3.  **Backend Setup**:
    ```bash
    cd login-backend
    npm install
    npm start
    ```

---
**All functions mentioned above are implemented and working as expected.**

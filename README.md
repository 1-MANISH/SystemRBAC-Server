# **Role-Based Access Control (RBAC) System**

## **Overview**
This project implements a secure **Authentication**, **Authorization**, and **Role-Based Access Control (RBAC)** system. It demonstrates the fundamental concepts of securing systems by allowing users to authenticate themselves, be assigned specific roles, and access resources based on their permissions.

The goal of this project is to showcase my understanding of RBAC principles and provide a practical solution for managing user roles and access levels effectively.

---

## **Features**

### **Authentication**
- User registration with secure password hashing.
- User login with token-based authentication (e.g., JWT).
- Secure logout functionality to terminate sessions.

### **Authorization**
- Role-based authorization with predefined roles (e.g., Admin, User, Moderator).
- Access control to endpoints and resources based on user roles.

### **Role-Based Access Control (RBAC)**
- Flexibility to define and manage user roles.
- Enforced permissions for specific actions and resources.
- Middleware to validate user roles and permissions before granting access.

---

## **Technologies Used**
- **Backend Framework**: [Node.js/Express.js ]  
- **Database**: [MongoDB]  
- **Authentication**: JSON Web Tokens (JWT) 
- **Password Security**: bcrypt  
- **API Testing**: Postman / Insomnia  
- **Send Email**: Nodemailer
- **Frontend** : React (Redux - @reduxjs/toolkit)
- **Stylying** : Mui components

---

## **Installation Instructions**

1. Clone the repository or dounload as zip:
   ```bash
   git clone "url"
   cd SystemRBAC

2. Go to server and client folder and add .env file and add given below Environment Varibles

3. Environment Varibles:

    **backend**
    ```
    
    PORT:5000
    MONGODB_URL:your local daatabse or mongodb online
    JWT_SECRET:any random key

    SMTP_SERVICE="gmail"
    SMTP_MAIL="youremail@gmail.com"
    SMTP_PASSWORD="yourKey"
    SMTP_HOST="smtp.gmail.com"
    SMTP_PORT=587
    ```

    **frontend**
    ```
    VITE_SERVER="http://localhost:5000"

4. ```bash
    cd server
    npm install

    cd client
    npm install

**To run**

    npm run dev
    
**Note : Intitially make one of the user as admin to access admin dashboard

### **Core Concepts Demonstrated**
    Authentication
    Secure login and logout mechanisms.
    Authorization
    Prevention of unauthorized access to critical endpoints.
    RBAC Integration
    Role-based permission handling for APIs.
    Dynamic role and permission management.



### Link for Initial Ui Design

Link : https://whimsical.com/rbac-9MpXPx4myZZEsv9QbtVFZ

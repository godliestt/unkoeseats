# Unko E's Eats - Dynamic Web Application

**Author:** Charles Naone  
**Live Deployment:** [https://unkoeseats.onrender.com/](https://unkoeseats.onrender.com/)  

## Project Overview
Unko E's Eats is a full-stack web application that transitions a static digital storefront into a functional, database-driven service tool. Built as a software engineering project, this application demonstrates backend architecture, RESTful API routing, centralized data management, and secure server-side validation.

## Technical Stack
* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Backend:** Node.js, Express.js
* **Database:** SQLite3 (Relational Database)
* **Version Control:** GitHub
* **Hosting/Deployment:** Render

## Key Features
* **Dynamic Menu Generation:** Menu items are retrieved from a centralized SQLite database via a Web API, replacing static, hardcoded HTML.
* **Persistent Data Storage:** Customer feedback and catering inquiries are transmitted to the backend, validated, and stored permanently in relational tables.
* **Server-Side Validation:** Backend routes include strict validation to prevent empty or malicious data from corrupting the database.
* **Secure Admin Dashboard:** A hidden, protected interface utilizing HTTP Basic Authentication allows authorized users to view raw database entries formatted into a clean user interface.

## Admin Dashboard Access (For Evaluation)
To evaluate the backend database functionality, visit the protected admin route:
* **URL:** [https://unkoeseats.onrender.com/admin](https://unkoeseats.onrender.com/admin)
* **Username:** `admin`
* **Password:** `kapolei123`

## Important Note on Deployment (Render Ephemeral Storage)
This application utilizes Render's free tier web service hosting. Render relies on an "ephemeral disk" for free instances. This means that after a period of inactivity, the server spins down and the local SQLite `unko_e_eats.db` file is wiped. 

When the server restarts, the database automatically re-initializes and populates the default menu items. To view customer inquiries or feedback in the Admin Dashboard during an evaluation, **new test data must be submitted** via the front-end forms during the active session. This architecture successfully represents and simulates a real relational database environment for academic demonstration purposes.

## Local Installation & Setup
To run this project locally without relying on cloud deployment:
1. Clone this repository via GitHub.
2. Ensure Node.js is installed on your machine.
3. Run `npm install` in the project root to install Express and SQLite3 dependencies.
4. Run `npm start` to initialize the database and start the server.
5. Open a web browser and navigate to `http://localhost:3000`.

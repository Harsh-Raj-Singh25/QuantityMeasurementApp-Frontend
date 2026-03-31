# Quantity Measurement App - Frontend (Vanilla JS)

This is the Vanilla HTML/CSS/JavaScript frontend for the Quantity Measurement API. It provides a clean, responsive, and interactive dashboard for users to perform conversions, comparisons, and arithmetic operations across various measurement units (Length, Weight, Temperature, Volume).

This branch represents **Version 1.0 (Vanilla UI)**, built with zero external frontend frameworks, demonstrating a strong foundational understanding of DOM manipulation, asynchronous JavaScript (`fetch`), and CSS layout design.

## 🚀 Features

* **User Authentication:** Complete Login and Signup flow.
* **Dynamic Dashboard:** Dropdowns and input fields intelligently update based on the selected measurement category.
* **REST API Integration:** Seamlessly communicates with a backend server using asynchronous `fetch()` requests.
* **Error Handling:** Gracefully catches and displays API and validation errors to the user.
* **Responsive Design:** Clean, modern CSS architecture.

## 🛠️ Tech Stack

* **Structure:** HTML5
* **Styling:** Custom CSS3 (Flexbox, CSS Variables)
* **Logic:** Vanilla JavaScript (ES6+)
* **Local Hosting:** `npx serve` / VS Code Live Server
* **Mock Backend (Optional):** `json-server`

## 📂 Folder Structure

```text
QuantityMeasurementApp-Frontend/
├── css/
│   ├── LoginSignUp.css      # Styles for the Auth page
│   └── DashBoard.css        # Styles for the main dashboard
├── js/
│   ├── auth.js              # Handles Login/Signup API requests
│   └── dashboard.js         # Handles UI state and Measurement API requests
├── assets/
│   └── triple-beam-balance.png
├── index.html               # Entry point (Auth)
├── DashBoard.html           # Main application interface
└── README.md
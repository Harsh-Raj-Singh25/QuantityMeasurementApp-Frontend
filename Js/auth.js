// Tab switching
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

// Check if elements exist before attaching events (This prevents silent failures)
if (loginTab && signupTab && loginForm && signupForm) {
    
    loginTab.onclick = () => {
        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");
        loginTab.classList.add("active");
        signupTab.classList.remove("active");
    };

    signupTab.onclick = () => {
        signupForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
        signupTab.classList.add("active");
        loginTab.classList.remove("active");
    };

} else {
    console.error("One or more tab elements were not found in the DOM!");
} 

// Login logic
// Login logic with JSON Server
loginForm.onsubmit = async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    // 1. Ask the database if a user matches this email AND password
    const response = await fetch(`http://localhost:3000/users?email=${email}&password=${password}`);
    const matchedUsers = await response.json();

    // 2. Check the results
    if (matchedUsers.length > 0) {
      alert("Login successful!");
      
      // Save minimal session data so the Dashboard knows who is logged in
      localStorage.setItem("loggedInUser", JSON.stringify(matchedUsers[0].name));
      
      // Redirect to your Dashboard page (Ensure capitalization matches your file!)
      window.location.href = 'DashBoard.html'; 
    } else {
      alert("Invalid email or password!");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    alert("Server error! Make sure json-server is running.");
  }
};
// Signup logic with JSON Server
signupForm.onsubmit = async (e) => {
  e.preventDefault();

  const user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    mobile: document.getElementById("mobile").value
  };

  try {
    // 1. Check if the email is already registered
    const checkResponse = await fetch(`http://localhost:3000/users?email=${user.email}`);
    const existingUsers = await checkResponse.json();

    if (existingUsers.length > 0) {
      alert("This email is already registered! Please login.");
      return; // Stop the function here
    }

    // 2. If email is new, POST the new user to the database
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    if (response.ok) {
      alert("Signup successful! Please login.");
      signupForm.reset(); // Clear the input fields
      loginTab.click();   // Automatically switch to the Login tab
    }
  } catch (error) {
    console.error("Error signing up:", error);
    alert("Server error! Make sure json-server is running.");
  }
};
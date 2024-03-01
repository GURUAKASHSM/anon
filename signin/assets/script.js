function checkforLocal() {
  const storedData = localStorage.getItem("userdata");

  if (storedData !== null) {

    const retrievedUserData = JSON.parse(storedData);
    fetch("http://localhost:8080/validatetoken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(retrievedUserData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          document.querySelector('.allready-signin').style.display = "block";
          document.querySelector('.message').innerHTML = `Did you want to continue with ${retrievedUserData.username}`;
        } else {
          localStorage.removeItem("userdata");
        }
      })
  }
}
checkforLocal()

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

document.getElementById("signin-button").addEventListener("click", function (event) {

  event.preventDefault();

  // Create a JSON object from the form data
  const formData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
  if (formData.email.trim() == "") {
    showToast("Please Enter your Email", "Info", 1);
    return
  }
  if (formData.password.trim() == "") {
    showToast("Please Enter your Password", "Info", 1);
    return
  }
  if (formData.password.trim().length < 6) {
    showToast("Password must be atleast 6 Characters", "Info", 1);
    return
  }
  if (!validateEmail(formData.email)) {
    showToast("Please Enter a Valid Email", "Info", 1);
    return
  }
  // Send a POST request to your Go backend
  fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        SigninUser(data.token)
      } else {
        document.querySelector('.js-image').src = './images/wrongpassword.avif'
        event.preventDefault();
        showToast("Login failed. Please check your credentials.", "Danger", 0);
      }
    })
    .catch(error => {
      showToast(error.message, "Danger", 0);
    });
});




function showToast(str, war, no) {
  const toastContainer = document.querySelector('.toast-container');
  const title = document.querySelector('.js-toast-title');
  const content = document.querySelector('.js-toast-content');
  const image = document.querySelector('.js-toast-img');

  // Reset classes, width, and height
  toastContainer.className = 'toast-container';
  toastContainer.style.width = 'auto';
  toastContainer.style.height = 'auto';

  if (no == 0) {
    image.src = './images/danger.webp';
    toastContainer.classList.add('danger-color');
  } else if (no == 1) {
    image.src = './images/info.svg';
    toastContainer.classList.add('info-color');
  } else if (no == 2) {
    image.src = './images/warning.jpg';
    toastContainer.classList.add('warning-color');
  } else if (no == 3) {
    image.src = './images/success.png';
    toastContainer.classList.add('success-color');
  }
  title.innerHTML = `${war}`;
  content.innerHTML = `${str}`;

  // Calculate and set the container width and height

  const containerWidth = title.length + content.length + 500; // Add some padding

  toastContainer.style.width = `${containerWidth}px`;


  // Add transition effect
  toastContainer.style.transition = 'all 0.5s ease-in-out';

  toastContainer.style.display = 'block';
  setTimeout(() => {
    toastContainer.style.opacity = 1;
  }, 1);

  // Hide the toast container after 5 seconds
  setTimeout(() => {
    toastContainer.style.opacity = 0;
    setTimeout(() => {
      toastContainer.style.display = 'none';
    }, transitionDuration * 1000);
  }, 3000);
}


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getDatabase, ref, set, get, child, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Can Get from Firebase Settings ==> SDN
const firebaseConfig = {
  apiKey: "AIzaSyCBQSAtCbq6-QWo0UCU2R1G4t-f5OQKw1k",
  authDomain: "avian-pact-378003.firebaseapp.com",
  databaseURL: "https://avian-pact-378003-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "avian-pact-378003",
  storageBucket: "avian-pact-378003.appspot.com",
  messagingSenderId: "960981261075",
  appId: "1:960981261075:web:0eea8a286549efc5f058e6",
  measurementId: "G-LPBMBH2TFM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase()
const auth = getAuth(app)
const dbref = ref(db)

let SigninUser = (token) => {
  const rememberMeCheckbox = document.getElementById('remember-me');
  const formData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
  // evt.preventDefault();
  signInWithEmailAndPassword(auth, formData.email, formData.password)
    .then((credentials) => {
      showToast("Login Successfull", "Success", 3);

      setTimeout(() => {
        if (rememberMeCheckbox.checked) {
          const userData = {
            'token': token,
            'username': formData.email
          }
          const jsonString = JSON.stringify(userData);
          localStorage.setItem('userdata', `${jsonString}`);
          window.location.href = `/anon/home/`;
        } else {
          localStorage.setItem('token', `${data.token}`);
          window.location.href = `/anon/home/?token=${data.token}`;
        }
        document.getElementById("email").value = '';
        document.getElementById("password").value = "";
      }, 1000);
    })
    .catch((error) => {
      showToast(error.message, "Danger", 0);
    })
}







// let fullname = document.getElementById("fullname")
// let first = document.getElementById("first")
// let last = document.getElementById("last")
// let mail = document.getElementById("email")
// let photo = document.getElementById("photo")
// let id_num = document.getElementById("id_num")
// let sign = document.getElementById("sign")
// let out = document.getElementById("out")
// let info = document.getElementById("info")



// // Show All Data in Web from localStorage
// function show_L_data() {

//     if (localStorage.getItem("infos")) {
//         let infosLparse = JSON.parse(localStorage.getItem("infos"))
//         const formData = {
//         email: infosLparse.mailL,
//         password: "tamil",
//     };
//     fetch("http://localhost:8080/login", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.token) {
//                 // Redirect to the "/home" URL with the received token
//                 window.location.href = `/home?token=${data.token}`;
//             } else {
//                 // Handle the case where login was not successful
//                 alert("Login failed. Please check your credentials.");
//             }
//         })
//         .catch(error => {
//             // Handle errors, e.g., display an error message
//             alert("Error in: " + error.message);
//         });
//         info.classList.remove("d-none")
//         sign.classList.add("d-none")
//         out.classList.remove("d-none")

//         fullname.innerHTML = infosLparse.fullnameL
//         photo.src = infosLparse.photo_linkL
//         first.innerHTML = infosLparse.firstL
//         last.innerHTML = infosLparse.lastL
//         mail.innerHTML = infosLparse.mailL
//         id_num.innerHTML = infosLparse.id_numL

//     } else {
//         info.classList.add("d-none")
//         sign.classList.remove("d-none")
//         out.classList.add("d-none")
//     }

// }

// window.addEventListener("load", show_L_data())



// // Sign in // Sign in // Sign in // Sign in
// function handleCredentialResponse(response) {

//     // decodeJwtResponse() is a custom function defined by you
//     // to decode the credential response.
//     const responsePayload = decodeJwtResponse(response.credential);

//     let infos = {
//         fullnameL: responsePayload.name,
//         photo_linkL: responsePayload.picture,
//         firstL: responsePayload.given_name,
//         lastL: responsePayload.family_name,
//         mailL: responsePayload.email,
//         id_numL: responsePayload.sub
//     }

//     let infosL = JSON.stringify(infos)

//     localStorage.setItem("infos", infosL)

//     show_L_data()
// }


// // decodeJwtResponse()
// function decodeJwtResponse(data) {
//     let tokens = data.split(".");
//     return JSON.parse(atob(tokens[1]))
// }

// // Sign Out
// out.addEventListener("click", () => {
//     localStorage.clear()
//     info.classList.add("d-none")
//     sign.classList.remove("d-none")
//     out.classList.add("d-none")
// })
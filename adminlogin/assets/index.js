
document.querySelector('.login100-form-btn').addEventListener('click', () => {
    event.preventDefault();
    console.log("Clicked")

    // Create a JSON object from the form data
    const formData = {
        email: document.querySelector(".email").value,
        password: document.querySelector(".password").value,
        totp: document.querySelector(".totp").value,
        ip: document.querySelector(".ip").value,
    };
    if (formData.email.trim() == "" || formData.password.trim() == "" || formData.totp.trim() == "") {
        showToast("Please Enter all feilds before submit", "Info", 1);
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
    if (formData.totp.trim().length < 6) {
        showToast("TOTP must be atleast 6 Characters", "Info", 1);
        return
    }
    // Send a POST request to your Go backend
    fetch("http://localhost:8080/adminlogin", {
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
                console.log(data.token)
                return
            } else if (data.result == 0) {
                showToast("Email Not found", "Danger", 0)
            } else if (data.result == 1) {
                showToast("Maximum no of try reached", "Danger", 0)
            } else if (data.result == 2) {
                showToast("Wrong Password", "Danger", 0)
            } else if (data.result == 3) {
                showToast("Wrong IP address", "Danger", 0)
            } else if (data.result == 5) {
                showToast("Wrong TOPTP", "Danger", 0)
            }
            document.querySelector('.image-js').src = "./images/guru.png"
        })
        .catch(error => {
            showToast(error.message, "Danger", 0);
        });
})
function GetIP() {
    fetch('https://ipinfo.io/json')
        .then(response => response.json())
        .then(data => {
            var IP = data.ip;
            document.querySelector('.ip').innerHTML = `Your IP : ${IP}`
        })
        .catch(error => showToast(error, 'Error', 0));
}
GetIP()


export function showToast(str, war, no) {
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


function displayToast() {
    showToast("Please contact your service provider for deatils", "Info", 1)
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

    const formData = {
        email: document.querySelector(".email").value,
        password: document.querySelector(".password").value,
    };
    // evt.preventDefault();
    signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((credentials) => {
            showToast("Login Successfull", "Success", 3);

            setTimeout(() => {
                const userData = {
                    'token': token,
                    'username': formData.email
                };
                const jsonString = JSON.stringify(userData);
                localStorage.setItem('admindata', jsonString);

                window.location.href = `/anon/admin/`;
            }, 1000);

            document.querySelector(".email").value = '';
            document.querySelector(".password").value = "";
            document.querySelector(".totp").value="";
            localStorage.removeItem('adminsignindata');
        })
        .catch((error) => {
            showToast(error.message, "Danger", 0);
        })
}
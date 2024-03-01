document.getElementById("customerForm").addEventListener("click", function (event) {
    event.preventDefault();
    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phonenumber: parseInt(document.getElementById("phone").value),
        password: document.getElementById("password").value,
        confirmpassword: document.getElementById("re_pass").value,
        address: document.getElementById("address").value,
    };
    // Create a JSON object from the form data



    if (formData.name.trim() === "" || formData.email.trim() === "" || formData.password.trim() === "" || formData.confirmpassword.trim() === "" || formData.address.trim() === "") {
        showToast("Please fill all feilds before submit", "Info", 1)
        return
    }
    if (formData.password.trim().length <= 6 && formData.confirmpassword.trim().length <=6) {
        showToast("Password must be greater than 6 chracters", "Danger", 0)
        return
    }
    if (formData.password != formData.confirmpassword && formData.password.trim() !== "" && formData.confirmpassword.trim() !== "") {
        showToast("Password & Confirm Password Mismatch", "Danger", 0)
        return
    }
    if (!validateEmail(formData.email)) {
        showToast("Please Provide Valid Email", "Info", 1)
        return
    }
    if (findNumberLength(formData.phonenumber) != 10) {
        showToast("Please Provide Valid Phone Number", "Info", 1)
        return
    }
    if (!isUsernameValid(formData.name)) {
        showToast("Please Provide Valid Username", "Info", 1)
        return
    }
    // Send a POST request to your Go backend
    fetch("http://localhost:8080/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())

        .then(data => {
            if (data === 1) {
                RegisterUser();
                // Redirect to /signin if the response is true
            }
            else if (data === 0) {
                // Handle other responses here, e.g. show an error message
                showToast("Error creating customer profile.", "Danger", 0);
            }
            else if (data === 2) {
                showToast("Email already exists", "Danger", 0)
            }
            else if (data === 3) {
                showToast("Password and Confirm Password defer", "Danger", 0)
            }
            else if (data === 4) {
                showToast("User name should only contain letters", "Danger", 0)
            }
            else if (data === 5) {
                showToast("Invalid Phonenumber", "Danger", 0)
            }

        })
        .catch(error => {
            // Handle errors, e.g., display an error message
            showToast(`Error : ${error.message}`, "Danger", 0);
        });
});


var togleEyeforImage = true
export function togleEye() {
    var passwordInput = document.getElementById('password');
    var eyeIcon = document.getElementById('eye-icon');
    if (togleEyeforImage == true) {
        togleEyeforImage = false
        document.querySelector('.signup-image-src').src = './images/peaking.webp'
    } else {
        togleEyeforImage = true
        document.querySelector('.signup-image-src').src = './assets/dontsee.webp'
    }

    passwordInput.type = (passwordInput.type === 'password') ? 'text' : 'password';
    eyeIcon.classList.toggle('zmdi-eye');
    eyeIcon.classList.toggle('zmdi-eye-off');
};


var toglesignupEyeforImage = true
export function toglesignupEye() {
    var passwordInput = document.getElementById('re_pass');
    var eyeIcon = document.getElementById('eye-icon');
    if (toglesignupEyeforImage == true) {
        toglesignupEyeforImage = false
        document.querySelector('.signup-image-src').src = './images/peaking.webp'
    } else {
        toglesignupEyeforImage = true
        document.querySelector('.signup-image-src').src = './assets/dontsee.webp'
    }

    passwordInput.type = (passwordInput.type === 'password') ? 'text' : 'password';
    eyeIcon.classList.toggle('zmdi-eye');
    eyeIcon.classList.toggle('zmdi-eye-off');
};


export function DisplayDontSee() {
    console.log("Dont see")
    document.querySelector('.signup-image-src').src = './assets/dontsee.webp'
}
export function DisplaySee() {
    document.querySelector('.signup-image-src').src = './images/typing.png'

}

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

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function findNumberLength(number) {
    const numberString = number.toString();
    const length = numberString.length;
    return length;
}
function isUsernameValid(username) {
    const lettersAndSpacesRegex = /^[a-zA-Z ]+$/;
    const isValid = lettersAndSpacesRegex.test(username);
    return isValid;
}


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getDatabase, ref, set, get, child, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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

let RegisterUser = evt => {
    // evt.preventDefault(); // (Optional) Prevents the default form submission behavior
    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phonenumber: parseInt(document.getElementById("phone").value),
        password: document.getElementById("password").value,
        confirmpassword: document.getElementById("re_pass").value,
        address: document.getElementById("address").value,
    };

    // Creating a new user with email and password
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((credentials) => {
            set(ref(db, "LoginCredentials/" + formData.name), {
                UserName: formData.name,
                Email: formData.email,
                Phone_No: formData.phonenumber,

            })
                .then(() => {
                    showToast("Sign up Successfull", "Success", 3)
                    setTimeout(() => {
                        document.getElementById("name").value = ''
                        document.getElementById("email").value = ''
                        document.getElementById("phone").value = ''
                        document.getElementById("password").value = ''
                        document.getElementById("re_pass").value = ''
                        document.getElementById("address").value = ''
                        localStorage.removeItem('signupdata');
                        window.location.href = "/anon/signin";
    
                    }, 1000);
                })
                .catch((error) => {
                    showToast(error,"Error",0)
                });
        })
        .catch((error) => {
        
            showToast(error.message,"Error",0);
        });


        
}

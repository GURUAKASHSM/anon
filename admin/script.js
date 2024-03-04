var adminData = localStorage.getItem('admindata');
if (adminData) {
    // Parse the JSON string to convert it into a JavaScript object
    var adminObject = JSON.parse(adminData);
    document.querySelector('.admin-name').innerHTML = ExtractUserName(adminObject.username)
    document.querySelector('.admin-target').innerHTML = `Congratulations ${ExtractUserName(adminObject.username)}`
} else {
    showToast('Please Login as admin', "Danger", 0);
}
const formData = {
    "token": adminData.token
}



function DisplayData() {
    fetch("http://localhost:8080/adminpage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                document.querySelector('.customer-count').innerHTML = `${data.result.usercount}k`
                document.querySelector('.seller-count').innerHTML = `${data.result.sellercount}k`
                document.querySelector('.product-count').innerHTML = `${data.result.productcount}k`
                document.querySelector('.sales-count').innerHTML = `${data.result.salescount}k`


            }

        })
        .catch(error => {
            showToast(error.message, "Danger", 0);
        });
}
DisplayData()



function ExtractUserName(name) {
    var adminname = "";
    for (let i = 0; i < name.length; i++) {
        if (name[i] == "@") {
            return adminname.toUpperCase();
        } else {
            adminname += name[i];
        }
    }
    return adminname.toUpperCase();
}


function LogOut() {
    localStorage.removeItem("admindata")
    localStorage.removeItem("adminsignindata")
    window.location.href = "/ecom/adminlogin"
}

function DisplaySellerData() {
    fetch("http://localhost:8080/getallsellerdata", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            let html = ""
            if (data.seller) {
                console.log(data.seller)
                data.seller.forEach((element, index) => {
                    html += `<li class="d-flex mb-4 pb-md-2">
                    <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div class="me-2">
                        <h6 class="mb-0">${element.sellername}</h6>
                        <small>${element.selleremail}</small>
                      </div>
                      <div>
                        <h6 class="mb-2">${element.phoneno}</h6>
                    </div>
                  </li>`
                })
                document.querySelector('.js-seller-data').innerHTML = html


            }

        })
        .catch(error => {
            showToast(error.message, "Danger", 0);
        });
}
DisplaySellerData();

function DisplayWorkers() {
    fetch("http://localhost:8080/getworkers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            let html = ""
            if (data.result) {
                data.result.forEach((element, index) => {
                    html += `                        <tr>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="avatar avatar-sm me-3">
                          <img src="./assets/img/avatars/1.png" alt="Avatar" class="rounded-circle" />
                        </div>
                        <div>
                          <h6 class="mb-0 text-truncate">${element.username}</h6>
                        </div>
                      </div>
                    </td>
                    <td class="text-truncate">${element.email}</td>
                    <td class="text-truncate">
                      <i class="mdi mdi-laptop mdi-24px text-danger me-1"></i>${element.role}
                    </td>
                    <td class="text-truncate">24</td>
                    <td class="text-truncate">${element.salary}</td>
                    <td><span class="badge bg-label-warning rounded-pill">${element.status}</span></td>
                  </tr>`
                })
                document.querySelector('.js-workers').innerHTML = html

            }

        })
        .catch(error => {
            showToast(error.message, "Danger", 0);
        });
}
DisplayWorkers()

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


function PrintContent() {

    var printableElement = document.getElementById('printableContent');

    // Open a new window for printing
    var printWindow = window.open('', '_blank');

    // Write the printable content to the new window
    printWindow.document.write('<html><head><title>Print</title></head><body>');
    printWindow.document.write(printableElement.innerHTML);
    printWindow.document.write('</body></html>');

    // Close the document stream and trigger the print dialog
    printWindow.document.close();
    printWindow.print();
}
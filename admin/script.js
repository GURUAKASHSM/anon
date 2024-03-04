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
    let count = 0
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

                data.seller.forEach((element, index) => {
                    count++
                    if (count == 5) {
                        document.querySelector('.js-seller-data').innerHTML = html
                        return
                    }
                    html += `<li class="d-flex mb-4 pb-md-2">
                    <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div class="me-2">
                        <h6 class="mb-0">${element.sellername.toUpperCase()}</h6>
                        <small>${element.selleremail}</small>
                      </div>
                      <div>
                        <h6 class="mb-2">${element.phoneno}</h6>
                    </div>
                  </li>`
                })
                document.querySelector('.js-seller-data').innerHTML = html
                return
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
                    html += `<tr>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="avatar avatar-sm me-3">
                          <img src="./assets/img/avatars/1.png" alt="Avatar" class="rounded-circle" />
                        </div>
                        <div>
                          <h6 class="mb-0 text-truncate">${element.username.toUpperCase()}</h6>
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


function TotlalSales() {
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
                console.log(data.result)
                document.querySelector('.customer-count').innerHTML = `${data.result.usercount}k`
                document.querySelector('.seller-count').innerHTML = `${data.result.sellercount}k`
                document.querySelector('.product-count').innerHTML = `${data.result.productcount}k`
                document.querySelector('.sales-count').innerHTML = `${data.result.salescount}k`
                document.querySelector('.total-growth').innerHTML = `Total Revenue Gained : &#8377; ${data.result.totalsalesamount}`
                document.querySelector('.total-sales-profit').innerHTML = ` &#8377; ${data.result.totalsalesamount}`
                document.querySelector('.target-persentage').innerHTML = `${calculatePercentage(10000, data.result.totalsalesamount)}% of target 🚀`
                document.querySelector('.profit').innerHTML = `&#8377;${data.result.totalsalesamount}`
                document.querySelector('.profit-persent').innerHTML = `+${calculatePercentage(1000, data.result.totalsalesamount)}%`




            }

        })
        .catch(error => {
            showToast(error.message, "Danger", 0);
        });
}

TotlalSales();

function calculatePercentage(totalAmount, receivedAmount) {
    if (totalAmount <= 0) {
        console.error("Total amount should be greater than zero.");
        return null;
    }

    const percentage = (receivedAmount / totalAmount) * 100;
    return percentage.toFixed(2); // Round to two decimal places
}
function DisplayFeedBack() {
    let count = 0;
    fetch("http://localhost:8080/getfeedback", {
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
                    count++
                    if (count == 6) {
                        document.querySelector('.js-seller-data').innerHTML = html
                        return
                    }
                    element.role = element.role.toUpperCase()
                    html += `<li class="d-flex mb-4 pb-md-2">
                    <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div class="me-2">
                        <h6 class="mb-0">${element.email}</h6>
                        <small>${element.feedback}</small>
                      </div>
                      <div class="d-flex align-items-center">
                        <h9 class="mb-2">${element.role}</h9>
                        
                      </div>
                      <img src="./images/success.png" height="17px" style="cursor:pointer" alt="Delete" class="delete-icon" onclick="deleteFeedback('${element.email}','${element.feedback}')">
                    </div>
                  </li>`
                })
                document.querySelector('.js-feedback-data').innerHTML = html

            }

        })
        .catch(error => {
            showToast(error.message, "Danger", 0);
        });
}
DisplayFeedBack()

function deleteFeedback(email, feedback) {
    fetch("http://localhost:8080/deletefeedback", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, feedback })
    })
        .then(response => response.json())
        .then(data => {
            if (data === 1) {
                DisplayFeedBack()
            } else {
                alert("Error deleting feedback");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
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


function addDeleteIcon(feedbackBox, email, feedback) {
    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add("delete-icon");
    deleteIcon.innerHTML = "&#10006;"; // X icon
    deleteIcon.addEventListener("click", function () {
        // Send email and feedback to the "/deletefeedback" route
        fetch("http://localhost:8080/deletefeedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, feedback })
        })
            .then(response => response.json())
            .then(data => {
                if (data === 1) {
                    // Feedback deleted successfully, remove the feedback item from the UI
                    feedbackBox.remove();
                } else {
                    alert("Error deleting feedback");
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });
    feedbackBox.appendChild(deleteIcon);
}

function DisplayListUsers() {
    console.log("Displaylist")
    document.querySelector('.container-p-y').style.display = 'none';
    document.getElementById('snippetContent').style.display = 'block';
    document.getElementById('sellersnip').style.display = 'none';
    document.getElementById('Inventorysnip').style.display = 'none';
    fetch('http://localhost:8080/getallcustomerdata')
        .then(response => response.json())
        .then(data => {
            let html = ""

            data.forEach(customer => {

                html += `
            <tr class="candidates-list">
            <td class="title">
              <div class="thumb"> <img class="img-fluid"
                  src="https://previews.123rf.com/images/jenjawin/jenjawin1904/jenjawin190400251/120265520-account-icon-outline-vector-eps10-user-profile-sign-web-icon-with-check-mark-glyph-user-authorized.jpg" alt="">
              </div>
              <div class="candidate-list-details">
                <div class="candidate-list-info">
                  <div class="candidate-list-title">
                    <h5 class="mb-0"><a href="#">${customer.name.toUpperCase()}</a></h5>
                  </div>
                  <div class="candidate-list-option">
                    <ul class="list-unstyled">
                      <li><i class="fas fa-filter pr-1"></i>${customer.email}
                      </li>
                      <li><i class="fas fa-map-marker-alt pr-1"></i>${customer.address}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </td>
            <td class="candidate-list-favourite-time text-center"> <a
                class="candidate-list-favourite order-2 text-danger" href="#"></a>
              <span class="candidate-list-time order-1">${customer.phonenumber}</span></td>
            <td>
              <ul class="list-unstyled mb-0 d-flex justify-content-end">
              <li><a href="#" class="text-info" data-toggle="tooltip" title="" data-original-title="Edit"><i
              class="fas fa-pencil-alt"></i></a>
              </li>
                <li  onclick="DeleteData('${customer.email}','cus')"><a class="text-danger" data-toggle="tooltip" title=""
                    data-original-title="Delete"><i class="far fa-trash-alt"></i></a></li>
              </ul>
            </td>
          </tr>`;

            });
            document.querySelector('.user-list-body').innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
function DeleteData(email, coll) {
    const requestData = {
        collection: "",
        idValue: email
    };
    if (coll == 'cus') {
        const collection = "customer";
        requestData.collection = collection
    } else if (coll == "sel") {
        const collection = "seller";
        requestData.collection = collection
    } else if (coll == "inven") {
        const collection = "inventory";
        requestData.collection = collection
    }



    // Send a DELETE request to your server to delete the data
    fetch("http://localhost:8080/deletedata", {
        method: "POST", // Use DELETE method to delete data
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            ;
            if (data === true) {
                // alert("Deleted Sucessfull")
                if (coll == 'cus') {
                    DisplayListUsers()
                } else if (coll == "sel") {
                    DisplayListSeller()
                } else if (coll == "inven") {
                    DisplayListInventory()
                }

            } else {
                alert("Error in Deleting")
            }
        })
        .catch(error => {
            console.log(error.message)
        });


}


function DisplayListSeller() {
    console.log("Displaylist")
    document.querySelector('.container-p-y').style.display = 'none';
    document.getElementById('snippetContent').style.display = 'none';
    document.getElementById('sellersnip').style.display = 'block';
    document.getElementById('Inventorysnip').style.display = 'none';
    fetch("http://localhost:8080/getallsellerdata", {
        method: "POST", // Use DELETE method to delete data
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify()
    })

        .then(response => response.json())
        .then(data => {
            let html = ""

            data.seller.forEach(customer => {

                html += `
            <tr class="candidates-list">
            <td class="title">
              <div class="thumb"> <img class="img-fluid"
                  src="https://previews.123rf.com/images/jenjawin/jenjawin1904/jenjawin190400251/120265520-account-icon-outline-vector-eps10-user-profile-sign-web-icon-with-check-mark-glyph-user-authorized.jpg" alt="">
              </div>
              <div class="candidate-list-details">
                <div class="candidate-list-info">
                  <div class="candidate-list-title">
                    <h5 class="mb-0"><a href="#">${customer.sellername.toUpperCase()}</a></h5>
                  </div>
                  <div class="candidate-list-option">
                    <ul class="list-unstyled">
                      <li><i class="fas fa-filter pr-1"></i>${customer.selleremail}
                      </li>
                      <li><i class="fas fa-map-marker-alt pr-1"></i>${customer.address}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </td>
            <td class="candidate-list-favourite-time text-center"> <a
                class="candidate-list-favourite order-2 text-danger" href="#"></a>
              <span class="candidate-list-time order-1">${customer.phoneno}</span></td>
            <td>
              <ul class="list-unstyled mb-0 d-flex justify-content-end">
              <li onclick="Editdata('${customer.selleremail}','seller')"><aclass="text-info" data-toggle="tooltip" title="" data-original-title="Edit"><i
              class="fas fa-pencil-alt"></i></a>
              </li>
                <li  onclick="DeleteData('${customer.selleremail}','sel')"><a class="text-danger" data-toggle="tooltip" title=""
                    data-original-title="Delete"><i class="far fa-trash-alt"></i></a></li>
              </ul>
            </td>
          </tr>`;

            });
            document.querySelector('.seller-list-body').innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function DisplayListInventory() {
    console.log("Displaylist")
    document.querySelector('.container-p-y').style.display = 'none';
    document.getElementById('snippetContent').style.display = 'none';
    document.getElementById('sellersnip').style.display = 'none';
    document.getElementById('Inventorysnip').style.display = 'block';
    fetch("http://localhost:8080/getallinventorydata", {
        method: "GET", // Use DELETE method to delete data
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify()
    })

        .then(response => response.json())
        .then(data => {
            let html = ""

            data.Inventory.forEach(customer => {

                html += `
            <tr class="candidates-list">
            <td class="title">
              <div class="thumb"> <img class="img-fluid"
              src="data:image/jpeg;base64,${customer.image}" alt="">
              </div>
              <div class="candidate-list-details">
                <div class="candidate-list-info">
                  <div class="candidate-list-title">
                    <h5 class="mb-0"><a href="#">${customer.itemname.toUpperCase()}</a></h5>
                  </div>
                  <div class="candidate-list-option">
                    <ul class="list-unstyled">
                      <li><i class="fas fa-filter pr-1"></i>${customer.itemcategory.toUpperCase()}
                      </li>
                      <li><i class="fas fa-map-marker-alt pr-1"></i>${customer.quantity}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </td>
            <td class="candidate-list-favourite-time text-center"> <a
                class="candidate-list-favourite order-2 text-danger" href="#"></a>
              <span class="candidate-list-time order-1">${customer.price}</span></td>
            <td>
              <ul class="list-unstyled mb-0 d-flex justify-content-end">
              <li><a href="#" class="text-info" data-toggle="tooltip" title="" data-original-title="Edit"><i
              class="fas fa-pencil-alt"></i></a>
              </li>
                <li  onclick="DeleteData('${customer.itemname}','inven')"><a class="text-danger" data-toggle="tooltip" title=""
                    data-original-title="Delete"><i class="far fa-trash-alt"></i></a></li>
              </ul>
            </td>
          </tr>`;

            });
            document.querySelector('.inventory-list-body').innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}



function Editdata(){
    
}
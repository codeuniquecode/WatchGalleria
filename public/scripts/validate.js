document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("userForm").addEventListener("submit", userValidate);
    document.getElementById("vendorForm").addEventListener("submit", vendorValidate);
});

function userValidate(e) {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let emailerr = document.getElementById("emailHelp");
    let passworderr = document.getElementById("passwordHelpBox");
    let name = document.getElementById("fullname").value;
    let namerr = document.getElementById("nameHelp");
    let phone = document.getElementById('phone').value;
    let phonerr = document.getElementById('phoneHelp');
    let address = document.getElementById('address').value;
    let addresserr = document.getElementById('addresserr');

    let valid = true;

    // Email validation
    if (email.trim() === "") {
        emailerr.innerText = "*Please enter email*";
        emailerr.classList.add('error');
        valid = false;
    } else {
        emailerr.innerText = "";
        emailerr.classList.remove("error");
    }

    // Password validation
    if (password.trim() === "") {
        passworderr.innerText = "*Please enter password*";
        passworderr.classList.add('error');
        valid = false;
    } else if (password.length < 8) {
        passworderr.innerText = "*Password must be 8 characters long*";
        passworderr.classList.add('error');
        valid = false;
    } else {
        passworderr.innerText = "";
        passworderr.classList.remove('error');
    }

    // Name validation
    if (name.trim() === "") {
        namerr.innerText = "*Please enter name*";
        namerr.classList.add('error');
        valid = false;
    } else if (name.length < 5) {
        namerr.innerText = "*Please enter a valid name*";
        namerr.classList.add('error');
        valid = false;
    } else {
        namerr.innerText = "";
        namerr.classList.remove("error");
    }

    // Phone validation
    if (phone.trim() === "") {
        phonerr.innerText = "*Please enter Phone Number*";
        phonerr.classList.add('error');
        valid = false;
    } else if (phone.length !== 10 || isNaN(phone)) {
        phonerr.innerText = "*Please enter a valid 10-digit Phone Number*";
        phonerr.classList.add('error');
        valid = false;
    } else {
        phonerr.innerText = "";
        phonerr.classList.remove("error");
    }

    // Address validation
    if (address.trim() === "") {
        addresserr.innerText = "*Please enter address*";
        addresserr.classList.add('error');
        valid = false;
    } else if (address.length < 5) {
        addresserr.innerText = "*Please enter a valid address*";
        addresserr.classList.add('error');
        valid = false;
    } else {
        addresserr.innerText = "";
        addresserr.classList.remove("error");
    }

    // Prevent form submission if any validation fails
    if (!valid) {
        e.preventDefault(); // Prevents form submission
    }
}

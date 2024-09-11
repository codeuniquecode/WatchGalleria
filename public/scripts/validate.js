document.addEventListener('DOMContentLoaded', function (){
document.getElementById("vendorForm").addEventListener("submit", vendorValidate);
document.getElementById("userForm").addEventListener("submit", userValidate);
});
function userValidate(e) {
    let email = document.getElementById("exampleInputEmail1").value;
    let password = document.getElementById("exampleInputPassword1").value;
    let emailerr = document.getElementById("emailHelp");
    let passworderr = document.getElementById("passwordHelpBox");
    let name = document.getElementById("name").value;
    let namerr = document.getElementById("nameHelp");
    let phone = document.getElementById('phone').value;
    let phonerr = document.getElementById('phoneHelp');

    let valid = true;

    // Email validation
    if (email.length < 1) {
        emailerr.innerText = "*Please enter email*";
        emailerr.classList.add('error');
        valid = false;
    } else {
        emailerr.innerText = "";
        emailerr.classList.remove("error");
    }

    // Password validation
    if (password.length < 1) {
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
    if (name.length < 1) {
        namerr.innerText = "*Please enter name*";
        namerr.classList.add('error');
        valid = false;
    } else if (name.length < 5) {
        namerr.innerText = "*Please enter a valid name*";
        namerr.classList.add('error');
        valid = false;
    }
    else {
        namerr.innerText = "";
        namerr.classList.remove("error");
    }

    // Phone validation
    if (phone.length < 1) {
        phonerr.innerText = "*Please enter Phone Number*";
        phonerr.classList.add('error');
        valid = false;
    }
    else if (phone.length !== 10) {
        phonerr.innerText = "*Please enter valid Phone Number*";
        phonerr.classList.add('error');
        valid = false;
    }
    else if (isNaN(phone)) {
        phonerr.innerText = "*Characters not allowed*";
        phonerr.classList.add('error');
        valid = false;
    }
    else {
        phonerr.innerText = "";
        phonerr.classList.remove("error");
    }

    //Address Validation
    let address = document.getElementById('address').value;
    let addresserr = document.getElementById('addresserr');
    if (address.length < 1) {
        addresserr.innerText = "*Please enter address*";
        addresserr.classList.add('error');
        valid = false;
    } else if (address.length < 5) {
        addresserr.innerText = "*Please enter a valid address*";
        addresserr.classList.add('error');
        valid = false;
    } else {
        namerr.innerText = "";
        namerr.classList.remove("error");
    }
    // Prevent form submission if any validation fails
    if (!valid) {
        e.preventDefault();
    } else {
        console.log(email);
    }
};

function vendorValidate(e) {

    let pan = document.getElementById('pan').value;
    let panerr = document.getElementById('panerr');

    let email = document.getElementById("exampleInputEmail1").value;
    let password = document.getElementById("exampleInputPassword1").value;
    let emailerr = document.getElementById("emailHelp");
    let passworderr = document.getElementById("passwordHelpBox");
    let name = document.getElementById("name").value;
    let namerr = document.getElementById("nameHelp");
    let phone = document.getElementById('phone').value;
    let phonerr = document.getElementById('phoneHelp');
    let address = document.getElementById('address').value;
    let addresserr = document.getElementById('addresserr');

    let valid = true;

    // Email validation
    if (email.length < 1) {
        emailerr.innerText = "*Please enter email*";
        emailerr.classList.add('error');
        valid = false;
    } else {
        emailerr.innerText = "";
        emailerr.classList.remove("error");
    }

    // Password validation
    if (password.length < 1) {
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
    if (name.length < 1) {
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
    if (phone.length < 1) {
        phonerr.innerText = "*Please enter Phone Number*";
        phonerr.classList.add('error');
        valid = false;
    } else if (phone.length !== 10) {
        phonerr.innerText = "*Please enter a valid Phone Number*";
        phonerr.classList.add('error');
        valid = false;
    } else if (isNaN(phone)) {
        phonerr.innerText = "*Characters not allowed*";
        phonerr.classList.add('error');
        valid = false;
    } else {
        phonerr.innerText = "";
        phonerr.classList.remove("error");
    }

    // Address validation
    if (address.length < 1) {
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

    // PAN validation
    if (pan.length < 1) {
        panerr.innerText = "*Please enter PAN No.*";
        panerr.classList.add('error');
        valid = false;
    } else if (pan.length !== 10) {
        panerr.innerText = "*Please enter a valid PAN No.*";
        panerr.classList.add('error');
        valid = false;
    } else if (isNaN(pan)) { // Corrected the wrong variable check
        panerr.innerText = "*Characters not allowed*";
        panerr.classList.add('error');
        valid = false;
    } else {
        panerr.innerText = "";
        panerr.classList.remove("error");
    }

    // Prevent form submission if any validation fails
    if (!valid) {
        return false;
    } else {
        console.log("Form is valid and ready for submission.");
        document.getElementById('vendorForm').submit(); // Submit form programmatically
    }
}

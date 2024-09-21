document.addEventListener('DOMContentLoaded', (event) => {
    let btnsubmit = document.getElementById("btnsubmit");

    btnsubmit.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent the default form submission

        let email = document.getElementById("exampleInputEmail1").value;
        let password = document.getElementById("exampleInputPassword1").value;
        let emailerr = document.getElementById("emailHelp");
        let passworderr = document.getElementById("passwordHelpBox");
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

        // If all fields are valid, proceed with form submission
        if (valid) {
            
            console.log("Form is valid. Submitting...");
            // You can now submit the form or perform any other actions
            document.getElementById("loginForm").submit();
        }
    });
});

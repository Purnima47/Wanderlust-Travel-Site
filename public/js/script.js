(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))







// Validation for password and confirm password

function checkPassword() {
  let password = document.querySelector('#password').value;
  let invalidDiv = document.querySelector('#feedback');
  let confirmPass = document.querySelector('#confirm-password').value;
  let signUpBtn = document.querySelector('#signUp');
  let isValid = true;

  if (!password || !confirmPass) {
    isValid = false;
  }

  if (password !== confirmPass) {
    invalidDiv.innerText = 'Password Does not Match';
    isValid = false;
  } else if (password === confirmPass) {
    invalidDiv.innerText = '';
    isValid = true;
  }

  if (isValid) {
    signUpBtn.classList.add("enabled");
  } else {
    signUpBtn.classList.remove('enabled');
  }
}



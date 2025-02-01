document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = sanitizeInput(document.getElementById('name').value);
    const email = sanitizeInput(document.getElementById('email').value);
    const message = sanitizeInput(document.getElementById('message').value);
    const date = new Date().toLocaleString();

    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        date: date,
        subject: "Received from GitHub webpage"
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
            alert('Thank you for your message!');
        }, function(error) {
            alert('Failed to send the message. Please try again later.');
        });
});

function sanitizeInput(input) {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
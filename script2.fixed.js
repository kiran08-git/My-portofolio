function sendMail() {
    let parms = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value
    };

    // Temporary: log parameters — replace with real send logic as needed
    console.log('sendMail', parms);
}

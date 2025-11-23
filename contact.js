document.addEventListener("DOMContentLoaded", () => {

    const contactForm = document.getElementById("contactForm");
  
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
  
      // Get form values
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();
  
      // Build email body
      const emailBody = `
  Name: ${name}
  Email: ${email}
  
  Message:
  ${message}
  `;
  
      // Create mailto link
      const mailtoLink = `mailto:gleent89@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
  
      // Open user's default email app
      window.location.href = mailtoLink;
  
      // Show success alert
      alert("Your message has been prepared in your email app. Please click send.");
  
      // Reset form
      contactForm.reset();
    });
  
    // WhatsApp link optional listener
    const whatsappLink = document.querySelector(".whatsapp-link");
    if (whatsappLink) {
      whatsappLink.addEventListener("click", () => {
        console.log("Opening WhatsApp chat...");
      });
    }
  
  });
  
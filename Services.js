let currentService = "";

// WhatsApp numbers for each service
const whatsappNumbers = {
  pickup: "2348011111111",
  enquiry: "2348022222222",
  webdesign: "2348033333333",
  customerservice: "2348044444444",
  gift: "2348055555555",
  baking: "2348066666666",
  beauty: "2348077777777",
  moving: "2348088888888",
  repairs: "2348099999999"
};

// Define fields for each service
const serviceForms = {
  pickup: [
    { id: "name", label: "Your Name", type: "text" },
    { id: "phone", label: "Phone Number", type: "text" },
    { id: "pickupAddress", label: "Pickup Address", type: "text" },
    { id: "dropoffAddress", label: "Drop-off Address", type: "text" },
    { id: "datetime", label: "Preferred Date & Time", type: "text" }
  ],
  enquiry: [
    { id: "name", label: "Your Name", type: "text" },
    { id: "phone", label: "Phone Number", type: "text" },
    { id: "product", label: "Product Name / Code", type: "text" },
    { id: "question", label: "Your Question", type: "textarea" }
  ],
  webdesign: [
    { id: "name", label: "Your Name", type: "text" },
    { id: "phone", label: "Phone Number", type: "text" },
    { id: "businessType", label: "Business Type", type: "text" },
    { id: "goal", label: "Website Goal", type: "text" },
    { id: "notes", label: "Extra Notes", type: "textarea" }
  ],
  customerservice: [
    { id: "name", label: "Your Name", type: "text" },
    { id: "phone", label: "Phone Number", type: "text" },
    { id: "issueType", label: "Issue Type", type: "select", options: ["Billing", "Delivery", "Account", "Other"] },
    { id: "description", label: "Description", type: "textarea" }
  ],
  gift: [
    { id: "name", label: "Your Name", type: "text" },
    { id: "phone", label: "Phone Number", type: "text" },
    { id: "occasion", label: "Occasion", type: "select", options: ["Birthday", "Wedding", "Corporate", "Anniversary", "Other"] },
    { id: "items", label: "Preferred Items", type: "textarea" },
    { id: "address", label: "Delivery Address", type: "text" }
  ],
  baking: [
    { id: "name", label: "Your Name", type: "text" },
    { id: "phone", label: "Phone Number", type: "text" },
    { id: "cakeType", label: "Cake / Snack Type", type: "select", options: ["Cake", "Cupcake", "Meat Pie", "Doughnut", "Other"] },
    { id: "quantity", label: "Quantity", type: "text" },
    { id: "delivery", label: "Delivery Date & Address", type: "text" }
  ],
  beauty: [
    { id: "name", label: "Your Name", type: "text" },
    { id: "phone", label: "Phone Number", type: "text" },
    { id: "serviceType", label: "Service Type", type: "select", options: ["Bridal", "Party", "Casual", "Photoshoot", "Other"] },
    { id: "appointment", label: "Appointment Date & Time", type: "text" },
    { id: "location", label: "Location", type: "text" }
  ],
  moving: [
    { id: "name", label: "Your Name", type: "text" },
    { id: "phone", label: "Phone Number", type: "text" },
    { id: "current", label: "Current Address", type: "text" },
    { id: "destination", label: "Destination Address", type: "text" },
    { id: "moveDate", label: "Move Date", type: "text" },
    { id: "items", label: "Items to Move", type: "textarea" }
  ],
  repairs: [
    { id: "name", label: "Your Name", type: "text" },
    { id: "phone", label: "Phone Number", type: "text" },
    { id: "repairType", label: "Type of Repair", type: "select", options: ["Plumbing", "Electrical", "Carpentry", "Painting", "Other"] },
    { id: "description", label: "Description", type: "textarea" },
    { id: "address", label: "Address", type: "text" }
  ]
};

// Open popup with correct form
function openForm(service) {
  currentService = service;
  document.getElementById("form-title").innerText = "Request: " + service;

  const fields = serviceForms[service];
  let formHTML = "";

  fields.forEach(field => {
    if (field.type === "textarea") {
      formHTML += `<label>${field.label}</label><textarea id="${field.id}" required></textarea>`;
    } else if (field.type === "select") {
      formHTML += `<label>${field.label}</label><select id="${field.id}" required>`;
      field.options.forEach(opt => {
        formHTML += `<option value="${opt}">${opt}</option>`;
      });
      formHTML += `</select>`;
    } else {
      formHTML += `<label>${field.label}</label><input type="${field.type}" id="${field.id}" required>`;
    }
  });

  document.getElementById("form-fields").innerHTML = formHTML;
  document.getElementById("popup").style.display = "flex";
}

// Close popup
function closeForm() {
  document.getElementById("popup").style.display = "none";
}

// Handle submit
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("service-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const fields = serviceForms[currentService];
    const number = whatsappNumbers[currentService];

    let message = "Hello, I want to request this service:\n";
    fields.forEach(f => {
      const value = document.getElementById(f.id).value;
      message += `${f.label}: ${value}\n`;
    });

    let url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    closeForm();
  });
});

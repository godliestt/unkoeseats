// script.js

function setActiveNav() {
  const path = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const links = document.querySelectorAll("nav a");
  links.forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.setAttribute("aria-current", "page");
  });
}

// NEW: Fetches menu from the database and builds the HTML cards
async function loadMenu() {
  try {
    const response = await fetch('/api/menu');
    const menuItems = await response.json();
    
    const menuContainer = document.querySelector('.grid.two');
    if (!menuContainer) return;

    menuContainer.innerHTML = ''; // Clears the hardcoded HTML items

    menuItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('data-menu-item', '');
      card.setAttribute('data-tags', item.category);
      
      card.innerHTML = `
        <h3>${item.name} - $${item.price}</h3>
        <p class="muted">Freshly prepared local favorite.</p>
      `;
      menuContainer.appendChild(card);
    });

    // Initialize the filter logic AFTER the new cards are built
    menuFilterInit();
  } catch (err) {
    console.error('Error fetching menu:', err);
  }
}

function menuFilterInit() {
  const filter = document.getElementById("menuFilter");
  const cards = document.querySelectorAll("[data-menu-item]");

  if (!filter || cards.length === 0) return;

  filter.addEventListener("change", () => {
    const value = filter.value;

    cards.forEach(card => {
      const tags = (card.getAttribute("data-tags") || "").split(",").map(s => s.trim());
      const show = value === "all" || tags.includes(value);
      card.style.display = show ? "" : "none";
    });
  });
}

function contactFormInit() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    const msg = document.getElementById("contactMsg");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const name = form.elements["name"]?.value.trim();
        const phone = form.elements["phone"]?.value.trim();
        const email = form.elements["email"]?.value.trim();
        const details = form.elements["details"]?.value.trim();
        const inquiryTypes = Array.from(form.querySelectorAll('input[name="inquiry"]:checked')).map(i => i.value);

        if (!name || !email || !details) {
            msg.className = "notice bad";
            msg.textContent = "Please fill out Name, Email, and Description before submitting.";
            return;
        }

        // REPLACED: Sends data to the server instead of LocalStorage
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    phone,
                    email,
                    details,
                    type: inquiryTypes.join(", ")
                })
            });

            if (response.ok) {
                msg.className = "notice good";
                msg.textContent = `Thanks, ${name}! Your message has been sent to our database.`;
                form.reset();
            } else {
                throw new Error("Server response was not ok");
            }
        } catch (error) {
            msg.className = "notice bad";
            msg.textContent = "Error sending message. Please check the server.";
            console.error(error);
        }
    });
}

function feedbackFormInit() {
  const form = document.getElementById("feedbackForm");
  if (!form) return;

  const msg = document.getElementById("feedbackMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.elements["name"]?.value.trim();
    const rating = form.elements["rating"]?.value;
    const comments = form.elements["comments"]?.value.trim();

    if (!rating || !comments) {
      msg.className = "notice bad";
      msg.textContent = "Please select a rating and write a comment.";
      return;
    }

    // REPLACED: Sends data to the server instead of LocalStorage
    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name || "Anonymous",
                rating: Number(rating),
                comments
            })
        });

        if (response.ok) {
            msg.className = "notice good";
            msg.textContent = "Mahalo! Your feedback has been saved to our database.";
            form.reset();
        } else {
            throw new Error("Server response was not ok");
        }
    } catch (error) {
        msg.className = "notice bad";
        msg.textContent = "Error saving feedback. Please check the server.";
        console.error(error);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  loadMenu(); // This handles loading the items AND triggering menuFilterInit
  contactFormInit();
  feedbackFormInit();
});

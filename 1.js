// ================================
// ELEMENT REFERENCES
// ================================
const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const consentCheckbox = document.getElementById("consent");
const darkToggle = document.getElementById("darkToggle");

// Input fields
const nameInput = document.getElementById("name");
const rollnoInput = document.getElementById("rollno");
const branchInput = document.getElementById("branch");
const favCricketerInput = document.getElementById("favCricketer");
const mobileInput = document.getElementById("mobile");

// ================================
// CONSENT LOGIC
// ================================
submitBtn.disabled = true;

consentCheckbox.addEventListener("change", () => {
  submitBtn.disabled = !consentCheckbox.checked;
});

// ================================
// FORM SUBMISSION
// ================================
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Trimmed values
  const name = nameInput.value.trim();
  const rollno = rollnoInput.value.trim();
  const branch = branchInput.value;
  const favCricketer = favCricketerInput.value.trim();
  const mobile = mobileInput.value.trim();

  // ----------------
  // VALIDATION
  // ----------------
  if (!name || !rollno || !branch || !favCricketer) {
    alert("Please fill all required fields.");
    return;
  }

  if (mobile && !/^[0-9]{10}$/.test(mobile)) {
    alert("Mobile number must be 10 digits.");
    return;
  }

  if (!consentCheckbox.checked) {
    alert("Please provide consent to continue.");
    return;
  }

  // ----------------
  // SAVE PLAYER DATA
  // ----------------
  const playerData = {
    name: name,
    rollno: rollno,
    branch: branch,
    favCricketer: favCricketer,
    mobile: mobile,
    registeredAt: new Date().toISOString()
  };

  // Save current player
  localStorage.setItem("currentPlayer", JSON.stringify(playerData));

  // Optional: maintain list of all players
  let allPlayers = JSON.parse(localStorage.getItem("allPlayers")) || [];
  allPlayers.push(playerData);
  localStorage.setItem("allPlayers", JSON.stringify(allPlayers));

  // ----------------
  // SUCCESS + REDIRECT
  // ----------------
  alert("Registration successful! Redirecting to rules...");
  window.location.href = "2.html";
});

// ================================
// DARK MODE LOGIC
// ================================

// Load saved theme on page load
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  if (darkToggle) darkToggle.checked = true;
}

// Toggle dark mode
if (darkToggle) {
  darkToggle.addEventListener("change", () => {
    if (darkToggle.checked) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });
}

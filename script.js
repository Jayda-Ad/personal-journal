// Class
class User {
    constructor(name) {
        this.name = name;
        this.entries = [];
    }

    addEntry(text) {
        const date = new Date();
        this.entries.push({
            text,
            date: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
        });
    }

    deleteEntry(index) {
        this.entries.splice(index, 1);
    }
}

// Storage
const rawUsers = JSON.parse(localStorage.getItem("journalUsers")) || {};
const users = {};
for (const name in rawUsers) {
    const user = new User(name);
    user.entries = rawUsers[name].entries;
    users[name] = user;
}

let currentUser = null;
let selectedEntryIndex = null;

// DOM Elements
const welcomePage = document.getElementById("welcome");
const statsPage = document.getElementById("name");
const journalPage = document.getElementById("journal");
const nav = document.getElementById("mainNav");

const nameInput = document.getElementById("nameInput");
const chooseName = document.getElementById("chooseName");
const helloName = document.getElementById("helloName");
const totalEntriesLabel = document.getElementById("totalEntries");
const lastDayLabel = document.getElementById("lastDayEntered");
const textEntry = document.getElementById("textEntry");
const entrySelect = document.getElementById("entrySelect");

const saveEntryBtn = document.getElementById("saveEntryBtn");
const newEntryBtn = document.getElementById("newEntryBtn");

// Functions
function showPage(page) {
    welcomePage.style.display = "none";
    statsPage.style.display = "none";
    journalPage.style.display = "none";
    page.style.display = "block";

    nav.style.display = currentUser && page !== welcomePage ? "flex" : "none"; 
}

function refreshChooseList() {
    chooseName.innerHTML = "";
    for (const name in users) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        chooseName.appendChild(option);
    }
}

function updateStats() {
    helloName.textContent = `Hello ${currentUser.name}`;
    totalEntriesLabel.textContent = `Total Entries: ${currentUser.entries.length}`;
    if(currentUser.entries.length > 0) {
        lastDayLabel.textContent = `Last Day Entered: ${currentUser.entries[currentUser.entries.length-1].date}`;
    } else {
        lastDayLabel.textContent = `Last Day Entered: —`;
    }
}

function renderEntries() {
    entrySelect.innerHTML = `<option value="">Select an entry</option>`;
    currentUser.entries.forEach((entry, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${entry.date} — ${entry.text.slice(0,30)}...`;
        entrySelect.appendChild(option);
    });
}

// Event Listeners

// Save new user
document.getElementById("saveNameBtn").addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name) return;
    if (!users[name]) users[name] = new User(name);
    currentUser = users[name];
    localStorage.setItem("journalUsers", JSON.stringify(users));
    nameInput.value = "";
    updateStats();
    refreshChooseList();
    showPage(statsPage);
});

// Choose existing user
document.getElementById("chooseBtn").addEventListener("click", () => {
    const name = chooseName.value;
    if (!name) return;
    currentUser = users[name];
    updateStats();
    showPage(statsPage);
});

// Start journaling
document.getElementById("startBtn").addEventListener("click", () => {
    showPage(journalPage);
    textEntry.value = "";
    entrySelect.value = "";
    selectedEntryIndex = null;
    renderEntries();

    saveEntryBtn.style.display = "inline-block";
    newEntryBtn.style.display = "none";
});

// Save Entry
saveEntryBtn.addEventListener("click", () => {
    const text = textEntry.value.trim();
    if (!text) return;
    currentUser.addEntry(text);
    localStorage.setItem("journalUsers", JSON.stringify(users));
    textEntry.value = "";
    selectedEntryIndex = null;
    renderEntries();
    updateStats();
});

// Delete Entry
document.getElementById("deleteBtn").addEventListener("click", () => {
    if (entrySelect.value === "") return alert("Select an entry first.");
    const index = Number(entrySelect.value);
    currentUser.deleteEntry(index);
    localStorage.setItem("journalUsers", JSON.stringify(users));
    textEntry.value = "";
    selectedEntryIndex = null;
    renderEntries();
    updateStats();
});

// New Entry
newEntryBtn.addEventListener("click", () => {
    textEntry.value = "";
    entrySelect.value = "";
    selectedEntryIndex = null;
    saveEntryBtn.style.display = "inline-block";
    newEntryBtn.style.display = "none";
});

// Entry select change
entrySelect.addEventListener("change", () => {
    if (entrySelect.value === "") return;
    selectedEntryIndex = Number(entrySelect.value);
    textEntry.value = currentUser.entries[selectedEntryIndex].text;
    saveEntryBtn.style.display = "none";
    newEntryBtn.style.display = "inline-block";
});

// Change User
document.getElementById("changeUserBtn").addEventListener("click", () => {
    showPage(welcomePage)
});

// Stats Button
document.getElementById("statsBtn").addEventListener("click", () => {
    if (!currentUser) return alert("Select a user first.");
    updateStats();
    showPage(statsPage);
});

// Delete User
document.getElementById("deleteUserBtn").addEventListener("click", () => {
    delete users[currentUser.name];
    localStorage.setItem("journalUsers", JSON.stringify(users));
    currentUser = null;
    selectedEntryIndex = null;
    refreshChooseList();
    showPage(welcomePage);
});

// On load
window.addEventListener("load", () => {
    refreshChooseList();
    showPage(welcomePage);
});
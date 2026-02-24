// API Configuration - Auto-detect based on current location
const API_BASE_URL = window.location.origin;
const TOKEN_KEY = "tt_auth_token";
const USER_KEY = "tt_current_user";

function getAuthHeaders(extra = {}) {
    const token = localStorage.getItem(TOKEN_KEY);
    return token
        ? { ...extra, Authorization: `Bearer ${token}` }
        : { ...extra };
}

// AUTH
async function login() {
    const user = document.getElementById("username")?.value.trim();
    const pass = document.getElementById("password")?.value;

    if (!user || !pass) {
        return alert("Please enter username and password");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: user, password: pass })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            const message = err.error || "Login failed. Check your credentials.";
            return alert(message);
        }

        const data = await response.json();
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        window.location.href = "index.html";
    } catch (error) {
        console.error("Login error:", error);
        alert("Unable to login. Please try again.");
    }
}

async function register() {
    const name = document.getElementById("name")?.value.trim();
    const user = document.getElementById("username")?.value.trim();
    const pass = document.getElementById("password")?.value;

    if (!user || !pass) {
        return alert("Please enter username and password");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: user, password: pass, name })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            const message = err.error || "Registration failed.";
            return alert(message);
        }

        const data = await response.json();
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        window.location.href = "index.html";
    } catch (error) {
        console.error("Register error:", error);
        alert("Unable to register. Please try again.");
    }
}

async function checkLogin() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error("Not authenticated");
        }

        const user = await response.json();
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = "login.html";
}

// DATA - Now using MongoDB via API (per authenticated tutor)
let students = [];

// Load students from API
async function loadStudentsFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/students`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error("Failed to fetch students");
        students = await response.json();
        loadStudents();
    } catch (error) {
        console.error("Error loading students:", error);
        // Silently fail on first load (useful for cold starts on free hosting)
    }
}

async function addStudent() {
    let name = document.getElementById("name").value;
    let fees = parseInt(document.getElementById("fees").value);
    let paid = parseInt(document.getElementById("paid").value);
    let date = document.getElementById("paymentDate").value;

    if (!name || !fees || !paid || !date) return alert("Fill all fields");

    try {
        const response = await fetch(`${API_BASE_URL}/students`, {
            method: "POST",
            headers: getAuthHeaders({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({
                name,
                fees,
                paid,
                date,
                attendance: 0
            })
        });

        if (!response.ok) throw new Error("Failed to add student");

        // Clear form
        document.getElementById("name").value = "";
        document.getElementById("fees").value = "";
        document.getElementById("paid").value = "";
        document.getElementById("paymentDate").value = "";

        // Reload students
        await loadStudentsFromAPI();
    } catch (error) {
        console.error("Error adding student:", error);
        // Optionally show a user-friendly message here
    }
}

function loadStudents(list = students) {
    let container = document.getElementById("students");
    container.innerHTML = "";

    let totalStudents = 0;
    let totalIncome = 0;
    let totalPending = 0;

    list.forEach(s => {
        totalStudents++;
        totalIncome += s.paid;
        totalPending += (s.fees - s.paid);

        let div = document.createElement("div");
        div.className = "glass student-card";

        // Use MongoDB _id instead of id
        const studentId = s._id || s.id;

        div.innerHTML = `
            <h3>${s.name}</h3>
            <p>Date: ${new Date(s.date).toLocaleDateString()}</p>
            <p>Fees: ₹ ${s.fees}</p>
            <p>Paid: ₹ ${s.paid}</p>
            <p>Pending: ₹ ${s.fees - s.paid}</p>
            <button onclick="editStudent('${studentId}')">Edit</button>
            <button onclick="deleteStudent('${studentId}')">Delete</button>
        `;

        container.appendChild(div);
    });

    animateCounter("totalStudents", totalStudents);
    animateCounter("totalIncome", totalIncome);
    animateCounter("totalPending", totalPending);

    generateMonthSummary();
    generateChart();
}

async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/students/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error("Failed to delete student");

        await loadStudentsFromAPI();
    } catch (error) {
        console.error("Error deleting student:", error);
        // Optionally show a user-friendly message here
    }
}

async function editStudent(id) {
    let s = students.find(x => (x._id || x.id) === id);
    if (!s) return;

    let newPaid = prompt("Enter new paid amount:", s.paid);
    if (newPaid !== null && newPaid !== "") {
        try {
            const response = await fetch(`${API_BASE_URL}/students/${id}`, {
                method: "PUT",
                headers: getAuthHeaders({
                    "Content-Type": "application/json"
                }),
                body: JSON.stringify({
                    ...s,
                    paid: parseInt(newPaid)
                })
            });

            if (!response.ok) throw new Error("Failed to update student");

            await loadStudentsFromAPI();
        } catch (error) {
            console.error("Error updating student:", error);
            // Optionally show a user-friendly message here
        }
    }
}

function searchStudent() {
    let keyword = document.getElementById("searchInput").value.toLowerCase();
    let filtered = students.filter(s => s.name.toLowerCase().includes(keyword));
    loadStudents(filtered);
}

function filterMonth() {
    let month = new Date().getMonth();
    let filtered = students.filter(s => new Date(s.date).getMonth() === month);
    loadStudents(filtered);
}

function showAll() {
    loadStudents(students);
}

function generateMonthSummary() {
    let summary = {};
    students.forEach(s => {
        let key = new Date(s.date).toLocaleString("default", { month: "long", year: "numeric" });
        summary[key] = (summary[key] || 0) + s.paid;
    });

    let container = document.getElementById("monthSummary");
    container.innerHTML = "";

    for (let m in summary) {
        container.innerHTML += `<p>${m}: ₹ ${summary[m]}</p>`;
    }
}

function generateChart() {
    let monthlyIncome = {};
    students.forEach(s => {
        let key = new Date(s.date).toLocaleString("default", { month: "short" });
        monthlyIncome[key] = (monthlyIncome[key] || 0) + s.paid;
    });

    let ctx = document.getElementById("incomeChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(monthlyIncome),
            datasets: [{
                label: "Monthly Income",
                data: Object.values(monthlyIncome)
            }]
        }
    });
}

function animateCounter(id, target) {
    let element = document.getElementById(id);
    let count = 0;
    let interval = setInterval(() => {
        count += Math.ceil(target / 30);
        if (count >= target) {
            count = target;
            clearInterval(interval);
        }
        element.innerText = count;
    }, 20);
}

function exportCSV() {
    let csv = "Name,Fees,Paid,Pending,Date\n";
    students.forEach(s => {
        csv += `${s.name},${s.fees},${s.paid},${s.fees - s.paid},${s.date}\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "TutorTrack_Data.csv";
    a.click();
}

function toggleMode() {
    document.body.classList.toggle("light-mode");
}
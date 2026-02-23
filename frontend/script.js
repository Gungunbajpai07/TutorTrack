// API Configuration - Auto-detect based on current location
const API_BASE_URL = window.location.origin;

//LOGIN
function login() {
    let user = username.value;
    let pass = password.value;

    if (user && pass) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUser", user);
        window.location.href = "index.html";
    }
}

function checkLogin() {
    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// DATA - Now using MongoDB via API
let students = [];

// Load students from API
async function loadStudentsFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/students`);
        if (!response.ok) throw new Error("Failed to fetch students");
        students = await response.json();
        loadStudents();
    } catch (error) {
        console.error("Error loading students:", error);
        alert("Failed to load students. Make sure the backend server is running.");
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
            headers: {
                "Content-Type": "application/json"
            },
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
        alert("Failed to add student. Make sure the backend server is running.");
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
            <p>Attendance: ${s.attendance || 0}</p>
            <button onclick="markAttendance('${studentId}')">Present</button>
            <button onclick="editStudent('${studentId}')">Edit</button>
            <button onclick="deleteStudent('${studentId}')">Delete</button>
            <button onclick="sendReminder('${s.name}')">Reminder</button>
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
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Failed to delete student");

        await loadStudentsFromAPI();
    } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student. Make sure the backend server is running.");
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
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...s,
                    paid: parseInt(newPaid)
                })
            });

            if (!response.ok) throw new Error("Failed to update student");

            await loadStudentsFromAPI();
        } catch (error) {
            console.error("Error updating student:", error);
            alert("Failed to update student. Make sure the backend server is running.");
        }
    }
}

async function markAttendance(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/students/${id}/attendance`, {
            method: "PUT"
        });

        if (!response.ok) throw new Error("Failed to update attendance");

        await loadStudentsFromAPI();
    } catch (error) {
        console.error("Error updating attendance:", error);
        alert("Failed to update attendance. Make sure the backend server is running.");
    }
}

function sendReminder(name) {
    alert("Reminder sent to " + name);
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
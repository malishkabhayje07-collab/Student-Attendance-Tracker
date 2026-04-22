let students = JSON.parse(localStorage.getItem("students")) || [];

function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
}

function showPopup() {
    let popup = document.getElementById("popup");
    popup.style.opacity = "1";

    setTimeout(() => {
        popup.style.opacity = "0";
    }, 2000);
}

function addStudent() {
    let name = document.getElementById("studentName").value;
    if (name === "") return;

    students.push({
        name: name,
        attendance: {}
    });

    saveData();
    renderStudents();

    document.getElementById("studentName").value = "";
}

function markAttendance(index, status) {
    let date = document.getElementById("date").value;

    if (!date) {
        alert("Select date first!");
        return;
    }

    students[index].attendance[date] = status;

    showPopup();

    saveData();
    renderStudents();
}

function calculatePercentage(student) {
    let total = Object.keys(student.attendance).length;
    let present = Object.values(student.attendance).filter(v => v === "P").length;

    return total === 0 ? 0 : Math.round((present / total) * 100);
}

function calculateOverall() {
    let total = 0;
    let present = 0;

    students.forEach(s => {
        total += Object.keys(s.attendance).length;
        present += Object.values(s.attendance).filter(v => v === "P").length;
    });

    let percent = total === 0 ? 0 : Math.round((present / total) * 100);
    document.getElementById("overall").textContent = "Overall Attendance: " + percent + "%";
}

function showHistory(attendance) {
    let text = "Attendance History:\n";
    for (let date in attendance) {
        text += date + " : " + attendance[date] + "\n";
    }
    alert(text);
}

function showCalendar() {
    let date = document.getElementById("date").value;
    if (!date) {
        alert("Select date first!");
        return;
    }

    let text = "Attendance on " + date + ":\n";

    students.forEach(s => {
        let status = s.attendance[date] || "Not Marked";
        text += s.name + " : " + status + "\n";
    });

    alert(text);
}

function deleteStudent(index) {
    students.splice(index, 1);
    saveData();
    renderStudents();
}

function editStudent(index) {
    let newName = prompt("Enter new name:");
    if (newName) {
        students[index].name = newName;
        saveData();
        renderStudents();
    }
}

function searchStudent() {
    let value = document.getElementById("search").value.toLowerCase();
    let items = document.querySelectorAll("#studentList li");

    items.forEach(li => {
        let name = li.textContent.toLowerCase();
        li.style.display = name.includes(value) ? "block" : "none";
    });
}

function renderChart() {
    let names = students.map(s => s.name);
    let data = students.map(s => calculatePercentage(s));

    let ctx = document.getElementById("chart");

    if (window.chart) {
        window.chart.destroy();
    }

    window.chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: names,
            datasets: [{
                label: "Attendance %",
                data: data
            }]
        }
    });
}

function renderStudents() {
    let list = document.getElementById("studentList");
    list.innerHTML = "";

    students.forEach((student, index) => {
        let li = document.createElement("li");

        li.innerHTML = `
            <b>${student.name}</b><br>
            Attendance: ${calculatePercentage(student)}% <br>

            <button onclick="markAttendance(${index}, 'P')">Present</button>
            <button onclick="markAttendance(${index}, 'A')">Absent</button>

            <button onclick="editStudent(${index})">Edit</button>
            <button onclick="deleteStudent(${index})">Delete</button>

            <button onclick='showHistory(${JSON.stringify(student.attendance)})'>View</button>
        `;

        list.appendChild(li);
    });

    calculateOverall();
    renderChart();
}

window.onload = renderStudents;

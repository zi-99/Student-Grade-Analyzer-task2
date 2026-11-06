const students = [];

const studentForm = document.getElementById("studentForm");
const studentIdInput = document.getElementById("studentId");
const averageInput = document.getElementById("average");
const studentsTable = document.getElementById("studentsTable");
const strugglingTable = document.getElementById("strugglingTable");
const studentsEmpty = document.getElementById("studentsEmpty");
const strugglingEmpty = document.getElementById("strugglingEmpty");
const studentCount = document.getElementById("studentCount");
const strugglingCount = document.getElementById("strugglingCount");
const message = document.getElementById("message");

function showMessage(text, type) {
    message.replaceChildren();

    const alert = document.createElement("div");
    alert.className = `alert alert-${type} mb-0`;
    alert.setAttribute("role", type === "danger" ? "alert" : "status");
    alert.textContent = text;
    message.appendChild(alert);
}

function formatNumber(value) {
    return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, "");
}

function createCell(text, className = "") {
    const cell = document.createElement("td");
    cell.textContent = text;

    if (className) {
        cell.className = className;
    }

    return cell;
}

function displayStudents() {
    studentsTable.replaceChildren();

    students.forEach(student => {
        const row = document.createElement("tr");
        row.append(
            createCell(String(student.id)),
            createCell(formatNumber(student.average))
        );
        studentsTable.appendChild(row);
    });

    studentsEmpty.classList.toggle("d-none", students.length > 0);
    studentCount.textContent = `${students.length} ${students.length === 1 ? "student" : "students"}`;
}

function getStrugglingStudents() {
    return students.filter(student => student.average >= 40 && student.average < 50);
}

function displayStrugglingStudents() {
    const strugglingStudents = getStrugglingStudents();
    strugglingTable.replaceChildren();

    strugglingStudents.forEach(student => {
        const mercyPoints = Math.min(5, 50 - student.average);
        const newAverage = student.average + mercyPoints;
        const row = document.createElement("tr");

        row.append(
            createCell(String(student.id)),
            createCell(formatNumber(student.average)),
            createCell(`+${formatNumber(mercyPoints)}`),
            createCell(formatNumber(newAverage), "fw-bold text-success")
        );
        strugglingTable.appendChild(row);
    });

    strugglingEmpty.classList.toggle("d-none", strugglingStudents.length > 0);
    strugglingCount.textContent =
        `${strugglingStudents.length} ${strugglingStudents.length === 1 ? "student" : "students"}`;
}

studentForm.addEventListener("submit", event => {
    event.preventDefault();
    message.replaceChildren();

    const rawId = studentIdInput.value.trim();
    const rawAverage = averageInput.value.trim();
    const id = Number(rawId);
    const average = Number(rawAverage);

    if (rawId === "" || !Number.isInteger(id) || id <= 0) {
        showMessage("Please enter a valid student ID greater than zero.", "danger");
        studentIdInput.focus();
        return;
    }

    if (rawAverage === "" || !Number.isFinite(average) || average < 0 || average > 100) {
        showMessage("Please enter a valid average between 0 and 100.", "danger");
        averageInput.focus();
        return;
    }

    if (students.some(student => student.id === id)) {
        showMessage("This student ID already exists. Please enter a different ID.", "danger");
        studentIdInput.focus();
        return;
    }

    students.push({ id, average });
    displayStudents();
    displayStrugglingStudents();
    showMessage("Student added successfully.", "success");
    studentForm.reset();
    studentIdInput.focus();
});

displayStudents();
displayStrugglingStudents();

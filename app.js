const workouts = [
    { day: "Monday", description: "VR Shadow Boxing (Cardio Focus)", completed: false },
    { day: "Tuesday", description: "VR Shadow Boxing (Cardio Focus)", completed: false },
    { day: "Wednesday", description: "Boxing Lesson (1 hour)", completed: false },
    { day: "Thursday", description: "Leg Day (Strength Focus)", completed: false },
    { day: "Friday", description: "Upper Body (Push-ups and Pull-ups)", completed: false },
    { day: "Saturday", description: "Custom Workout (Choose Your Focus)", completed: false },
    { day: "Sunday", description: "Active Rest / Recovery", completed: false },
];

const workoutList = document.getElementById("workout-list");
const progressBody = document.getElementById("progress-body");

// Load workouts from localStorage
const savedWorkouts = JSON.parse(localStorage.getItem("workouts"));
if (savedWorkouts) {
    savedWorkouts.forEach((workout, index) => workouts[index].completed = workout.completed);
}

// Render workouts
function renderWorkouts() {
    workoutList.innerHTML = "";
    workouts.forEach((workout, index) => {
        const workoutItem = document.createElement("div");
        workoutItem.className = "workout-item";
        if (workout.completed) workoutItem.classList.add("completed");

        workoutItem.innerHTML = `
            <span>${workout.day}: ${workout.description}</span>
            <button onclick="toggleComplete(${index})">${workout.completed ? "Undo" : "Complete"}</button>
        `;

        workoutList.appendChild(workoutItem);
    });
    renderProgressTable();
}

// Toggle workout completion
function toggleComplete(index) {
    workouts[index].completed = !workouts[index].completed;
    localStorage.setItem("workouts", JSON.stringify(workouts));
    renderWorkouts();
}

// Render progress table
function renderProgressTable() {
    const rows = progressBody.querySelectorAll('tr');
    if (rows.length === 0) {
        addCurrentWeekRow();
    }
    updateLastRowWithProgress();
}

// Add the current week's row
function addCurrentWeekRow() {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
    const formattedDate = `${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1}/${startOfWeek.getFullYear().toString().slice(-2)}`;

    const newRow = document.createElement("tr");
    newRow.innerHTML = `<td>${formattedDate}</td>`;

    workouts.forEach(() => {
        const cell = document.createElement("td");
        newRow.appendChild(cell);
    });

    progressBody.appendChild(newRow);
}

// Update the last row in the table with the current progress
function updateLastRowWithProgress() {
    const lastRow = progressBody.lastElementChild;
    if (!lastRow) return;

    const cells = lastRow.querySelectorAll('td');
    workouts.forEach((workout, index) => {
        if (workout.completed) {
            cells[index + 1].className = "completed-cell";
            cells[index + 1].innerHTML = "&#10003;";
        }
    });
}

// Add next week's progress row and reset current week's progress
document.getElementById("next-week-btn").addEventListener("click", () => {
    const lastRow = progressBody.lastElementChild;
    let nextStartOfWeek;

    if (lastRow) {
        const lastDateText = lastRow.firstChild.textContent;
        const [day, month, year] = lastDateText.split("/").map(Number);
        const lastDate = new Date(`20${year}`, month - 1, day);
        nextStartOfWeek = new Date(lastDate.setDate(lastDate.getDate() + 7));
    } else {
        nextStartOfWeek = new Date();
    }

    const formattedNextDate = `${nextStartOfWeek.getDate()}/${nextStartOfWeek.getMonth() + 1}/${nextStartOfWeek.getFullYear().toString().slice(-2)}`;

    const newRow = document.createElement("tr");
    newRow.innerHTML = `<td>${formattedNextDate}</td>`;

    workouts.forEach(() => {
        const cell = document.createElement("td");
        newRow.appendChild(cell);
    });

    progressBody.appendChild(newRow);

    // Reset current progress
    workouts.forEach(workout => workout.completed = false);
    localStorage.setItem("workouts", JSON.stringify(workouts));
    renderWorkouts();
});

renderWorkouts();

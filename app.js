// Define workouts
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
let progressData = JSON.parse(localStorage.getItem("progressData")) || [];

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
    progressBody.innerHTML = "";
    progressData.forEach((week) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${week.date}</td>`;

        week.days.forEach((dayCompleted, dayIndex) => {
            const cell = document.createElement("td");
            cell.className = dayCompleted ? "completed-cell" : "incomplete-cell";
            cell.innerHTML = dayCompleted ? "&#10003;" : "";
            cell.addEventListener("click", () => toggleCellCompletion(cell, week.date, dayIndex));
            row.appendChild(cell);
        });

        progressBody.appendChild(row);
    });
}

// Add a new week's row
function addCurrentWeekRow() {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
    const formattedDate = `${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1}/${startOfWeek.getFullYear().toString().slice(-2)}`;

    if (!progressData.some(week => week.date === formattedDate)) {
        progressData.push({ date: formattedDate, days: Array(7).fill(false) });
        saveProgressData();
        renderProgressTable();
    }
}

// Toggle cell completion and update progress data
function toggleCellCompletion(cell, weekDate, dayIndex) {
    const week = progressData.find(week => week.date === weekDate);
    if (week) {
        week.days[dayIndex] = !week.days[dayIndex];
        cell.className = week.days[dayIndex] ? "completed-cell" : "incomplete-cell";
        cell.innerHTML = week.days[dayIndex] ? "&#10003;" : "";
        saveProgressData();
    }
}

// Save progress data to localStorage
function saveProgressData() {
    localStorage.setItem("progressData", JSON.stringify(progressData));
}

// Add next week's progress row and reset current progress
document.getElementById("next-week-btn").addEventListener("click", () => {
    addCurrentWeekRow();
    workouts.forEach(workout => workout.completed = false);
    localStorage.setItem("workouts", JSON.stringify(workouts));
    renderWorkouts();
});

// Initial rendering
addCurrentWeekRow();
renderWorkouts();

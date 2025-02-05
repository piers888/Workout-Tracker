const workouts = [
    { day: "Day 1", description: "Boxing Lesson (1 hour)", completed: false },
    { day: "Day 2", description: "Upper Body & Core (Strength Focus)", completed: false },
    { day: "Day 3", description: "VR Shadow Boxing & HIIT (Cardio Focus)", completed: false },
    { day: "Day 4", description: "Lower Body & Core (Strength Focus)", completed: false },
    { day: "Day 5", description: "Full-Body Circuit (Functional & Strength)", completed: false },
    { day: "Day 6", description: "VR Shadow Boxing (Cardio Focus)", completed: false },
    { day: "Day 7", description: "Active Rest / Recovery", completed: false },
];

const workoutList = document.getElementById("workout-list");

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
}

// Toggle workout completion
function toggleComplete(index) {
    workouts[index].completed = !workouts[index].completed;
    localStorage.setItem("workouts", JSON.stringify(workouts));
    renderWorkouts();
}

// Reset progress
document.getElementById("reset-btn").addEventListener("click", () => {
    workouts.forEach(workout => workout.completed = false);
    localStorage.removeItem("workouts");
    renderWorkouts();
});

renderWorkouts();

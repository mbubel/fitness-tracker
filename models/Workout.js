const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  name: String,
  duration: Number,
  weight: Number,
  reps: Number,
  sets: Number,
  type: String
});

const WorkoutSchema = new Schema({
  day: Date,
  exercises: [ExerciseSchema],
});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;

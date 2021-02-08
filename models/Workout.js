const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  name: String,
  duration: Number,
  weight: Number,
  reps: Number,
  sets: Number,
  type: String,
  _id: false,
});

const WorkoutSchema = new Schema({
  day: Date,
  exercises: [ExerciseSchema],
},
{
  versionKey: false
});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;

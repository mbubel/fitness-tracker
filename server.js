const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 8080;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workouts", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "exercise.html"));
});
app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "stats.html"));
});

app.get("/api/workouts/range", (req, res) => {
  db.Workout.aggregate([
    { $sort: { day: -1 } },
    { $limit: 7 },
    { $addFields: { totalDuration: { $sum: "$exercises.duration" } } },
  ])
    .then((dbWorkouts) => {
      res.json(dbWorkouts);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.put("/api/workouts/:id", ({ body, params: { id } }, res) => {
  db.Workout.findByIdAndUpdate(id, { $push: { exercises: body } })
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

app
  .route("/api/workouts")
  .get((req, res) => {
    db.Workout.aggregate([
      { $addFields: { totalDuration: { $sum: "$exercises.duration" } } },
    ])
      .then((dbWorkouts) => {
        res.json(dbWorkouts);
      })
      .catch((err) => {
        res.json(err);
      });
  })
  .post((req, res) => {
    db.Workout.create({day: new Date()})
      .then((dbWorkout) => {
        res.json(dbWorkout);
        console.log(dbWorkout);
      })
      .catch((err) => {
        res.json(err);
      });
  });

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

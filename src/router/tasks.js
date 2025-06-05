const { authenticate } = require("../middlewares/authentication");
const { addTask,
    getTask,
    getAllTask,
    getTaskByDate,
    getCount,
    deleteTask,
    update} = require('../controller/tasks');
const express = require("express");


const taskRouter = express.Router();



taskRouter.use(authenticate);


taskRouter.post("/add", addTask);
taskRouter.post("/filteredSearch", getTaskByDate);
taskRouter.get("/:taskId", getTask);
taskRouter.get("/all", getAllTask);
taskRouter.get("/count", getCount)
taskRouter.delete("/:taskId", deleteTask);
taskRouter.patch("/:taskId", update);


module.exports = {taskRouter};
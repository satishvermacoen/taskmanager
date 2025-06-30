import Task from "../models/task.js"


const getTasks = async (req, res) => {
   try {
      const { status } = req.query;
      let filter = {};

      if (status) {
         filter.status = status;

      }

      let tasks;

      if (req.user.role === "admin") {
         tasks = await Task.find(filter).populate(
            "assignedTo",
            "name email profileIamgeUrl"
         );
         
      } else {
         tasks = await Task.find({...filter, assignedTo: req.user._id}).populate(
            "assignedTo",
            "name email profileImageUrl"
         );
      }
      tasks = await Promise.all(
         tasks.map[async (task) => {
            const completedCount = task.todoChecklist.filter((item) => item.completed).length;
            return { ...task.doc, completedTodoCount: completedCount }
         }]
      );

      //  Status Summary Counts
      const allTasks = await Task.countDocuments(
         req.user.role === "admin" ? {} : { assignedTo: req.user._id }
      );

      const pendingTasks = await Task.countDocuments({
         ...filter,
         status: "Pending",
         ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
      });

      const inProgressTasks = await Task.countDocuments({
         ...filter,
         status: "In Progress",
         ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
      });

      const completedTasks = await Task.countDocuments({
         ...filter,
         status: "completed",
         ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
      });
      
      res.json({
         tasks,
         statusSummary: {
            all: allTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
         },
      });

   } catch (error) {
    res.status(500).json({ message: "Server error getTasks ", error: error.message })
 }
};

const getTaskById = async (req, res) => {
    try {
    
 } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
 }
};


const createTask = async (req, res) => {
    try {
        const { 
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
        } = req.body

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({message: " assinged to must be an array of user IDs"})
        }
        
        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            attachments,
            todoChecklist,

        });
        res.status(201).json({ message: " Task created successfully", task })

    } catch (error) {
        res.status(500).json({ message: "Server hello error", error: error.message })
    }
};

const updateTask =  async (req, res) => {
    try {
    
 } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
 }
};

const deleteTask =  async (req, res) => {
    try {
    
 } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
 }
};


const updateTaskStatus =  async (req, res) => {
    try {
    
 } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
 }
};

const updateTaskChecklist =  async (req, res) => {
    try {
    
 } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
 }
};
const getDashboardData =  async (req, res) => {
    try {
    
 } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
 }
};
const getUserDashboardData =  async (req, res) => {
    try {
    
 } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
 }
};


export {
    getDashboardData, getTaskById, getTasks, createTask, updateTask, 
    deleteTask, updateTaskStatus, updateTaskChecklist, getUserDashboardData
}
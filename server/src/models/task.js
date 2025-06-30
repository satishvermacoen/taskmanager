import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
    {
        text: { type: String, required: true, },
        completed: { type: Boolean, default: false, },
    }
);

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, }, 
        description: { type: String, required: true, },
        priority: { type: String, enum: ["low", "medium", "high"], default: "medium", required: true, },
        status: { type: String, enum:["pending", "In Progress", "completed"], default: "pending" },
        dueDate: { type: Date, required: true },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
        attachements: [{ type: String, }],
        todoChecklist: [todoSchema], 
        progress: { type: Number, default: 0, },   
    },
    { timestamps: true }
);
    
export default mongoose.model("Task", taskSchema);
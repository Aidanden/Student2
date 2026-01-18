import express from "express";
import cors from "cors";
import { config } from "./config/app.config";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import departmentRoutes from "./routes/departmentRoute";
import studentRoutes from "./routes/studentRoute";
import courseRoutes from "./routes/courseRoute";
import enrollmentRoutes from "./routes/enrollmentRoute";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Routes
app.use("/departments", departmentRoutes);
app.use("/students", studentRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);
// Root route
app.get("/", (req, res) => {
    res.send("Welcome to Student Management API");
});

const PORT = config.port;

app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`${config.appName} is running on port ${PORT}`)

});

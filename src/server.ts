import express from "express";
import insuranceApplicationRoutes from "./routes/insuranceApplication";

const app = express();
const port = 5150;

app.use(express.json());
app.use("/api/insurance-applications", insuranceApplicationRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

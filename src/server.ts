import express from "express";
import insuranceApplicationCompleteRoute from "./routes/insuranceApplicationComplete";
import insuranceApplicationInitializeRoute from "./routes/insuranceApplicationInitialize";

const app = express();
const port = 5150;

app.use(express.json());

app.use(
  "/api/insurance-application-complete",
  insuranceApplicationCompleteRoute
);

app.use(
  "/api/insurance-application-initialize",
  insuranceApplicationInitializeRoute
);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

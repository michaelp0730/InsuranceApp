import express from "express";
import insuranceApplicationGetRoutes from "./routes/insuranceApplicationGetRoutes";
import insuranceApplicationPostCompleteRoute from "./routes/insuranceApplicationPostComplete";
import insuranceApplicationPostInitializeRoute from "./routes/insuranceApplicationPostInitialize";

const app = express();
const port = 5150;

app.use(express.json());

app.use("/api/get-application", insuranceApplicationGetRoutes);

app.use(
  "/api/post-complete-application",
  insuranceApplicationPostCompleteRoute
);

app.use(
  "/api/post-initialize-application",
  insuranceApplicationPostInitializeRoute
);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

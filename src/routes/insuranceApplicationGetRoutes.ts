import express, { Request, Response } from "express";
import pool from "../pool";

const router = express.Router();

router.get(
  "/:applicationId",
  async (req: Request, res: Response): Promise<void> => {
    const { applicationId } = req.params;
    const connection = await pool.getConnection();

    try {
      const applicationSql = `
      SELECT * FROM applications WHERE applicationId = ?
    `;
      const [applications] = await connection.execute(applicationSql, [
        applicationId,
      ]);

      if ((applications as any[]).length === 0) {
        res.status(404).json({ error: "Application not found" });
        return;
      }

      const application = (applications as any[])[0];

      const peopleSql = `
      SELECT * FROM people WHERE applicationId = ?
    `;
      const [people] = await connection.execute(peopleSql, [applicationId]);

      const result = {
        ...application,
        people: people as any[],
      };

      res.status(200).json(result);
    } catch (error) {
      console.error(`Error fetching insurance application: ${error}`);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      connection.release();
    }
  }
);

export default router;

import functions from "@google-cloud/functions-framework";
import getAllowanceCount from "./notion.js";
import createAllowanceCard from "./trello.js";

const { BRAYS_DB, ARYA_DB } = process.env;

functions.http("calculateAllowance", async (req, res) => {
  const databases = [
    { name: "Brayden", id: BRAYS_DB },
    { name: "Arya", id: ARYA_DB },
  ];

  const totals = await Promise.all(
    databases.map(async (database) => {
      const allowanceCount = await getAllowanceCount(database);
      return allowanceCount;
    }),
  );

  createAllowanceCard(totals);

  res.status(200).send(totals);
});

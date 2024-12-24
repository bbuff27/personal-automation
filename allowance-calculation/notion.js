import { Client } from "@notionhq/client";
import { notionFilter } from "./notionFilter.js";

const { NOTION_API_KEY, CHECKBOX_WORTH } = process.env;

const notion = new Client({ auth: NOTION_API_KEY });

export async function getAllowanceCount(database) {
  const { results } = await notion.databases.query({
    database_id: database.id,
    filter: notionFilter,
  });

  const calculatedTotal = results.reduce((acc, curr) => {
    const properties = Object.values(curr.properties);
    properties.map((property) => {
      if (property.checkbox) {
        acc += +CHECKBOX_WORTH;
      }
    });
    return acc;
  }, 0);

  console.log({
    name: database.name,
    calculatedTotal,
  });

  return {
    name: database.name,
    calculatedTotal,
  };
}

export function clearDatabaseChecks(database) {
  const options = {
    method: "PATCH",
    headers: {
      accept: "application/json",
      "Notion-Version": "2022-06-28",
      "content-type": "application/json",
    },
  };

  fetch(`https://api.notion.com/v1/databases/${database.id}`, options)
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
}

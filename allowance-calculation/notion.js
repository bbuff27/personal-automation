import { Client } from "@notionhq/client";
import { checkboxTrueFilter, checkboxFalseFilter } from "./notionFilter.js";

const { NOTION_API_KEY, CHECKBOX_WORTH } = process.env;

const notion = new Client({ auth: NOTION_API_KEY });

export async function getAllowanceCount(database) {
  const { results } = await notion.databases.query({
    database_id: database.id,
    filter: checkboxTrueFilter,
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

  clearDatabaseChecks(results);

  return {
    name: database.name,
    calculatedTotal,
  };
}

function clearDatabaseChecks(pages) {
  pages.map((page) => {
    notion.pages.update({
      page_id: page.id,
      properties: checkboxFalseFilter,
    });
  });
}

export default getAllowanceCount;

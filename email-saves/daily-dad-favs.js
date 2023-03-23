const ProtonMail = require('protonmail-api');
const { Client } = require('@notionhq/client');
require('dotenv').config();

(async () => {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  try {
    const protonmail = await ProtonMail.connect({
      username: process.env.PROTON_USERNAME,
      password: process.env.PROTON_PASSWORD,
      puppeteerOpts: {
        headless: false
      }
    })

    const emails = await protonmail.getEmails({ label: process.env.LABEL_NAME })
    for (const email of emails) {
      const properties = {
        'Subject': {
          title: [
            {
              text: {
                content: email.subject
              }
            }
          ]
        },
        'Date': {
          date: {
            start: email.time
          }
        },
        'Body': {
          rich_text: [
            {
              text: {
                content: email.getBody()
              }
            }
          ]
        }
      };
    }

    console.log({ email, properties });

    // Push the email to your Notion database
    // notion.pages.create({
    //   parent: {
    //     database_id: process.env.NOTION_DATABASE_ID,
    //   },
    //   properties,
    // });

    // Mark the email as read and move it to the Trash folder in ProtonMail
    // email.delete();
    protonmail.close();
  } catch (error) {
    console.error(error)
  }
})()
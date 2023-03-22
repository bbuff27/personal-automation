const ProtonMailClient = require('protonmail-api');
const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Initialize ProtonMail client
const protonmail = new ProtonMailClient({
  username: process.env.PROTON_USERNAME,
  password: process.env.PROTON_PASSWORD,
  baseUrl: 'https://mail.protonmail.com'
});

// Get the database ID of your Notion database
const databaseId = process.env.NOTION_DATABASE_ID;


// Get a list of new messages with a specific label from ProtonMail
protonmail
  .login()
  .then(() => {
    return protonmail.getMessages({
      label: process.env.LABEL_NAME
    });
  })
  .then(messages => {
    // Iterate over each message and push it to Notion
    messages.forEach(message => {
      const properties = {
        // Add your own properties and formatting here
        'Subject': {
          title: [
            {
              text: {
                content: message.Subject
              }
            }
          ]
        },
        'Date': {
          date: {
            start: message.Time * 1000 // Convert Unix timestamp to milliseconds
          }
        },
        'Body': {
          rich_text: [
            {
              text: {
                content: message.Body
              }
            }
          ]
        }
      };

      // Push the message to your Notion database
      notion.pages.create({
        parent: {
          database_id: databaseId
        },
        properties: properties
      });

      // Mark the message as read and move it to the Trash folder in ProtonMail
      // protonmail.updateMessage({
      //   id: message.ID,
      //   unread: 0,
      //   labelIDsAdded: [protonmail.labelIDs.TRASH],
      //   labelIDsRemoved: [protonmail.labelIDs.INBOX, protonmail.labelIDs.IMPORTANT]
      // });
    });
  })
  .catch(error => {
    console.error(error);
  });


const ProtonMailClient = require('protonmail-api');
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: 'YOUR_NOTION_API_KEY' });

// Initialize ProtonMail client
const protonmail = new ProtonMailClient({
  username: 'YOUR_PROTONMAIL_USERNAME',
  password: 'YOUR_PROTONMAIL_PASSWORD',
  baseUrl: 'https://mail.protonmail.com'
});

// Get the database ID of your Notion database
const databaseId = 'YOUR_DATABASE_ID';

// Get a list of new messages with a specific label from ProtonMail
protonmail
  .login()
  .then(() => {
    return protonmail.getMessages({
      label: 'YOUR_LABEL_NAME'
    });
  })
  .then(messages => {
    // Iterate over each message and push it to Notion
    messages.forEach(message => {
      const properties = {
        // Add your own properties and formatting here
        'Name': {
          title: [
            {
              text: {
                content: message.Subject
              }
            }
          ]
        },
        'From': {
          rich_text: [
            {
              text: {
                content: message.From[0].Name
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
      protonmail.updateMessage({
        id: message.ID,
        unread: 0,
        labelIDsAdded: [protonmail.labelIDs.TRASH],
        labelIDsRemoved: [protonmail.labelIDs.INBOX, protonmail.labelIDs.IMPORTANT]
      });
    });
  })
  .catch(error => {
    console.error(error);
  });


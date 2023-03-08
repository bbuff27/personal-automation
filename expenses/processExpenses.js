const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
require('dotenv').config();

const directoryPath = process.env.DOWNLOADS_PATH;

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  const expenseFiles = files.filter(file => file.includes('_Expenses') && path.extname(file) === '.csv')

  expenseFiles.forEach(file => {
    const filePath = path.join(directoryPath, file);
    const results = [];
    const headers = ['description', 'amount', 'category'];

    fs.createReadStream(filePath)
      .pipe(csv({ headers }))
      .on('data', ({description, amount, category}) => {
        const expense = {
          description,
          amount,
          category,
        }
        results.push(expense)
      })
      .on('end', () => {
        console.log(results);
        console.log(`Finished parsing ${file}`);
      });
  });
});

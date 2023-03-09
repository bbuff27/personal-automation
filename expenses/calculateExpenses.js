import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import * as dotenv from 'dotenv';
import readline from 'readline';
import { categories } from './expenseCategories.js';

dotenv.config();

const directoryPath = process.env.DOWNLOADS_PATH;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  const calculatedExpenses = files.filter(file => file.includes('_Expenses') && path.extname(file) === '.csv')
    .reduce((acc, file) => {
      const filePath = path.join(directoryPath, file);
      const headers = ['description', 'amount', 'category'];
      const csvStream = fs.createReadStream(filePath).pipe(csv({ headers }));

      csvStream
        .on('data', ({ description, amount, category }) => {
          if(description !== 'Description') {
            csvStream.pause();
            rl.question(`Choose an expense category for ${description} for ${amount} currently under ${category} category: `, (answer) => {
              const [parentCategory, subCategory] = answer.split('.');
              const selectedItem = categories[parentCategory][subCategory];
              console.log('You selected:', selectedItem);
              rl.close();
              csvStream.resume();
            });
          }
        });
    }, categories)
  // console.log(expenseFiles)
});

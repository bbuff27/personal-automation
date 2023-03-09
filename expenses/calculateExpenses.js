import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import * as dotenv from 'dotenv';
import readline from 'readline';
import { categories } from './expenseCategories.js';

dotenv.config();

const directoryPath = process.env.DOWNLOADS_PATH;

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  const expenseFiles = files
    .filter(file => file.includes('_Expenses') && path.extname(file) === '.csv')
    .reduce((acc, file) => {
      const filePath = path.join(directoryPath, file);
      const headers = ['description', 'amount', 'category'];

      fs.createReadStream(filePath)
        .pipe(csv({ headers }))
        .on('data', ({ description, amount, category }) => {
          const expense = {
            description,
            amount,
            category,
          }
        })
        .on('data', (expense) => {
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });
          let i = 1;
          for (const [key, value] of Object.entries(expense)) {
            console.log(`${i}. ${key}`);
            for (const [childKey, childValue] of Object.entries(value)) {
              console.log(`${i}.${Object.keys(value).indexOf(childKey) + 1}. ${childKey}: ${childValue}`);
            }
            i++;
          }

          rl.question('Enter your selection: ', (answer) => {
            const selection = parseInt(answer, 10);
            const selectedItem = Object.values(expense)[selection - 1];
            console.log('You selected:', selectedItem);
            rl.close();
          });
        });
      }, categories)
  // console.log(expenseFiles)
});

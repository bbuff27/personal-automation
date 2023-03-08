import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import * as dotenv from 'dotenv';
import readline from 'readline';
import { categories } from './expenseCategories';

dotenv.config();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
          categorizeExpense(expense)
        })
        .on('end', () => {
          console.log(`Finished parsing ${file}`);
        });
      }, categories)
  console.log(expenseFiles)
});

function categorizeExpense(expense) {
  console.log(expense)
}

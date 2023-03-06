const sqlite3 = require('sqlite3').verbose();
const { google } = require('googleapis');
const inquirer = require('inquirer');

// Connect to the SQLite database
const db = new sqlite3.Database('expenses.db');

// Connect to the Google Sheets API
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

// Function to retrieve all the expense categories and their group IDs
function getExpenseCategories() {
  return new Promise((resolve, reject) => {
    const query = `SELECT ec.categoryId, ec.groupId, ec.category, eg.group
                   FROM expense_category AS ec
                   JOIN expense_group AS eg ON ec.groupId = eg.groupId`;
    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Function to update the categoryId in the expenses table based on the purchaseCategory
function updateExpenses(purchaseCategory, categoryId) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE expenses
                   SET categoryId = ?
                   WHERE category = ?`;
    db.run(query, [categoryId, purchaseCategory], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Function to insert a new row into the purchase_category table
function insertPurchaseCategory(purchaseCategory, categoryId) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO purchase_category (purchaseCategory, categoryId)
                   VALUES (?, ?)`;
    db.run(query, [purchaseCategory, categoryId], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Function to get the categoryId from the purchase_category table
function getCategoryId(purchaseCategory) {
  return new Promise((resolve, reject) => {
    const query = `SELECT categoryId
                   FROM purchase_category
                   WHERE purchaseCategory = ?`;
    db.get(query, [purchaseCategory], (err, row) => {
      if (err) reject(err);

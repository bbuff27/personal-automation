# Getting Started

This project was bootstrapped with Fastify-CLI.

## Setup

1. Download CSVs from expense merchants to `DOWNLOADS_PATH` env
    - Name files as `<merchant>_Expenses.csv`
1. Remove all columns that aren't the description, amount, or category
    - Be sure the columns are ordered in exact order: `Date, Description, Amount, Category`
1. Export to CSV from Numbers
    - Save under the same name mentioned above
1. In the project directory, run `npm start`

## How to Use

1. Open [http://localhost:3000](http://localhost:3000) to view expenses list in browser
1. Select desired categories for each expense and click Submit
1. Run `cat expenses.json | jq '.'` in the terminal where ran the app
1. Copy results into Google Sheet

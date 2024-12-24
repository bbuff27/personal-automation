const { TRELLO_TOKEN, TRELLO_API_KEY, LIST_ID } = process.env;

function createAllowanceCard(allowanceTotals) {
  const currentDate = new Date().toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });

  const braydenAmount = parseFloat(
    allowanceTotals.find((total) => total.name === "Brayden").calculatedTotal,
  ).toFixed(2);
  const aryaAmount = parseFloat(
    allowanceTotals.find((total) => total.name === "Arya").calculatedTotal,
  ).toFixed(2);

  fetch(
    `https://api.trello.com/1/cards?idList=${LIST_ID}&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Allowance - ${currentDate}`,
        desc: `Brayden - $${braydenAmount}\nArya - $${aryaAmount}`,
        pos: "top",
      }),
    },
  )
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((err) => console.error(err));
}

export default createAllowanceCard;

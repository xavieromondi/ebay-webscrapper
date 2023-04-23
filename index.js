const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.get("/ebay", (req, res) => {
  const searchKeyword = req.query.q;
  const url = `https://www.ebay.com/sch/i.html?_nkw=${searchKeyword}`;

  axios
    .get(url)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const items = [];

      $(".s-item").each((i, element) => {
        const name = $(element).find(".s-item__title").text().trim();
        const imageUrl = $(element).find(".s-item__image-img").attr("src");
        const price = $(element).find(".s-item__price").text().trim();

        items.push({ name, imageUrl, price });
      });

      items.sort(
        (a, b) =>
          parseFloat(a.price.replace("$", "")) -
          parseFloat(b.price.replace("$", ""))
      );

      const lowestPriceItems = items.filter(
        (item) =>
          parseFloat(item.price.replace("$", "")) ===
          parseFloat(items[0].price.replace("$", ""))
      );

      console.log(lowestPriceItems); // log the output to the console

      res.send(lowestPriceItems);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching data");
    });
});

app.listen(8080, () => console.log("Server running on port 3000"));

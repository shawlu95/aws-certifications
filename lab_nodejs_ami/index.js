const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'OK' });
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`listening on ${PORT}`));

const express = require('express');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.get('/', (req, res) => {
  res.status(404).send('<h1>Страница не найдена</h1>');
}); 


app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
}) 
class IncorrectData extends Error {
  constructor(message) {
    const msg = message || 'Переданы некорректные данные';
    super(msg);
    this.statusCode = 400;
  }
}

module.exports = IncorrectData;

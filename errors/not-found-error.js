class NotFoundError extends Error {
  constructor(message) {
    const msg = message || 'Запрашиваемый ресурс не найден';
    super(msg);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;

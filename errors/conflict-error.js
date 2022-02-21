class ConflictError extends Error {
  constructor(message) {
    const msg = message || 'Произошел конфликт данных';
    super(msg);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;

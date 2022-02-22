class ForbiddenError extends Error {
  constructor(message) {
    const msg = message || 'Ошибка доступа';
    super(msg);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;

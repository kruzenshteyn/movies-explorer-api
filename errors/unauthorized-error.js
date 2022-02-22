class UnauthorizedError extends Error {
  constructor(message) {
    const msg = message || 'Нет доступа к запрашиваемому ресурсу';
    super(msg);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;

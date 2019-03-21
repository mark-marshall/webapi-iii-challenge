function formatName(req, res, next) {
  const formatting = req.body.name;
  const finalFormatting = formatting.replace(/\b([a-z])/gi, char => char.toUpperCase());
  req.body.name = finalFormatting;
  next();
}

module.exports = {
  formatName,
};

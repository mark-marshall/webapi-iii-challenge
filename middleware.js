function formatName(req, res, next) {
  // const nameSplit = req.body.name.split(' ');
  // const capitalize = nameSplit.map(
  //   word => word.charAt(0).toUpperCase() + word.slice(1),

  // );
  // const finalFormat = capitalize.join(' ');
  const formatting = req.body.name;
  const finalFormatting = formatting.replace(/\b(\w)/g, char => char.toUpperCase());

  req.body.name = finalFormatting;
  next();
}

module.exports = {
  formatName,
};

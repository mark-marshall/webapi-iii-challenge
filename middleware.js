function formatName(req, res, next) {
    const nameSplit = req.body.name.split(' ');
    const capitalize = nameSplit.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    const finalFormat = capitalize.join(' ');
    req.body.name = finalFormat;
    next();
}

module.exports = {
    formatName,
}
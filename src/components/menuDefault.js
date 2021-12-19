const options = require('./menuOptions');

module.exports = (refresh) => {
  return [
    options().separator,
    options().title,
    options().separator,
    options(refresh).refresh,
    options().about,
    options().quit,
  ];
};

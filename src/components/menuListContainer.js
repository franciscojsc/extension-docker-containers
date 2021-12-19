const options = require('./menuOptions');

module.exports = (refresh, name) => {
  return {
    running: {
      label: `⚫️ ${name}`,
      submenu: [
        options(refresh, name).openShell,
        options(refresh, name).restart,
        options(refresh, name).stop,
        options(refresh, name).logs,
        options(refresh, name).remove,
      ],
    },
    paused: {
      label: `⚪️ ${name}`,
      submenu: [options(refresh, name).unpause, options(refresh, name).remove],
    },
    exited: {
      label: `⚪️ ${name}`,
      submenu: [options(refresh, name).start, options(refresh, name).remove],
    },
  };
};

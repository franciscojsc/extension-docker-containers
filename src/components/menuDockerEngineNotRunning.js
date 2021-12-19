module.exports = () => {
  return [
    {
      label: 'Docker Engine not running',
      submenu: [
        {
          label: 'Install Docker',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal(
              'https://docs.docker.com/engine/install/ubuntu/'
            );
          },
        },
      ],
    },
  ];
};

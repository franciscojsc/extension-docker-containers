const { docker } = require('mydockerjs');
const { exec } = require('child_process');
const { promisify } = require('util');
var growl = require('notify-send');

const dockerStartPromise = promisify(docker.start);
const dockerStartAllPromise = promisify(docker.startAll);
const dockerStopPromise = promisify(docker.stop);
const dockerStopAllPromise = promisify(docker.stopAll);
const dockerRmPromise = promisify((name, cb, force = true) =>
  docker.rm(name, cb, force)
);
const dockerRmAllPromise = promisify(docker.rmAll);

module.exports = (refresh, name) => {
  return {
    start: {
      label: 'Start',
      click() {
        console.log('click Start', name);
        dockerStartPromise(name)
          .then(() => {
            growl.notify('Container started');
            refresh();
          })
          .catch((err) => {
            growl.notify('Error starting container');
          });
      },
    },
    stop: {
      label: 'Stop',
      click() {
        console.log('click Stop');
        dockerStopPromise(name)
          .then(() => {
            growl.notify('Container stopped');
            refresh();
          })
          .catch((err) => {
            growl.notify('Error stopping container');
          });
      },
    },
    restart: {
      label: 'Restart',
      click() {
        console.log('click Restart');
        dockerStopPromise(name)
          .then(() => {
            dockerStartPromise(name)
              .then(() => {
                growl.notify('Container restarted');
                refresh();
              })
              .catch((err) => {
                growl.notify('Error restarting container');
              });
          })
          .catch((err) => {
            growl.notify('Error restarting container');
          });
      },
    },
    remove: {
      label: 'Remove',
      click() {
        console.log('click Remove');
        dockerRmPromise(name)
          .then(() => {
            growl.notify('Container removed');
            refresh();
          })
          .catch((err) => {
            growl.notify('Error removing container');
          });
      },
    },
    openShell: {
      label: 'Open Shell',
      submenu: [
        {
          label: 'ash',
          click() {
            exec(
              `x-terminal-emulator -e "/bin/bash -c 'docker container exec -it ${name} /bin/ash'"`
            ).on('error', () => {
              growl.notify('Shell not available');
            });
          },
        },
        {
          label: 'bash',
          click() {
            exec(
              `x-terminal-emulator -e "/bin/bash -c 'docker container exec -it ${name} /bin/bash'"`
            ).on('error', () => {
              growl.notify('Shell not available');
            });
          },
        },
        {
          label: 'sh',
          click() {
            exec(
              `x-terminal-emulator -e "/bin/bash -c 'docker container exec -it ${name} /bin/sh'"`
            ).on('error', () => {
              growl.notify('Shell not available');
            });
          },
        },
      ],
    },
    logs: {
      label: 'Logs',
      click() {
        exec(
          `x-terminal-emulator -e "/bin/bash -c 'docker container logs -f	${name}; read'"`
        ).on('error', () => {
          growl.notify('Shell not available');
        });
      },
    },
    separator: {
      type: 'separator',
    },
    title: {
      label: '🐋 Docker Containers 🐋',
      enabled: false,
    },
    refresh: {
      label: '🔄 Refresh',
      click() {
        refresh().then(() => {
          growl.notify('Refreshed');
        });
      },
    },
    about: {
      label: '🗒 About',
      submenu: [
        {
          label: `Developed by @franciscojsc
Extension for Docker containers in Ubuntu or derivatives`,
          enabled: false,
        },
        {
          label: 'Star on GitHub 🌟',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal(
              'https://github.com/franciscojsc/docker-containers-extension'
            );
          },
        },
      ],
    },
    quit: {
      label: '❓ Quit',
      role: 'quit',
    },
  };
};

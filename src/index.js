const { app, Menu, Tray } = require('electron');
const { docker, dockerUtils } = require('mydockerjs');
const { isDockerEngineRunning } = dockerUtils;
const { promisify } = require('util');

const isDockerEngineRunningPromise = promisify(isDockerEngineRunning);
const dockerPsPromise = promisify((cb, all = true) => docker.ps(cb, all));

const icon = require('./components/icon');
const menuDefault = require('./components/menuDefault');
const menuListContainer = require('./components/menuListContainer');
const menuDockerEngineNotRunning = require('./components/menuDockerEngineNotRunning');

let tray = null;

app.whenReady().then(async () => {
  tray = new Tray(icon);
  tray.setTitle('Extension Docker');
  tray.setToolTip('Extension Docker');

  setNewContextMenu(Menu, templateContext, tray);
});

async function setNewContextMenu(menu, template, tray) {
  const templateResult = await template();
  const contextMenu = createMenu(menu, templateResult);
  tray.setContextMenu(contextMenu);
}

async function refresh() {
  setNewContextMenu(Menu, templateContext, tray);
}

function createMenu(menu, template) {
  return menu.buildFromTemplate(template);
}

function getTemplate(template, state) {
  return template[state] || '';
}

const templateContext = async () => {
  const isDockerEngineRunningResult = await isDockerEngineRunningPromise();
  if (!isDockerEngineRunningResult) {
    return [...menuDockerEngineNotRunning(), ...menuDefault(refresh)];
  }
  const containerList = JSON.parse(await dockerPsPromise()) || [];
  return [...getContainerTemplate(containerList), ...menuDefault(refresh)];
};

function getContainerTemplate(containerList) {
  return containerList.map((item) => {
    const name = item.Names[0].replace('/', '');
    const state = item.State;
    return getTemplate(menuListContainer(refresh, name), state);
  });
}

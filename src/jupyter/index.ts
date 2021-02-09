import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application'
import { SessionContext, ICommandPalette } from '@jupyterlab/apputils'
import { ILauncher } from '@jupyterlab/launcher'
import { IMainMenu } from '@jupyterlab/mainmenu'
import { ITranslator } from '@jupyterlab/translation'
import { INotebookTracker } from '@jupyterlab/notebook'
import { Menu } from '@lumino/widgets'
import { WrapperPanel } from './panel'

const AppId = 'dharpa-extension-example'
const AppLabel = 'DHARPA JupyterLab extension example'
const AppCaption = 'DHARPA JupyterLab extension example'
const AppCategory = 'DHARPA Extension Examples'

/**
 * The command IDs used by the console plugin.
 */
namespace CommandIDs {
  export const create = `${AppId}:create`
}

/**
 * Initialization data for the extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: AppId,
  autoStart: true,
  optional: [ILauncher],
  requires: [ICommandPalette, IMainMenu, ITranslator, INotebookTracker],
  activate: activate
}

/**
 * Activate the JupyterLab extension.
 */
function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  mainMenu: IMainMenu,
  translator: ITranslator,
  notebooks: INotebookTracker,
  launcher: ILauncher | null
): void {
  const manager = app.serviceManager
  const { commands, shell } = app
  const category = AppCategory
  const trans = translator.load('jupyterlab')

  // Add launcher
  if (launcher) {
    launcher.add({
      command: CommandIDs.create,
      category: category
    })
  }

  async function createPanel(): Promise<WrapperPanel> {
    const sessionContext =
      notebooks?.currentWidget?.context?.sessionContext ??
      new SessionContext({
        sessionManager: manager.sessions,
        specsManager: manager.kernelspecs,
        name: AppLabel
      })

    const panel = new WrapperPanel(`${AppId}-panel`, AppLabel, sessionContext, translator)
    shell.add(panel, 'main')
    return panel
  }

  // add menu tab
  const exampleMenu = new Menu({ commands })
  exampleMenu.title.label = trans.__(AppLabel)
  mainMenu.addMenu(exampleMenu)

  // add commands to registry
  commands.addCommand(CommandIDs.create, {
    label: trans.__(AppLabel),
    caption: trans.__(AppCaption),
    execute: createPanel
  })

  // add items in command palette and menu
  palette.addItem({ command: CommandIDs.create, category })
  exampleMenu.addItem({ command: CommandIDs.create })
}

export default extension

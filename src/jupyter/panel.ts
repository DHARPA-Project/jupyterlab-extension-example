import { ISessionContext, sessionContextDialogs } from '@jupyterlab/apputils'
import { ITranslator, nullTranslator, TranslationBundle } from '@jupyterlab/translation'
import { Message } from '@lumino/messaging'
import { StackedPanel } from '@lumino/widgets'
import { KernelView } from './widget'
import { KernelModel } from './kernelModel'

/**
 * Container panel
 */
export class WrapperPanel extends StackedPanel {
  constructor(id: string, label: string, sessionContext: ISessionContext, translator?: ITranslator) {
    super()

    const actualTranslator = translator || nullTranslator
    this._trans = actualTranslator.load('jupyterlab')

    this.id = id
    this.title.label = this._trans.__(label)
    this.title.closable = true
    this._sessionContext = sessionContext

    void this._sessionContext
      .initialize()
      .then(async shouldSelectKernel => {
        if (shouldSelectKernel) {
          await sessionContextDialogs.selectKernel(this._sessionContext)
        }
        this._model = new KernelModel(this._sessionContext)
        this._example = new KernelView(this._model)
        this.addWidget(this._example)
      })
      .catch(reason => {
        console.error(`Failed to initialize the session in ExamplePanel.\n${reason}`)
      })
  }

  get session(): ISessionContext {
    return this._sessionContext
  }

  dispose(): void {
    // uncomment to destroy kernel on exit
    // this._sessionContext.dispose()
    super.dispose()
  }

  protected onCloseRequest(msg: Message): void {
    super.onCloseRequest(msg)
    this.dispose()
  }

  private _model: KernelModel
  private _sessionContext: ISessionContext
  private _example: KernelView

  private _trans: TranslationBundle
}

import { ISessionContext } from '@jupyterlab/apputils'
import { Kernel, KernelMessage } from '@jupyterlab/services'
import { Signal, ISignal } from '@lumino/signaling'
import { IModel, IMessage } from '../common/ModelContext'

type KernelMessage = Readonly<KernelMessage.IMessage<KernelMessage.MessageType>>
type ExecuteFuture = Kernel.IFuture<KernelMessage.IExecuteRequestMsg, KernelMessage.IExecuteReplyMsg>

const ResultMessageTypes = ['execute_result', 'display_data', 'update_display_data']

export class KernelModel implements IModel {
  private _sessionContext: ISessionContext

  private _lastSentMessage = new Signal<KernelModel, IMessage>(this)
  private _lastReceivedMessage = new Signal<KernelModel, IMessage>(this)
  private _lastExecutionResult = new Signal<KernelModel, IMessage>(this)

  private _executeFuture: ExecuteFuture | null = null

  constructor(session: ISessionContext) {
    this._sessionContext = session

    this._sessionContext

    this._sessionContext.session?.kernel?.anyMessage?.connect(this._anyMessageHandler.bind(this))
  }

  _anyMessageHandler(sender: Kernel.IKernelConnection, args: Kernel.IAnyMessageArgs): void {
    if (args.direction === 'recv') {
      this._lastReceivedMessage.emit(args.msg)

      const parentMessageId = (args.msg.parent_header as KernelMessage.IHeader)?.msg_id
      if (parentMessageId === this.lastExecuteMessageId) {
        const { msg_type: messageType } = args.msg.header
        if (ResultMessageTypes.includes(messageType)) {
          this._lastExecutionResult.emit(args.msg)
        }
      }
    } else {
      this._lastSentMessage.emit(args.msg)
    }
  }

  execute(code: string): void {
    if (!this.isConnected) throw new Error('Not connected to kernel')
    this._executeFuture = this._sessionContext.session?.kernel?.requestExecute({
      code
    })
  }

  sendMessage(target: string, msg: unknown): void {
    const comm = this._sessionContext.session?.kernel?.createComm(target)
    comm
      .open()
      .done.then(() => comm.send({ body: msg as string }).done)
      .finally(() => comm.close().done.catch(() => undefined))
  }

  get isConnected(): boolean {
    return this?._sessionContext?.session?.kernel != null
  }

  get executeFuture(): ExecuteFuture {
    return this._executeFuture
  }

  get lastReceivedMessage(): ISignal<IModel, IMessage> {
    return this._lastReceivedMessage
  }

  get lastExecutionResult(): ISignal<IModel, IMessage> {
    return this._lastExecutionResult
  }

  get lastExecuteMessageId(): string {
    return this._executeFuture == null ? undefined : this._executeFuture.msg.header.msg_id
  }
}

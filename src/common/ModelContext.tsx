import React from 'react'
import { KernelMessage } from '@jupyterlab/services'
import { ISignal } from '@lumino/signaling'

export interface IMessage {
  content: unknown
  channel: KernelMessage.Channel
  header: {
    msg_id: string
    msg_type: KernelMessage.MessageType
    date: string
  }
  metadata?: unknown
}

export interface IModel {
  lastReceivedMessage: ISignal<IModel, IMessage>
  lastExecutionResult: ISignal<IModel, IMessage>

  execute(code: string): void
  sendMessage(target: string, msg: unknown): void
}

const ModelContext = React.createContext<IModel>(null)
ModelContext.displayName = 'ModelContext'

export const ModelContextProvider = ModelContext.Provider

const useSignal = <T, P>(signal: ISignal<T, P>): P => {
  const [v, setV] = React.useState<P>()
  const slot = React.useRef((_: T, args: P) => setV(args))
  React.useEffect(() => {
    signal.connect(slot.current)
    return () => signal.disconnect(slot.current)
  }, [])

  return v
}

export const useLastReceivedMessage = (): IMessage | undefined => {
  return useSignal(React.useContext(ModelContext).lastReceivedMessage)
}

export const useExecute = (): [IMessage | undefined, (code: string) => void] => {
  const model = React.useContext(ModelContext)
  const result = useSignal(model.lastExecutionResult)

  return [result, (code: string) => model.execute(code)]
}

export const useSendCommMessage = (): [(target: string, msg: unknown) => void] => {
  const model = React.useContext(ModelContext)
  return [(target: string, msg: unknown) => model.sendMessage(target, msg)]
}

import React from 'react'
import { render } from 'react-dom'
import { Signal } from '@lumino/signaling'
import { App } from './components/App'
import { ModelContextProvider, IModel, IMessage } from './common/ModelContext'

const createMockMessage = (text: string): IMessage => ({
  channel: 'shell',
  header: {
    msg_id: String(new Date().getTime()),
    msg_type: 'status',
    date: new Date().toISOString()
  },
  content: { data: { 'text/plain': text } }
})

class MockModel implements IModel {
  lastReceivedMessage = new Signal<MockModel, IMessage>(this)
  lastExecutionResult = new Signal<MockModel, IMessage>(this)

  execute(code: string): void {
    this.lastExecutionResult.emit(createMockMessage(`Result of: ${code}`))
  }
}

const StandaloneApp = (): JSX.Element => {
  const model = React.useRef<IModel>(new MockModel())
  React.useEffect(() => {
    const signal = model.current.lastReceivedMessage as Signal<MockModel, IMessage>
    signal.emit(createMockMessage('NOTE: Running outside of Jupyter'))
  }, [])

  return (
    <ModelContextProvider value={model.current}>
      <App />
    </ModelContextProvider>
  )
}

render(<StandaloneApp />, document.getElementById('root'))

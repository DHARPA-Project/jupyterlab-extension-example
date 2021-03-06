import React from 'react'
import { useLastReceivedMessage, useExecute, IMessage, useSendCommMessage } from '../common/ModelContext'

import './app.scss'

const ExecuteResult = ({ result }: { result: Record<string, unknown> }) => {
  if (result?.['data'] == null) return <></>
  const data: Record<string, unknown> = (result?.['data'] as Record<string, unknown>) ?? {}

  if (data['text/html'] != null)
    return <div dangerouslySetInnerHTML={{ __html: data['text/html'] as string }}></div>

  return <pre className="whitespace-normal">{data['text/plain']}</pre>
}

const TableHeaderCell = ({ children }: { children: React.ReactNode }) => (
  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
)

const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-2 py-4 whitespace-nowrap">
    <div className="flex items-center">
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">
          <pre className="whitespace-pre-wrap">{children}</pre>
        </div>
      </div>
    </div>
  </td>
)

const InputClasses =
  'focus:ring-indigo-500 focus:border-indigo-500 shadow-sm sm:text-sm border-gray-300 rounded-md p-2 w-full'
const ButtonClasses =
  'inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap'

export const App = (): JSX.Element => {
  const [executeString, setExecuteString] = React.useState('')
  const [commTarget, setCommTarget] = React.useState('')
  const [commMessage, setCommMessage] = React.useState('')

  const [executeResult, execute] = useExecute()
  const [sendMessage] = useSendCommMessage()

  const lastMessage = useLastReceivedMessage()
  const [messages, setMessages] = React.useState<IMessage[]>(lastMessage == null ? [] : [lastMessage])

  React.useEffect(() => {
    if (lastMessage == null) return
    setMessages([lastMessage].concat(messages))
  }, [lastMessage])

  const executeCode = () => execute(executeString)
  const sendCommMessage = () => sendMessage(commTarget, commMessage)

  return (
    <div className="flex flex-col">
      {/* execute code section */}
      <div className="flex flex-col py-3 px-2">
        <div className="flex flex-row space-x-3">
          <input
            type="test"
            placeholder="Python code"
            className={InputClasses}
            value={executeString}
            onChange={e => setExecuteString(e.target.value)}
          />
          <button className={ButtonClasses} onClick={executeCode}>
            Execute
          </button>
        </div>
        <div className="flex py-5 px-2">
          <ExecuteResult result={executeResult?.content as Record<string, unknown>} />
        </div>
      </div>

      {/* send comm message section */}
      <div className="flex flex-col py-3 px-2">
        <div className="flex flex-row space-x-3">
          <input
            type="text"
            placeholder="target"
            className={InputClasses}
            value={commTarget}
            onChange={e => setCommTarget(e.target.value)}
          />
          <input
            placeholder="Message"
            type="text"
            className={InputClasses}
            value={commMessage}
            onChange={e => setCommMessage(e.target.value)}
          />
          <button className={ButtonClasses} onClick={sendCommMessage}>
            Send Message
          </button>
        </div>
      </div>

      {/* kernel messages section */}
      <div className="flex flex-row">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Channel</TableHeaderCell>
              <TableHeaderCell>Message</TableHeaderCell>
              <TableHeaderCell>Metadata</TableHeaderCell>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.map((message, index) => (
              <tr key={index}>
                <TableCell>{message.header.msg_type}</TableCell>
                <TableCell>{message.header.date}</TableCell>
                <TableCell>{message.channel}</TableCell>
                <TableCell>{JSON.stringify(message.content, null, 2)}</TableCell>
                <TableCell>{JSON.stringify(message.metadata, null, 2)}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

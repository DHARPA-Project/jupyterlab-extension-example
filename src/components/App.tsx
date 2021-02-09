import React from 'react'
import { useLastReceivedMessage, useExecute, IMessage } from '../common/ModelContext'

import './app.scss'

const ExecuteResult = ({ result }: { result: Record<string, unknown> }) => {
  if (result?.['data'] == null) return <></>
  const data: Record<string, unknown> = (result?.['data'] as Record<string, unknown>) ?? {}

  if (data['text/html'] != null)
    return <div dangerouslySetInnerHTML={{ __html: data['text/html'] as string }}></div>

  return <pre className="whitespace-normal">{data['text/plain']}</pre>
}

export const App = (): JSX.Element => {
  const [executeString, setExecuteString] = React.useState('')
  const [executeResult, execute] = useExecute()

  const lastMessage = useLastReceivedMessage()
  const [messages, setMessages] = React.useState<IMessage[]>(lastMessage == null ? [] : [lastMessage])

  React.useEffect(() => {
    if (lastMessage == null) return
    setMessages([lastMessage].concat(messages))
  }, [lastMessage])

  const executeCode = () => execute(executeString)

  return (
    <div className="flex flex-col">
      {/* execute code section */}
      <div className="flex flex-col py-3 px-2">
        <div className="flex flex-row space-x-3">
          <input
            type="textarea"
            className="focus:ring-indigo-500 focus:border-indigo-500 shadow-sm sm:text-sm border-gray-300 rounded-md p-2 w-full"
            value={executeString}
            onChange={e => setExecuteString(e.target.value)}
          />
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={executeCode}
          >
            Execute
          </button>
        </div>
        <div className="flex py-5 px-2">
          <ExecuteResult result={executeResult?.content as Record<string, unknown>} />
        </div>
      </div>

      {/* kernel messages section */}
      <div className="flex flex-row">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Channel
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Message
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.map((message, index) => (
              <tr key={index}>
                <td className="px-2 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        <pre className="whitespace-normal">{message.header.msg_type}</pre>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-2 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        <pre className="whitespace-normal">{message.header.date}</pre>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-2 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        <pre className="whitespace-normal">{message.channel}</pre>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-2 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(message.content, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

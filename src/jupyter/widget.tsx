import React from 'react'
import { ReactWidget } from '@jupyterlab/apputils'
import { KernelModel } from './kernelModel'
import { App } from '../components/App'
import { ModelContextProvider } from '../common/ModelContext'

export class KernelView extends ReactWidget {
  private _model: KernelModel

  constructor(model: KernelModel) {
    super()
    this._model = model
    this.addClass('dharpa-scrollable-panel')
    this.addClass('bg-gray-200')
  }

  protected render(): React.ReactElement<unknown> {
    return (
      <ModelContextProvider value={this._model}>
        <App />
      </ModelContextProvider>
    )
  }
}

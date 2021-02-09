# JupyterLab extension example

An example app that can run as a Jupyter extension and as a standalone web app. It showcases how communication with the kernel is done in Jupyter.

When run as a standalone web app the communication with the kernel is mocked. Running the app standalone has the advantage of using the webpack development server which reloads the app automatically during development. When running in Jupyter the browser tab needs to be manually reloaded every time the extension is recompiled.

## Running in development mode

### Running in JupyterLab

Make sure you have `JupyterLab 3.x` installed.
In a terminal session start JupyterLab:

```shell
jupyter lab
```

In another terminal session:

```shell
# Install dependencies
yarn install

# Install python package (similar to pip install -e)
# Makes the extension available in JupyterLab in development mode.
yarn develop
```

Then to watch files for changes and recompile run:

```shell
yarn watch
```

### Running as a standalone app:

```shell
# Install dependencies
yarn install
```

Then start the development server that will watch files for changes, recompile and reload the browser tab:

```shell
yarn start
```

## Items that should be changed/renamed if this project is cloned

- In `package.json`:
  - `name` - the extension will live in JupyterLab extensions folder under this name.
  - `jupyterlab.outputDir` - should follow the pattern: `<python_project_name>/labextension` (see below).
- Python project folder (`dharpa_jupyterlab_extension_example`). To keep things consistent, use the `name` from the `package.json`, remove `@` and replace `/` with `_` and all `-` with `_`.
- Change python project name in `install.json`.

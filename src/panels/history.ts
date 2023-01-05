import * as path from 'path';
import * as vscode from 'vscode';
import { SideProvider } from './side';
import { getUri } from '../utilities/getUri';

// const settingKey = 'vscPostman.history'
const createWebviewPanel = (
  context: vscode.ExtensionContext,
  {
    id = 'vscPostman',
    title = '新建请求',
  }: { id?: string; title?: string } = {},
) => {
  const columnToShowIn = vscode.window.activeTextEditor
    ? vscode.window.activeTextEditor.viewColumn
    : vscode.ViewColumn.One;

  const panel = vscode.window.createWebviewPanel(id, title, columnToShowIn!, {
    enableScripts: true,
    localResourceRoots: [
      vscode.Uri.file(path.join(context.extensionPath, 'media')),
      vscode.Uri.file(path.join(context.extensionPath, 'build')),
    ],
    retainContextWhenHidden: true,
  });

  // tab图标
  panel.iconPath = {
    light: vscode.Uri.file(path.join(context.extensionPath, 'panelIcon.light.svg')),
    dark: vscode.Uri.file(path.join(context.extensionPath, 'panelIcon.dark.svg')),
  };

  panel.webview.onDidReceiveMessage((message: Message) => {
    // html页面发送的消息：
    // webviewVscode.postMessage({
    //   type: 'requestSave',
    //   value: JSON.stringify({
    //     ...res,
    //     createTime: +new Date(),
    //   }),
    // });

    // 接收到webview发来的消息
    if (message.type === 'requestSave') {
      const history = SideProvider.getHistory();
      history.push(message.value);
      SideProvider.updateHistory(history);
    }
  });

  const toolkitUri = getUri(panel.webview, context.extensionUri, [
    'node_modules',
    '@vscode',
    'webview-ui-toolkit',
    'dist',
    'toolkit.js',
  ]);

  const codiconsUri = getUri(panel.webview, context.extensionUri, [
    'node_modules',
    '@vscode',
    'codicons',
    'dist',
    'codicon.css',
  ]);

  const mainUri = getUri(panel.webview, context.extensionUri, ['webview-ui', 'main.js']);
  const styleUri = getUri(panel.webview, context.extensionUri, ['webview-ui', 'style.css']);

  panel.webview.html = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script type="module" src="${toolkitUri}"></script>
      <script type="module" src="${mainUri}"></script>
      <link rel="stylesheet" href="${styleUri}">
      <link rel="stylesheet" href="${codiconsUri}">
    </head>
    <body>
      <div id="root"></div>
      <section class="component-container">
      <h2>Dropdown</h2>
      <section class="component-example">
        <p>Default Dropdown</p>
        <vscode-dropdown position="below">
          <vscode-option>Option Label #1</vscode-option>
          <vscode-option>Option Label #2</vscode-option>
          <vscode-option>Option Label #3</vscode-option>
        </vscode-dropdown>
      </section>
      <section class="component-example">
        <p>With Disabled</p>
        <vscode-dropdown disabled position="below">
          <vscode-option>Option Label #1</vscode-option>
          <vscode-option>Option Label #2</vscode-option>
          <vscode-option>Option Label #3</vscode-option>
        </vscode-dropdown>
      </section>
      <section class="component-example">
        <p>With Custom Indicator Icon</p>
        <vscode-dropdown position="below">
          <span slot="indicator" class="codicon codicon-settings"></span>
          <vscode-option>Option Label #1</vscode-option>
          <vscode-option>Option Label #2</vscode-option>
          <vscode-option>Option Label #3</vscode-option>
        </vscode-dropdown>
      </section>
    </section>
    </body>
  </html>`;
  return panel;
};

export const handlePostmanNew = (context: vscode.ExtensionContext) => () => {
  createWebviewPanel(context);
};

export const handleHistoryItemClick = (context: vscode.ExtensionContext) => {
  let currentPanel: vscode.WebviewPanel | undefined;
  return (item: HistoryItem) => {
    if (currentPanel) { currentPanel.reveal(); }

    else { currentPanel = createWebviewPanel(context); };

    currentPanel.title = item.name;
    currentPanel.webview.postMessage(item);
    currentPanel.onDidDispose(
      () => {
        currentPanel = undefined;
      },
      null,
      context.subscriptions,
    );
  };
};

export const handleHistoryItemNewWindow = (
context: vscode.ExtensionContext,
) => (item: HistoryItem) => {
  const currentPanel = createWebviewPanel(context);
  currentPanel.title = item.name;
  currentPanel.webview.postMessage(item);
};

export const handleHistoryItemDelete = ({
  createTime,
}: HistoryItem) => {
  SideProvider.deleteHistoryItem(createTime);
};
export const handleHistoryRefresh = () => {
  SideProvider.refresh();
};

export const handleHistoryUpload = () => {
  vscode.window.showOpenDialog();
};

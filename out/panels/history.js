"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHistoryRefresh = exports.handleHistoryItemDelete = exports.handleHistoryItemNewWindow = exports.handleHistoryItemClick = exports.handlePostmanNew = void 0;
const path = require("path");
const vscode = require("vscode");
const side_1 = require("./side");
const getUri_1 = require("../utilities/getUri");
// const settingKey = 'vscPostman.history'
const createWebviewPanel = (context, { id = 'vscPostman', title = '新建请求', } = {}) => {
    const columnToShowIn = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : vscode.ViewColumn.One;
    const panel = vscode.window.createWebviewPanel(id, title, columnToShowIn, {
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
    panel.webview.onDidReceiveMessage((message) => {
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
            const history = side_1.SideProvider.getHistory();
            history.push(message.value);
            side_1.SideProvider.updateHistory(history);
        }
    });
    const toolkitUri = (0, getUri_1.getUri)(panel.webview, context.extensionUri, [
        'node_modules',
        '@vscode',
        'webview-ui-toolkit',
        'dist',
        'toolkit.js',
    ]);
    const codiconsUri = (0, getUri_1.getUri)(panel.webview, context.extensionUri, [
        'node_modules',
        '@vscode',
        'codicons',
        'dist',
        'codicon.css',
    ]);
    const mainUri = (0, getUri_1.getUri)(panel.webview, context.extensionUri, ['webview-ui', 'main.js']);
    const styleUri = (0, getUri_1.getUri)(panel.webview, context.extensionUri, ['webview-ui', 'style.css']);
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
const handlePostmanNew = (context) => () => {
    createWebviewPanel(context);
};
exports.handlePostmanNew = handlePostmanNew;
const handleHistoryItemClick = (context) => {
    let currentPanel;
    return (item) => {
        if (currentPanel) {
            currentPanel.reveal();
        }
        else {
            currentPanel = createWebviewPanel(context);
        }
        ;
        currentPanel.title = item.name;
        currentPanel.webview.postMessage(item);
        currentPanel.onDidDispose(() => {
            currentPanel = undefined;
        }, null, context.subscriptions);
    };
};
exports.handleHistoryItemClick = handleHistoryItemClick;
const handleHistoryItemNewWindow = (context) => (item) => {
    const currentPanel = createWebviewPanel(context);
    currentPanel.title = item.name;
    currentPanel.webview.postMessage(item);
};
exports.handleHistoryItemNewWindow = handleHistoryItemNewWindow;
const handleHistoryItemDelete = ({ createTime, }) => {
    side_1.SideProvider.deleteHistoryItem(createTime);
};
exports.handleHistoryItemDelete = handleHistoryItemDelete;
const handleHistoryRefresh = () => {
    side_1.SideProvider.refresh();
};
exports.handleHistoryRefresh = handleHistoryRefresh;
//# sourceMappingURL=history.js.map
import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import { getUri } from "../utilities/getUri";
import { methodDropdown } from "./method";
import { SideProvider } from "./side";



/**
  * 此类管理 ComponentGallery webview 面板的状态和行为。
  *
  * 它包含以下所有数据和方法：
  *
  * - 创建和呈现 ComponentGallery webview 面板
  * - 面板关闭时正确清理和处理 webview 资源
  * - 设置 web 视图面板的 HTML（和代理 CSS/JavaScript）内容
  */
export class RequestPanel {
  public static currentPanel: RequestPanel | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];

  /**
   * ComponentGalleryPanel 类私有构造函数（仅从 render 方法调用）。
   *
   * @param panel 对 webview 面板的引用
   * @param extensionUri 包含扩展的目录的 URI
   */
  private constructor(panel: WebviewPanel, extensionUri: Uri) {
    this._panel = panel;

    // 设置一个事件侦听器以侦听面板何时被释放（即当用户关闭面板或面板以编程方式关闭时）
    this._panel.onDidDispose(this.dispose, null, this._disposables);

    // 设置 webview 面板的 HTML 内容
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);

    // 接收到webview发来的消息
    this._panel.webview.onDidReceiveMessage((message: Message) => {  

      
      
      if (message.type === 'requestSave') {
        const history = SideProvider.getHistory();
        console.log(history);
        history.push(message.value);
        SideProvider.updateHistory(history);
      }
    });
  }

  /**
   * 呈现当前的 webview 面板，否则将创建并显示一个新的 webview 面板。
   *
   * @param extensionUri 包含扩展的目录的 URI。
   */
  public static render(extensionUri: Uri) {
    if (RequestPanel.currentPanel) {
      // 如果 webview 面板已经存在显示它
      RequestPanel.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // 如果 web 视图面板尚不存在，请创建并显示一个新面板
      const panel = window.createWebviewPanel(
        // 面板视图类型
        "showGallery",
        // 面板标题
        "Component Gallery",
        // 面板应显示在编辑器列中
        ViewColumn.One,
        // 额外的面板配置
        {
          // 在 webview 中启用 JavaScript
          enableScripts: true,
        }
      );

      RequestPanel.currentPanel = new RequestPanel(panel, extensionUri);
    }
  }

  /**
   * 当 webview 面板关闭时清理和处理 webview 资源。
   */
  public dispose() {
    RequestPanel.currentPanel = undefined;

    // 处理当前的 webview 面板
    this._panel.dispose();

    // 处理当前 webview 面板的所有一次性用品（即命令）
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  /**
  * 定义并返回应该在 webview 面板中呈现的 HTML。
  *
  * @remarks 这也是引用 CSS 和 JavaScript 文件/包的地方
  *（例如 Webview UI Toolkit）被创建并插入到 webview HTML 中。
  *
  * @param webview 对扩展 webview 的引用
  * @param extensionUri 包含扩展的目录的URI
  * @returns 一个包含 HTML 的模板字符串文字
  * 在 webview 面板中呈现
  */
  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    const toolkitUri = getUri(webview, extensionUri, [
      "node_modules",
      "@vscode",
      "webview-ui-toolkit",
      "dist",
      "toolkit.js",
    ]);
    const codiconsUri = getUri(webview, extensionUri, [
      "node_modules",
      "@vscode",
      "codicons",
      "dist",
      "codicon.css",
    ]);
    const axios = getUri(webview, extensionUri, [
      "node_modules",
      "axios",
      "dist",
      "axios.js",
    ]);

    const mainUri = getUri(webview, extensionUri, ["webview-ui", "main.js"]);
    const styleUri = getUri(webview, extensionUri, ["webview-ui", "style.css"]);

    const config = JSON.parse(String(process.env.VSCODE_NLS_CONFIG));

    console.log("config", config);

    // 提示：安装 es6-string-html VS Code 扩展以启用下面的代码高亮
    return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script type="module" src="${toolkitUri}"></script>
      <script type="module" src="${axios}"></script>
      <script type="module" src="${mainUri}"></script>
      <link rel="stylesheet" href="${styleUri}">
      <link rel="stylesheet" href="${codiconsUri}">
      <title>Component Gallery</title>
    </head>
    
    <body>
      <h1>Request Panel</h1>
      <div class="flex">
        <div class="">
          ${methodDropdown}
        </div>
        <div class="flex-1 px">
          <vscode-text-field class="w-full" type="url"></vscode-text-field>
        </div>
        <div class="">
          <vscode-button appearance="primary" id="send" >Send</vscode-button>
        </div>
      </div>
      <vscode-divider></vscode-divider>
      <vscode-panels>
        <vscode-panel-tab id="tab-1">Parameters</vscode-panel-tab>
        <vscode-panel-tab id="tab-2">Body</vscode-panel-tab>
        <vscode-panel-tab id="tab-3">Headers</vscode-panel-tab>
        <vscode-panel-tab id="tab-4">Authorization</vscode-panel-tab>
        <vscode-panel-tab id="tab-5">Pre-request Script</vscode-panel-tab>
        <vscode-panel-tab id="tab-6">Tests</vscode-panel-tab>
        <vscode-panel-view id="view-1">
          <vscode-data-grid aria-label="Basic" grid-template-columns="45px">
            <vscode-data-grid-row row-type="header">
              <vscode-data-grid-cell cell-type="columnheader" grid-column="1">
                <vscode-checkbox></vscode-checkbox>
              </vscode-data-grid-cell>
              <vscode-data-grid-cell cell-type="columnheader" grid-column="2">Parameter</vscode-data-grid-cell>
              <vscode-data-grid-cell cell-type="columnheader" grid-column="3">Value</vscode-data-grid-cell>
              <vscode-data-grid-cell cell-type="columnheader" grid-column="4">Description</vscode-data-grid-cell>
            </vscode-data-grid-row>
            <vscode-data-grid-row>
              <vscode-data-grid-cell grid-column="1">
                <vscode-checkbox></vscode-checkbox>
              </vscode-data-grid-cell>
              <vscode-data-grid-cell grid-column="2">
                <vscode-text-field class="w-full" type="text" placeholder="Parameter 1"></vscode-text-field>
              </vscode-data-grid-cell>
              <vscode-data-grid-cell grid-column="3">
                <vscode-text-field class="w-full" type="url" placeholder="Value 1"></vscode-text-field>
              </vscode-data-grid-cell>
              <vscode-data-grid-cell grid-column="4">
                <vscode-text-field class="w-full" type="url" placeholder="..."></vscode-text-field>
              </vscode-data-grid-cell>
            </vscode-data-grid-row>
          </vscode-data-grid>
        </vscode-panel-view>
        <vscode-panel-view id="view-2">Body</vscode-panel-view>
        <vscode-panel-view id="view-3">Headers</vscode-panel-view>
        <vscode-panel-view id="view-4">Authorization</vscode-panel-view>
        <vscode-panel-view id="view-5">Pre-request Script</vscode-panel-view>
        <vscode-panel-view id="view-6">Tests</vscode-panel-view>
      </vscode-panels>
      <vscode-divider></vscode-divider>
    </body>
    
    </html>
    
    `;
  }
}

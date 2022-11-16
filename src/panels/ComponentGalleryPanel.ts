import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import { getUri } from "../utilities/getUri";
import { badgeDemo } from "./demos/badge";
import { buttonDemo } from "./demos/button";
import { checkboxDemo } from "./demos/checkbox";
import { dataGridDemo } from "./demos/data-grid";
import { dividerDemo } from "./demos/divider";
import { dropdownDemo } from "./demos/dropdown";
import { linkDemo } from "./demos/link";
import { panelsDemo } from "./demos/panels";
import { progressRingDemo } from "./demos/progress-ring";
import { radioGroupDemo } from "./demos/radio-group";
import { tagDemo } from "./demos/tag";
import { textAreaDemo } from "./demos/text-area";
import { textFieldDemo } from "./demos/text-field";


/**
  * 此类管理 ComponentGallery webview 面板的状态和行为。
  *
  * 它包含以下所有数据和方法：
  *
  * - 创建和呈现 ComponentGallery webview 面板
  * - 面板关闭时正确清理和处理 webview 资源
  * - 设置 web 视图面板的 HTML（和代理 CSS/JavaScript）内容
  */
export class ComponentGalleryPanel {
  public static currentPanel: ComponentGalleryPanel | undefined;
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
  }

  /**
   * 呈现当前的 webview 面板，否则将创建并显示一个新的 webview 面板。
   *
   * @param extensionUri 包含扩展的目录的 URI。
   */
  public static render(extensionUri: Uri) {
    if (ComponentGalleryPanel.currentPanel) {
      // 如果 webview 面板已经存在显示它
      ComponentGalleryPanel.currentPanel._panel.reveal(ViewColumn.One);
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

      ComponentGalleryPanel.currentPanel = new ComponentGalleryPanel(panel, extensionUri);
    }
  }

  /**
   * 当 webview 面板关闭时清理和处理 webview 资源。
   */
  public dispose() {
    ComponentGalleryPanel.currentPanel = undefined;

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
    const mainUri = getUri(webview, extensionUri, ["webview-ui", "main.js"]);
    const styleUri = getUri(webview, extensionUri, ["webview-ui", "style.css"]);

    // 提示：安装 es6-string-html VS Code 扩展以启用下面的代码高亮
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script type="module" src="${toolkitUri}"></script>
            <script type="module" src="${mainUri}"></script>
            <link rel="stylesheet" href="${styleUri}">
            <link rel="stylesheet" href="${codiconsUri}">
            <title>Component Gallery</title>
        </head>
        <body>
          <h1>Webview UI Toolkit Component Gallery</h1>
          <section class="component-row">
            ${badgeDemo}
            ${buttonDemo}
            ${checkboxDemo}
          </section>
          <section id="data-grid-row">
            ${dataGridDemo}
          </section>
          <section class="component-row">
            ${dividerDemo}
            ${dropdownDemo}
            ${linkDemo}
          </section>
          <section id="panels-row">
            ${panelsDemo}
          </section>
          <section class="component-row">
            ${progressRingDemo}
            ${radioGroupDemo}
            ${tagDemo}
          </section>
          <section class="component-row">
            ${textAreaDemo}
            ${textFieldDemo}
          </section>
        </body>
      </html>
    `;
  }
}

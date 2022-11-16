"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentGalleryPanel = void 0;
const vscode_1 = require("vscode");
const getUri_1 = require("../utilities/getUri");
const badge_1 = require("./demos/badge");
const button_1 = require("./demos/button");
const checkbox_1 = require("./demos/checkbox");
const data_grid_1 = require("./demos/data-grid");
const divider_1 = require("./demos/divider");
const dropdown_1 = require("./demos/dropdown");
const link_1 = require("./demos/link");
const panels_1 = require("./demos/panels");
const progress_ring_1 = require("./demos/progress-ring");
const radio_group_1 = require("./demos/radio-group");
const tag_1 = require("./demos/tag");
const text_area_1 = require("./demos/text-area");
const text_field_1 = require("./demos/text-field");
/**
  * 此类管理 ComponentGallery webview 面板的状态和行为。
  *
  * 它包含以下所有数据和方法：
  *
  * - 创建和呈现 ComponentGallery webview 面板
  * - 面板关闭时正确清理和处理 webview 资源
  * - 设置 web 视图面板的 HTML（和代理 CSS/JavaScript）内容
  */
class ComponentGalleryPanel {
    /**
     * ComponentGalleryPanel 类私有构造函数（仅从 render 方法调用）。
     *
     * @param panel 对 webview 面板的引用
     * @param extensionUri 包含扩展的目录的 URI
     */
    constructor(panel, extensionUri) {
        this._disposables = [];
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
    static render(extensionUri) {
        if (ComponentGalleryPanel.currentPanel) {
            // 如果 webview 面板已经存在显示它
            ComponentGalleryPanel.currentPanel._panel.reveal(vscode_1.ViewColumn.One);
        }
        else {
            // 如果 web 视图面板尚不存在，请创建并显示一个新面板
            const panel = vscode_1.window.createWebviewPanel(
            // 面板视图类型
            "showGallery", 
            // 面板标题
            "Component Gallery", 
            // 面板应显示在编辑器列中
            vscode_1.ViewColumn.One, 
            // 额外的面板配置
            {
                // 在 webview 中启用 JavaScript
                enableScripts: true,
            });
            ComponentGalleryPanel.currentPanel = new ComponentGalleryPanel(panel, extensionUri);
        }
    }
    /**
     * 当 webview 面板关闭时清理和处理 webview 资源。
     */
    dispose() {
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
    _getWebviewContent(webview, extensionUri) {
        const toolkitUri = (0, getUri_1.getUri)(webview, extensionUri, [
            "node_modules",
            "@vscode",
            "webview-ui-toolkit",
            "dist",
            "toolkit.js",
        ]);
        const codiconsUri = (0, getUri_1.getUri)(webview, extensionUri, [
            "node_modules",
            "@vscode",
            "codicons",
            "dist",
            "codicon.css",
        ]);
        const mainUri = (0, getUri_1.getUri)(webview, extensionUri, ["webview-ui", "main.js"]);
        const styleUri = (0, getUri_1.getUri)(webview, extensionUri, ["webview-ui", "style.css"]);
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
            ${badge_1.badgeDemo}
            ${button_1.buttonDemo}
            ${checkbox_1.checkboxDemo}
          </section>
          <section id="data-grid-row">
            ${data_grid_1.dataGridDemo}
          </section>
          <section class="component-row">
            ${divider_1.dividerDemo}
            ${dropdown_1.dropdownDemo}
            ${link_1.linkDemo}
          </section>
          <section id="panels-row">
            ${panels_1.panelsDemo}
          </section>
          <section class="component-row">
            ${progress_ring_1.progressRingDemo}
            ${radio_group_1.radioGroupDemo}
            ${tag_1.tagDemo}
          </section>
          <section class="component-row">
            ${text_area_1.textAreaDemo}
            ${text_field_1.textFieldDemo}
          </section>
        </body>
      </html>
    `;
    }
}
exports.ComponentGalleryPanel = ComponentGalleryPanel;
//# sourceMappingURL=ComponentGalleryPanel.js.map
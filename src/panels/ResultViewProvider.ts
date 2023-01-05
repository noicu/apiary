import * as vscode from 'vscode';
import { getUri } from '../utilities/getUri';

export class ResultViewProvider implements vscode.WebviewViewProvider {

  public static readonly viewType = 'result-view';

  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
  ) { }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [
        this._extensionUri
      ]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview, this._extensionUri);

    webviewView.webview.onDidReceiveMessage(data => {
      switch (data.type) {
        case 'colorSelected':
          {
            vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(`#${data.value}`));
            break;
          }
      }
    });
  }

  public addColor() {
    if (this._view) {
      this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
      this._view.webview.postMessage({ type: 'addColor' });
    }
  }

  public clearColors() {
    if (this._view) {
      this._view.webview.postMessage({ type: 'clearColors' });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri) {

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

    return /*html*/`
    <!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="module" src="${toolkitUri}"></script>
        <script type="module" src="${mainUri}"></script>
        <link rel="stylesheet" href="${styleUri}">
        <link rel="stylesheet" href="${codiconsUri}">
				<title>Cat Colors</title>
			</head>
			<body>
        <vscode-button appearance="primary">Button Text</vscode-button>
			</body>
		</html>`;
  }
}

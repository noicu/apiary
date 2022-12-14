"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const RequestPanel_1 = require("./panels/RequestPanel");
const history_1 = require("./panels/history");
const side_1 = require("./panels/side");
const CollectionsView_1 = require("./panels/CollectionsView");
const collection_1 = require("./commands/collection");
const ResultViewProvider_1 = require("./panels/ResultViewProvider");
function activate(context) {
    context.subscriptions.push(vscode_1.window.registerTreeDataProvider('apiary-history', new side_1.SideProvider(context)));
    context.subscriptions.push(vscode_1.window.registerTreeDataProvider('apiary-variable', new side_1.SideProvider(context)));
    context.subscriptions.push(vscode_1.window.registerTreeDataProvider('task-view', new side_1.SideProvider(context)));
    const provider = new ResultViewProvider_1.ResultViewProvider(context.extensionUri);
    context.subscriptions.push(vscode_1.window.registerWebviewViewProvider(ResultViewProvider_1.ResultViewProvider.viewType, provider));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostman.new', () => {
        RequestPanel_1.RequestPanel.render(context.extensionUri);
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostmanHistory.create', (0, collection_1.createCollection)(context)));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostmanHistory.click', (0, history_1.handleHistoryItemClick)(context)));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostmanHistory.newWindow', (0, history_1.handleHistoryItemNewWindow)(context)));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostmanHistory.delete', history_1.handleHistoryItemDelete));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostmanHistory.refresh', history_1.handleHistoryRefresh));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostmanHistory.upload', history_1.handleHistoryUpload));
    // ??????????????? API ??????
    // ??????????????????????????????????????? API ?????????????????? VS Code???
    if (typeof vscode_1.DataTransferItem === 'function') {
        new CollectionsView_1.CollectionsView(context);
    }
    const workspaceRoot = (vscode_1.workspace.workspaceFolders && (vscode_1.workspace.workspaceFolders.length > 0))
        ? vscode_1.workspace.workspaceFolders[0].uri.fsPath : undefined;
    if (!workspaceRoot) {
        return;
    }
    // ?????????????????????
    context.subscriptions.push(vscode_1.commands.registerCommand('extension.startTask', () => {
        vscode_1.window.withProgress({
            location: vscode_1.ProgressLocation.Window,
            title: "?????????",
            cancellable: false
        }, (progress, token) => {
            token.onCancellationRequested(() => {
                console.log("User canceled the long running operation");
            });
            progress.report({ increment: 0 });
            setTimeout(() => {
                progress.report({ increment: 10, message: "??????????????????! - ?????????..." });
            }, 1000);
            setTimeout(() => {
                progress.report({ increment: 40, message: "??????????????????! - ????????????..." });
            }, 2000);
            setTimeout(() => {
                progress.report({ increment: 50, message: "??????????????????! - ???????????????..." });
            }, 3000);
            const p = new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 5000);
            });
            return p;
        });
    }));
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
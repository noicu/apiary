"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const RequestPanel_1 = require("./panels/RequestPanel");
const history_1 = require("./panels/history");
const side_1 = require("./panels/side");
const testViewDragAndDrop_1 = require("./panels/testViewDragAndDrop");
function activate(context) {
    // // Create the show gallery command
    // const showGalleryCommand = commands.registerCommand("component-gallery.showGallery", () => {
    //   ComponentGalleryPanel.render(context.extensionUri);
    // });
    // // Add command to the extension context
    // context.subscriptions.push(showGalleryCommand);
    context.subscriptions.push(vscode_1.window.registerTreeDataProvider('apiary-side', new side_1.SideProvider(context)));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostman.new', () => {
        RequestPanel_1.RequestPanel.render(context.extensionUri);
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostmanHistory.click', (0, history_1.handleHistoryItemClick)(context)));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostmanHistory.newWindow', (0, history_1.handleHistoryItemNewWindow)(context)));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostmanHistory.delete', history_1.handleHistoryItemDelete));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostmanHistory.refresh', history_1.handleHistoryRefresh));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostmanHistory.upload', history_1.handleHistoryUpload));
    // 拖放建议的 API 示例
    // 此检查适用于没有最新树拖放 API 提案的旧版本 VS Code。
    if (typeof vscode_1.DataTransferItem === 'function') {
        new testViewDragAndDrop_1.TestViewDragAndDrop(context);
    }
    const workspaceRoot = (vscode_1.workspace.workspaceFolders && (vscode_1.workspace.workspaceFolders.length > 0))
        ? vscode_1.workspace.workspaceFolders[0].uri.fsPath : undefined;
    if (!workspaceRoot) {
        return;
    }
    // 进度指示器示例
    context.subscriptions.push(vscode_1.commands.registerCommand('extension.startTask', () => {
        vscode_1.window.withProgress({
            location: vscode_1.ProgressLocation.Window,
            title: "小蜜蜂",
            cancellable: false
        }, (progress, token) => {
            token.onCancellationRequested(() => {
                console.log("User canceled the long running operation");
            });
            progress.report({ increment: 0 });
            setTimeout(() => {
                progress.report({ increment: 10, message: "正在执行任务! - 还在做..." });
            }, 1000);
            setTimeout(() => {
                progress.report({ increment: 40, message: "正在执行任务! - 还在继续..." });
            }, 2000);
            setTimeout(() => {
                progress.report({ increment: 50, message: "正在执行任务! - 差不多好了..." });
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
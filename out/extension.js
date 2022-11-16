"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode_1 = require("vscode");
const RequestPanel_1 = require("./panels/RequestPanel");
const history_1 = require("./panels/history");
const side_1 = require("./panels/side");
function activate(context) {
    // // Create the show gallery command
    // const showGalleryCommand = commands.registerCommand("component-gallery.showGallery", () => {
    //   ComponentGalleryPanel.render(context.extensionUri);
    // });
    // // Add command to the extension context
    // context.subscriptions.push(showGalleryCommand);
    context.subscriptions.push(vscode_1.window.registerTreeDataProvider('vsc-postman-side', new side_1.SideProvider(context)));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostman.new', () => {
        RequestPanel_1.RequestPanel.render(context.extensionUri);
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostmanHistory.click', (0, history_1.handleHistoryItemClick)(context)));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostmanHistory.newWindow', (0, history_1.handleHistoryItemNewWindow)(context)));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostmanHistory.delete', history_1.handleHistoryItemDelete));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostmanHistory.refresh', history_1.handleHistoryRefresh));
    context.subscriptions.push(vscode_1.commands.registerCommand('vscPostmanHistory.upload', history_1.handleHistoryUpload));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map
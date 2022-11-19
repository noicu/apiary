import { commands, DataTransferItem, ExtensionContext, window } from "vscode";
import { RequestPanel } from "./panels/RequestPanel";
import { handleHistoryItemClick, handleHistoryItemDelete, handleHistoryItemNewWindow, handleHistoryRefresh, handleHistoryUpload, handlePostmanNew } from "./panels/history";
import { SideProvider } from "./panels/side";
import { TestViewDragAndDrop } from "./panels/testViewDragAndDrop";

export function activate(context: ExtensionContext) {
  // // Create the show gallery command
  // const showGalleryCommand = commands.registerCommand("component-gallery.showGallery", () => {
  //   ComponentGalleryPanel.render(context.extensionUri);
  // });

  // // Add command to the extension context
  // context.subscriptions.push(showGalleryCommand);

  context.subscriptions.push(window.registerTreeDataProvider('vsc-postman-side', new SideProvider(context)));

  context.subscriptions.push(commands.registerCommand('vscPostman.new', () => {
    RequestPanel.render(context.extensionUri);
  }));

  context.subscriptions.push(commands.registerCommand('vscPostmanHistory.click', handleHistoryItemClick(context)));
  context.subscriptions.push(commands.registerCommand('vscPostmanHistory.newWindow', handleHistoryItemNewWindow(context)));
  context.subscriptions.push(commands.registerCommand('vscPostmanHistory.delete', handleHistoryItemDelete));
  context.subscriptions.push(commands.registerCommand('vscPostmanHistory.refresh', handleHistoryRefresh));
  context.subscriptions.push(commands.registerCommand('vscPostmanHistory.upload', handleHistoryUpload));

  // 拖放建议的 API 示例
  // 此检查适用于没有最新树拖放 API 提案的旧版本 VS Code。
  if (typeof DataTransferItem === 'function') {
    new TestViewDragAndDrop(context);
  }
}

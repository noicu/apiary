import { commands, DataTransferItem, Disposable, ExtensionContext, ProgressLocation, tasks, window, workspace } from "vscode";
import { RequestPanel } from "./panels/RequestPanel";
import { handleHistoryItemClick, handleHistoryItemDelete, handleHistoryItemNewWindow, handleHistoryRefresh, handleHistoryUpload, handlePostmanNew } from "./panels/history";

import { SideProvider } from "./panels/side";
import { CollectionsView } from "./panels/CollectionsView";
import { createCollection } from "./commands/collection";




export function activate(context: ExtensionContext) {
  // // Create the show gallery command
  // const showGalleryCommand = commands.registerCommand("component-gallery.showGallery", () => {
  //   ComponentGalleryPanel.render(context.extensionUri);
  // });

  // // Add command to the extension context
  // context.subscriptions.push(showGalleryCommand);

  context.subscriptions.push(window.registerTreeDataProvider('apiary-side', new SideProvider(context)));

  context.subscriptions.push(commands.registerCommand('vscPostman.new', () => {
    RequestPanel.render(context.extensionUri);
  }));

  context.subscriptions.push(commands.registerCommand('vscPostmanHistory.create', createCollection(context)));

  context.subscriptions.push(commands.registerCommand('vscPostmanHistory.click', handleHistoryItemClick(context)));
  context.subscriptions.push(commands.registerCommand('vscPostmanHistory.newWindow', handleHistoryItemNewWindow(context)));
  context.subscriptions.push(commands.registerCommand('vscPostmanHistory.delete', handleHistoryItemDelete));
  context.subscriptions.push(commands.registerCommand('vscPostmanHistory.refresh', handleHistoryRefresh));
  context.subscriptions.push(commands.registerCommand('vscPostmanHistory.upload', handleHistoryUpload));

  // 拖放建议的 API 示例
  // 此检查适用于没有最新树拖放 API 提案的旧版本 VS Code。
  if (typeof DataTransferItem === 'function') {
    new CollectionsView(context);
  }

  const workspaceRoot = (workspace.workspaceFolders && (workspace.workspaceFolders.length > 0))
    ? workspace.workspaceFolders[0].uri.fsPath : undefined;
  if (!workspaceRoot) {
    return;
  }

  // 进度指示器示例
  context.subscriptions.push(commands.registerCommand('extension.startTask', () => {
    window.withProgress({
      location: ProgressLocation.Window,
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

      const p = new Promise<void>(resolve => {
        setTimeout(() => {
          resolve();
        }, 5000);
      });

      return p;
    });
  }));
}

export function deactivate(): void {

}

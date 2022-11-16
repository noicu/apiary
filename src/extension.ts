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

  // Drag and Drop proposed API sample
  // This check is for older versions of VS Code that don't have the most up-to-date tree drag and drop API proposal.
  if (typeof DataTransferItem === 'function') {
    new TestViewDragAndDrop(context);
  }
}

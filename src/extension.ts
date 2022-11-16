import { commands, ExtensionContext, window } from "vscode";
import { ComponentGalleryPanel } from "./panels/ComponentGalleryPanel";
import { handleHistoryItemClick, handleHistoryItemDelete, handleHistoryItemNewWindow, handleHistoryRefresh, handlePostmanNew } from "./panels/history";
import { SideProvider } from "./panels/side";

export function activate(context: ExtensionContext) {
  // // Create the show gallery command
  // const showGalleryCommand = commands.registerCommand("component-gallery.showGallery", () => {
  //   ComponentGalleryPanel.render(context.extensionUri);
  // });

  // // Add command to the extension context
  // context.subscriptions.push(showGalleryCommand);

  context.subscriptions.push(window.registerTreeDataProvider('vsc-postman-side', new SideProvider()));

  context.subscriptions.push(commands.registerCommand('vscPostman.new', () => {
    ComponentGalleryPanel.render(context.extensionUri);
  }));
  context.subscriptions.push(commands.registerCommand('vscPostmanHistory.click', handleHistoryItemClick(context)));
  context.subscriptions.push(commands.registerCommand('vscPostmanHistory.newWindow', handleHistoryItemNewWindow(context)));
  context.subscriptions.push(commands.registerCommand('vscPostmanHistory.delete', handleHistoryItemDelete));
  context.subscriptions.push(commands.registerCommand('vscPostmanHistory.refresh', handleHistoryRefresh));
}
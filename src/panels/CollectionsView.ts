import * as vscode from 'vscode';
import * as path from 'path';
import { onDidChangeCollection } from "../core/events";
import collectionsRoot, { initCollections } from "../core/collection";
import { flattenTree } from '../utilities/tools';

export class CollectionsView implements vscode.TreeDataProvider<ApiaryConfigTree>, vscode.TreeDragAndDropController<ApiaryConfigTree> {
  dropMimeTypes = ['application/vnd.code.tree.apiaryCollection'];

  dragMimeTypes = ['text/uri-list'];

  context: vscode.ExtensionContext;

  // 订阅 [_onDidChangeTreeData] 事件, 以便在树数据发生变化时，更新视图
  public onDidChangeTreeData: vscode.Event<any> = onDidChangeCollection.event;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    // 创建视图
    const view = vscode.window.createTreeView(
      'apiary-collection',
      {
        treeDataProvider: this,
        showCollapseAll: true,
        canSelectMany: true,
        dragAndDropController: this
      }
    );

    // 注册视图
    context.subscriptions.push(view);

    initCollections();
  }

  // 根据展开的节点，获取其子节点
  // 由 [vscode.TreeDataProvider] 内部调用
  public getChildren(collection: ApiaryConfigTree | undefined): ApiaryConfigTree[] {
    return collection ? collection.children : collectionsRoot;
  }

  // 根据节点生成树节点实例
  // 由 [vscode.TreeDataProvider] 内部调用
  public getTreeItem(element: ApiaryConfigTree): vscode.TreeItem {
    // 生成树节点实例
    const treeItem = this._getTreeItem(element);
    return treeItem;
  }

  // 根据节点获取其父节点
  // 由 [vscode.TreeDataProvider] 内部调用
  public getParent(element: ApiaryConfigTree): ApiaryConfigTree {
    console.log('getParent', element);
    return {
      _key: element._key + 1,
      label: element.label + 1,
      type: element.type,
      children: element.children,
    };
  }

  dispose(): void {
    // 没有什么可处理的
  }

  // 放置控制器
  // 由 [vscode.TreeDragAndDropController] 内部调用
  public async handleDrop(target: ApiaryConfigTree | undefined, sources: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {

    const transferItem = sources.get('application/vnd.code.tree.apiaryCollection');

    if (!transferItem) { return; }

    const treeItems: ApiaryConfigTree[] = transferItem.value;

    console.log('treeItems', treeItems);
  }

  // 拖动控制器
  // 由 [vscode.TreeDragAndDropController] 内部调用
  public async handleDrag(source: ApiaryConfigTree[], treeDataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
    treeDataTransfer.set('application/vnd.code.tree.apiaryCollection', new vscode.DataTransferItem(source));
  }

  _getTreeItem(element: ApiaryConfigTree): vscode.TreeItem {
    // const treeElement = this._getTreeElement(element._key);
    // 如何在树项工具提示的 MarkdownString 中使用 codicons 的示例。
    const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${element._key}`, true);

    let iconPath;

    if (element.type === 'collection') {
      iconPath = {
        light: vscode.Uri.file(path.join(this.context.extensionPath, 'assets', 'beehive.svg')),
        dark: vscode.Uri.file(path.join(this.context.extensionPath, 'assets', 'beehive.svg')),
      };
    } else if (element.type === 'group') {
      iconPath = undefined;
    } else if (element.type === 'request' &&  element.method) {
      iconPath = {
        light: vscode.Uri.file(path.join(this.context.extensionPath, 'assets', 'request', element.method.toLowerCase() + '.svg')),
        dark: vscode.Uri.file(path.join(this.context.extensionPath, 'assets', 'request', element.method.toLowerCase() + '.svg')),
      };
    }
    return {
      id: element._key,
      label: element.label,
      tooltip,
      iconPath,
      collapsibleState: element.children.length || element.type === 'collection' ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
      resourceUri: vscode.Uri.parse(`/tmp/${element._key}`),
      description: element.description,
      command: element.type === 'request' ? {
        title: '查看',
        command: 'vscPostmanHistory.click',
        arguments: [{}],
      } : undefined,
    };
  }
}

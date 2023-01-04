import * as vscode from 'vscode';

export class CollectionsView implements vscode.TreeDataProvider<Node>, vscode.TreeDragAndDropController<Node> {
  dropMimeTypes = ['application/vnd.code.tree.apiaryCollection'];

  dragMimeTypes = ['text/uri-list'];

  private _onDidChangeTreeData: vscode.EventEmitter<(Node | undefined)[] | undefined> = new vscode.EventEmitter<Node[] | undefined>();

  // 我们想使用数组作为事件类型，但目前正在最终确定用于此的 API。 在最终确定之前，使用任何。
  public onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  public tree: any = {
    'a': {
      'aa': {
        'aaa': {
          'aaaa': {
            'aaaaa': {
              'aaaaaa': {

              }
            }
          }
        }
      },
      'ab': {}
    },
    'b': {
      'ba': {},
      'bb': {}
    }
  };

  // 跟踪我们创建的任何节点，以便我们可以重复使用相同的对象。
  private nodes: any = {};

  constructor(context: vscode.ExtensionContext) {
    const view = vscode.window.createTreeView('apiary-collection', { treeDataProvider: this, showCollapseAll: true, canSelectMany: true, dragAndDropController: this });
    context.subscriptions.push(view);
  }

  // 根据展开的节点，获取其子节点
  // 由 [vscode.TreeDataProvider] 内部调用
  public getChildren(element: Node): Node[] {
    // console.log('getChildren', element);
    console.log('getChildren', this.nodes);
    return this._getChildren(element ? element.key : undefined).map(key => this._getNode(key));
  }

  // 根据节点生成树节点实例
  // 由 [vscode.TreeDataProvider] 内部调用
  public getTreeItem(element: Node): vscode.TreeItem {
    // console.log('getTreeItem', element);
    const treeItem = this._getTreeItem(element.key);

    treeItem.id = element.key;

    return treeItem;
  }

  // 根据节点获取其父节点
  // 由 [vscode.TreeDataProvider] 内部调用
  public getParent(element: Node): Node {
    return this._getParent(element.key);
  }

  dispose(): void {
    // 没有什么可处理的
  }

  // 放置控制器
  // 由 [vscode.TreeDragAndDropController] 内部调用
  public async handleDrop(target: Node | undefined, sources: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {

    const transferItem = sources.get('application/vnd.code.tree.apiaryCollection');

    if (!transferItem) {
      return;
    }

    const treeItems: Node[] = transferItem.value;

    let roots = this._getLocalRoots(treeItems);

    // 删除已经是目标父节点的节点
    roots = roots.filter(r => !this._isChild(this._getTreeElement(r.key), target));

    if (roots.length > 0) {
      // 重新加载移动元素的父级
      const parents = roots.map(r => this.getParent(r));
      roots.forEach(r => this._reparentNode(r, target));
      this._onDidChangeTreeData.fire([...parents, target]);
    }
  }

  // 拖动控制器
  // 由 [vscode.TreeDragAndDropController] 内部调用
  public async handleDrag(source: Node[], treeDataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<void> {
    treeDataTransfer.set('application/vnd.code.tree.apiaryCollection', new vscode.DataTransferItem(source));
  }

  // 辅助方法
  _isChild(node: Node, child: Node | undefined): boolean {
    if (!child) {
      return false;
    }
    for (const prop in node) {
      if (prop === child.key) {
        return true;
      } else {
        const isChild = this._isChild((node as any)[prop], child);
        if (isChild) {
          return isChild;
        }
      }
    }
    return false;
  }

  // 从给定的节点中，过滤掉父节点已经在节点数组中的所有节点。
  _getLocalRoots(nodes: Node[]): Node[] {
    const localRoots = [];
    for (let i = 0; i < nodes.length; i++) {
      const parent = this.getParent(nodes[i]);
      if (parent) {
        const isInList = nodes.find(n => n.key === parent.key);
        if (isInList === undefined) {
          localRoots.push(nodes[i]);
        }
      } else {
        localRoots.push(nodes[i]);
      }
    }
    return localRoots;
  }

  // 从当前位置移除节点并将节点添加到新的目标元素
  _reparentNode(node: Node, target: Node | undefined): void {
    const element: any = {};
    element[node.key] = this._getTreeElement(node.key);
    const elementCopy = { ...element };
    this._removeNode(node);
    const targetElement = this._getTreeElement(target?.key);
    if (Object.keys(element).length === 0) {
      targetElement[node.key] = {};
    } else {
      Object.assign(targetElement, elementCopy);
    }
  }

  // 从树中删除节点
  _removeNode(element: Node, tree?: any): void {
    const subTree = tree ? tree : this.tree;
    for (const prop in subTree) {
      if (prop === element.key) {
        const parent = this.getParent(element);
        if (parent) {
          const parentObject = this._getTreeElement(parent.key);
          delete parentObject[prop];
        } else {
          delete this.tree[prop];
        }
      } else {
        this._removeNode(element, subTree[prop]);
      }
    }
  }

  // 根据父键获取树元素
  _getChildren(key: string | undefined): string[] {
    // 如果没有键，则返回根元素
    if (!key) {
      return Object.keys(this.tree);
    }
    
    // 获取树元素
    const treeElement = this._getTreeElement(key);

    // 如果树元素存在，则返回其键
    if (treeElement) {
      return Object.keys(treeElement);
    }
    
    // 否则返回空数组
    return [];
  }

  _getTreeItem(key: string): vscode.TreeItem {
    const treeElement = this._getTreeElement(key);
    // 如何在树项工具提示的 MarkdownString 中使用 codicons 的示例。
    const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${key}`, true);
    return {
      // highlights = 标签中要突出显示的范围。 范围定义为两个数字的元组，其中第一个是包含开始索引，第二个是排他结束索引
      label: /**vscode.TreeItemLabel**/<any>{ label: key, highlights: key.length > 1 ? [[key.length - 2, key.length - 1]] : void 0 },
      tooltip,
      collapsibleState: treeElement && Object.keys(treeElement).length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
      resourceUri: vscode.Uri.parse(`/tmp/${key}`),
      description: `123`
    };
  }

  // 获取树元素
  _getTreeElement(element: string | undefined, tree?: any): any {
    if (!element) {
      return this.tree;
    }
    const currentNode = tree ?? this.tree;
    for (const prop in currentNode) {
      if (prop === element) {
        return currentNode[prop];
      } else {
        const treeElement = this._getTreeElement(element, currentNode[prop]);
        if (treeElement) {
          return treeElement;
        }
      }
    }
  }

  _getParent(element: string, parent?: string, tree?: any): any {
    const currentNode = tree ?? this.tree;
    for (const prop in currentNode) {
      if (prop === element && parent) {
        return this._getNode(parent);
      } else {
        const parent = this._getParent(element, prop, currentNode[prop]);
        if (parent) {
          return parent;
        }
      }
    }
  }

  _getNode(key: string): Node {
    if (!this.nodes[key]) {
      this.nodes[key] = new Key(key);
    }
    return this.nodes[key];
  }
}

type Node = { key: string };

class Key {
  constructor(readonly key: string) { }
}

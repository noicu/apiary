import * as vscode from 'vscode';

// 触发该事件，更新视图 this._onDidChangeTreeData.fire(undefined);
// fire 方法的参数是一个数组，数组中的每一项都是一个 Node 实例 用于该节点的更新
export const onDidChangeCollection = new vscode.EventEmitter<any[] | undefined>();

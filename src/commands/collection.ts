
import * as vscode from 'vscode';
import { isFileName } from '../utilities/validate';
// import { addCollection } from '../core/collection';

// 创建一个合集
export const createCollection = (context: vscode.ExtensionContext) => {
  return async () => {
    const name = await vscode.window.showInputBox({
      prompt: '请输入合集名称',
      placeHolder: '合集名',
      validateInput: (value) => {
        if (!value) {
          return '合集名称不能为空';
        }
        if (!isFileName(value)) {
          return '名称不能包含【\\\\/:*?\"<>|】这些非法字符';
        }
        return '';
      },
    });

    if (name) {
      // addCollection(name);
      vscode.window.showInformationMessage(`创建 合集 ${name} 成功`);
    }
  };
};

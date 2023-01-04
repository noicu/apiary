import * as vscode from 'vscode';
import { stat } from '../utilities/fs';
import { itemToTree, uuid } from "../utilities/tools";
import { onDidChangeCollection } from "./events";
import { getApiaryCollectionPath, getApiaryFile, getApiaryFileList, getApiaryPath, initApiaryCollectionFolder, initApiaryFolder } from "./workspace";

export const collections: ApiaryConfigTree[] = [];


export default collections;

export const initCollections = () => {

  // 工作区文件夹;
  vscode.workspace.workspaceFolders?.forEach(async (wf) => {
    // 检测步骤
    let steps: string = '';
    
    // .apiary文件夹路径
    const APIARY_PATH = getApiaryPath(wf);

    const APIARY_COLLECTION_PATH = getApiaryCollectionPath(wf);

    try {
      steps = '.apiary';
      // 读取.apiary文件夹下的文件
      await stat(APIARY_PATH);
      steps = 'collections';
      // 读取collection文件夹下的文件
      await stat(APIARY_COLLECTION_PATH);

      // 读取文件内容
      const APIARY_DIRECTORY = await getApiaryFileList(wf);
      for (const uri of APIARY_DIRECTORY) {
        const file = await getApiaryFile(uri);

        collections.push({
          _key: uuid(),
          label: file.name,
          type: "collection",
          description: file.description,
          children: itemToTree(file.children),
        });

        console.log(collections, 'context');
      }
      // 更新视图
      onDidChangeCollection.fire(undefined);
    } catch (error) {
      const item = await vscode.window.showWarningMessage(`${steps} 目录不存在`, '创建目录', '取消');

      if (item === '创建目录') {
        // 初始化工作区文件夹
        await initApiaryFolder(wf);

        // 初始化collection文件夹
        await initApiaryCollectionFolder(wf);
      }
      // 更新视图
      onDidChangeCollection.fire(undefined);
    }
  });

  
};





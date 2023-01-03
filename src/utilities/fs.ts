
import * as vscode from 'vscode';


/**
 * @description: 读取文件夹
 */
export const readDirectory = vscode.workspace.fs.readDirectory;

/**
 * @description: 读取文件
 */
export const readFile = vscode.workspace.fs.readFile;

/**
 * @description: 写入文件
 */
export const writeFile = vscode.workspace.fs.writeFile;

/**
 * @description: 文件状态
 */
export const stat = vscode.workspace.fs.stat;

/**
 * @description: 创建文件夹
 */
export const createDirectory = vscode.workspace.fs.createDirectory;

/**
 * @description: 删除
 */
export const del = vscode.workspace.fs.delete;

/**
 * @description: 重命名文件
 */
export const rename = vscode.workspace.fs.rename;

/**
 * @description: 复制文件
 */
export const copyFile = vscode.workspace.fs.copy;


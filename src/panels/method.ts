export const methods = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
  'PURGE',
  'LINK',
  'UNLINK',
];

export const methodOption = (method: string) => /*html*/ `<vscode-option>${method}</vscode-option>`;

export const methodDropdown =  /*html*/ `
<vscode-dropdown>
  ${methods.map(methodOption).join('')}
</vscode-dropdown>
`;

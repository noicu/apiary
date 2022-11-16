// 从 webview 上下文中访问 VS 代码 API
const vscode = acquireVsCodeApi();

// 就像一个普通的网页一样，我们需要等待 webview
// 在我们可以引用任何 HTML 元素之前加载 DOM
// 或工具包组件
window.addEventListener("load", main);


function main() {

  document.getElementById("send").onclick = function () {
    console.log(axios);
    vscode.postMessage({
      type: 'requestSave',
      value: JSON.stringify({
        "name": "csasca",
        "method": "GET",
        "url": "acsasca",
        "headers": "{\n\"a\":\"1\"\n}",
        createTime: +new Date(),
      }),
    });
  };


  // 设置复选框不确定状态
  const checkbox = document.getElementById("basic-checkbox");
  checkbox.indeterminate = true;

  // 定义默认数据网格
  const defaultDataGrid = document.getElementById("default-grid");
  defaultDataGrid.rowsData = [
    {
      column1: "Cell Data",
      column2: "Cell Data",
      column3: "Cell Data",
      column4: "Cell Data",
    },
    {
      column1: "Cell Data",
      column2: "Cell Data",
      column3: "Cell Data",
      column4: "Cell Data",
    },
    {
      column1: "Cell Data",
      column2: "Cell Data",
      column3: "Cell Data",
      column4: "Cell Data",
    },
  ];

  // 使用自定义标题定义数据网格
  const basicDataGridList = document.querySelectorAll(".basic-grid");
  for (const basicDataGrid of basicDataGridList) {
    basicDataGrid.rowsData = [
      {
        columnKey1: "Cell Data",
        columnKey2: "Cell Data",
        columnKey3: "Cell Data",
        columnKey4: "Cell Data",
      },
      {
        columnKey1: "Cell Data",
        columnKey2: "Cell Data",
        columnKey3: "Cell Data",
        columnKey4: "Cell Data",
      },
      {
        columnKey1: "Cell Data",
        columnKey2: "Cell Data",
        columnKey3: "Cell Data",
        columnKey4: "Cell Data",
      },
    ];
    basicDataGrid.columnDefinitions = [
      { columnDataKey: "columnKey1", title: "A Custom Header Title" },
      { columnDataKey: "columnKey2", title: "Custom Title" },
      { columnDataKey: "columnKey3", title: "Title Is Custom" },
      { columnDataKey: "columnKey4", title: "Another Custom Title" },
    ];
  }
}

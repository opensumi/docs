---
id: terminal
title: Terminal
slug: terminal
order: 5
---

终端（Terminal） 是 IDE 重要的组成部分，能帮助用户快速的进行系统命令的执行及文件操作等，下面介绍一些常见的插件内的拓展场景。

## 自定义链接识别

```ts
...
vscode.window.registerTerminalLinkProvider({
  // 鼠标 hover 时会触发这个方法
  provideTerminalLinks: (context, token) => {
    // context.line 就是当前行的字符串
    const startIndex = (context.line as string).indexOf('opensumi.com');
    if (startIndex === -1) {
      return [];
    }
    // 返回一个数组，内容是识别出来的所有链接
    return [
      {
        startIndex,
        length: 'opensumi.com'.length,
        // You can return data in this object to access inside handleTerminalLink
        data: 'Example data'
      }
    ];
  },
  // 点击链接时会触发这个方法
  handleTerminalLink: (link: any) => {
    vscode.window.showInformationMessage(`Link activated (data = ${link.data})`);
    // 这里可以通过 vscode.open 打开外部链接
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://opensumi.com'));
  }
});
...
```

效果如下：

![link](https://img.alicdn.com/imgextra/i2/O1CN01abcWWB23IJBV61QhN_!!6000000007232-1-tps-1200-692.gif)

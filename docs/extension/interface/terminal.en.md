---
id: terminal
title: Terminal
slug: terminal
order: 5
---

Terminal is an important part of IDE, which can help users quickly execute system commands and file operations, etc. The following introduces some common expansion scenarios in extensions.

## Custom link provider

```ts
...
vscode.window.registerTerminalLinkProvider({
   // This method will be triggered when the mouse hovers
   provideTerminalLinks: (context, token) => {
     // context.line is the string of the current line
     const startIndex = (context.line as string).indexOf('opensumi.com');
     if (startIndex === -1) {
       return [];
     }
     // return an array, the content is all the identified links
     return [
       {
         startIndex,
         length: 'opensumi.com'. length,
         // You can return data in this object to access inside handleTerminalLink
         data: 'Example data'
       }
     ];
   },
   // This method will be triggered when the link is clicked
   handleTerminalLink: (link: any) => {
     vscode.window.showInformationMessage(`Link activated (data = ${link.data})`);
     // Here you can open external links via vscode.open
     vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://opensumi.com'));
   }
});
...
```

The effect is as follows:

![link](https://img.alicdn.com/imgextra/i2/O1CN01abcWWB23IJBV61QhN_!!6000000007232-1-tps-1200-692.gif)

---
id: 3-way-merge-editor
title: 使用 3-way 视图新交互
slug: 3-way-merge-editor
order: 1
---

## 集成方式

只需要安装 git 插件即可

如果安装 `1.68.1` 版本，则需要配置设置项 `git.experimental.mergeEditor` 为 `true`
如果安装 `1.69.0` 以上版本，则需要配置设置项 `git.mergeEditor` 为 `true`

配置完成后在 `scm` 面板的 merge change 视图直接打开冲突的文件，就能使用到 3-way 交互

## 先看看效果

![3-way](https://img.alicdn.com/imgextra/i2/O1CN010IFGBV1GreZ1rg5CB_!!6000000000676-1-tps-924-491.gif)

## 如何使用 3-way merge editor 新交互来解决代码冲突

![截屏2023-02-06 15.55.34.png](https://img.alicdn.com/imgextra/i4/O1CN01HgqlKH1DZqJZh25jd_!!6000000000231-0-tps-1500-718.jpg)

3-way merge editor 提供了更直观更丰富的代码冲突解决交互，主要由三个窗口组成

- 左侧编辑器显示当前本地磁盘文件的只读副本
- 右侧编辑器显示远程仓库传入的文件只读副本
- 中间编辑器显示两个冲突分支的共同祖先 base 分支的可读写文件，所有的解决冲突交互结果都在中间视图展示

```planttext
3-way merge editor 是借助了 git 本身的 diff3 特性，向你展示了你的代码文件**为什么**会发生冲突，并将文件的所有代码内容改动（不管这个改动有没有冲突）都展示出来。

而旧版的解决冲突，他只是把**哪里**有冲突的改动给你展示了出来，并默认将 incoming 的传入文件其他未发生冲突的地方给自动 merge 了。

所以你在 3-way 视图当中会看到，没有冲突的地方也会有交互的操作，这是必要的操作步骤
```
##### 操作步骤

1. 点击**源代码管理面板**内的冲突文件将弹出 3-way merge editor 面板
2. 要解决冲突，可以通过**操作项（接受 >> 或 忽略 x）**来决定要接收左侧（本地）还是右侧（远程仓库）的冲突代码片段，并在中间视图检查冲突解决后的代码是否符合你的预期
   1. **对于没有冲突的代码区域**

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01JipHOl1g2ykh4JpcJ_!!6000000004085-2-tps-1364-473.png)

   2. **对于有冲突的代码区域**

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01N75a2S1QHbY7VhH4W_!!6000000001951-2-tps-1393-296.png)

   3. **选择接受左侧区域的代码内容后，还想继续接受右侧区域的代码内容（相当于 accept combination）**

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01IDqxvg1Yqsz1o2a6p_!!6000000003111-2-tps-1375-309.png)

   4. **对于简单的冲突（比如，某一块代码区域左右两侧都有做修改，但这个修改并不会导致冲突，此时就会提供一键合并更改的操作）**

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01NjznPQ23CoPxApQM9_!!6000000007220-2-tps-1377-301.png)

3. 解决冲突完成点击**应用更改**保存最终结果
4. 源代码管理面板中点击`+`按钮存储更改内容

![截屏2023-02-03 17.34.54.png](https://img.alicdn.com/imgextra/i3/O1CN01zop9PJ26BqQVmqPb0_!!6000000007624-0-tps-1500-610.jpg)

5. 提交
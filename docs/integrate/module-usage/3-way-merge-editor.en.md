---
id: 3-way-merge-editor
title: Using 3-way view new interaction
slug: 3-way-merge-editor
order: 1
---

## Integration Method

Just install the Git plugin.

If you are installing version 1.68.1, you need to configure the setting git.experimental.mergeEditor to true.
If you are installing version 1.69.0 or later, you need to configure the setting git.mergeEditor to true.

After configuration is complete, you can directly open the conflicting file in the merge change view of the scm panel to use the3-way interaction.

## First, let's take a look at the effect

![3-way](https://img.alicdn.com/imgextra/i2/O1CN010IFGBV1GreZ1rg5CB_!!6000000000676-1-tps-924-491.gif)

## How to use3-way merge editor new interaction to solve code conflicts

![截屏2023-02-06 15.55.34.png](https://img.alicdn.com/imgextra/i4/O1CN01HgqlKH1DZqJZh25jd_!!6000000000231-0-tps-1500-718.jpg)

3-way merge editor provides a more intuitive and rich code conflict resolution interaction, mainly composed of three windows:

- The left editor displays a read-only copy of the current local disk file.
- The right editor displays a read-only copy of the file passed in from the remote repository.
- The middle editor displays the read-write file of the common ancestor base branch of the two conflicting branches. All the results of the conflict resolution interaction are displayed in the middle view.

```planttext
3-way merge editor uses Git's own diff3 feature to show you why your code file conflicts, and displays all code changes to the file (whether or not these changes are in conflict).

In contrast, the old version of conflict resolution only shows you where there are conflicting changes, and automatically merges incoming files in other areas that have not experienced conflicts.

Therefore, in the3-way view, you will see interactive operations even in areas without conflicts. These are necessary operating steps.
```
## Operation steps

### 1. Click on the conflicting file within the source code management panel to pop up the3-way merge editor panel.

### 2. To resolve conflicts, you can decide whether to accept the conflicting code fragments on the left (local) or right (remote repository) by using the operation options (accept >> or ignore x), and check whether the code after conflict resolution in the middle view meets your expectations.

#### a. **For code areas without conflicts**

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01JipHOl1g2ykh4JpcJ_!!6000000004085-2-tps-1364-473.png)

#### b. **For code areas with conflicts**

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01N75a2S1QHbY7VhH4W_!!6000000001951-2-tps-1393-296.png)

#### c. **If you choose to accept the code content on the left, but still want to accept the code content on the right (equivalent to accepting the combination)**

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01IDqxvg1Yqsz1o2a6p_!!6000000003111-2-tps-1375-309.png)

#### d. **For simple conflicts (for example, if a code area has been modified on both the left and right sides, but this modification does not cause a conflict, one-click merge changes will be provided)**

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01NjznPQ23CoPxApQM9_!!6000000007220-2-tps-1377-301.png)

### 3. After resolving the conflict, click apply changes to save the final result.
### 4. In the source code management panel, click the + button to store the changed content.

![截屏2023-02-03 17.34.54.png](https://img.alicdn.com/imgextra/i3/O1CN01zop9PJ26BqQVmqPb0_!!6000000007624-0-tps-1500-610.jpg)

### 5. Commit done.
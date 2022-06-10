---
id: decoration
title: Decoration Module
slug: decoration
---

The FileDecoration module is used to register, manag or distribute filename related `Decoration` services. 

## Basic Concepts

Decoration ——a decorator, a means to to "decorate" the file tree style. The following figure is a common scenario that shows Git project special decoration

![git-sample](https://img.alicdn.com/imgextra/i4/O1CN0102WFi9267ik1JKMeC_!!6000000007615-2-tps-1038-824.png)

## User Guide

### Register Decorations

#### `registerDecorationsProvider`

```ts
  registerDecorationsProvider(provider: IDecorationsProvider): IDisposable;
```

The following code provides the underlying data structure to register DecorationsProvider.

```ts
interface IDecorationData {
  /**
   * weight
   */
  readonly weight?: number;
  /**
   * Decoration color
   */
  readonly color?: ColorIdentifier;
  /**
   * Decoration string
   */
  readonly letter?: string;
  /**
   * Decoration tooltip
   */
  readonly tooltip?: string;
  /**
   * Decoration bubble? Decoration of similar files pass to folder?
   */
  readonly bubble?: boolean;
}
```

##### Use Case

```ts
class SampleDecorationsProvider implements IDecorationsProvider {
  readonly label = 'sample';

  readonly onDidChangeEmitter: Emitter<Uri[]> = new Emitter();

  get onDidChange() {
    return this.onDidChangeEmitter.event;
  }

  provideDecorations(resource: Uri): IDecorationData | undefined {
    if (file.scheme !== 'file') {
      return undefined;
    }

    return {
      letter: '😸',
      color: 'cat.smileForeground',
      tooltip: localize('cat.smile'),
      weight: -1,
      bubble: false
    } as IDecorationData;
  }
}
```

### Minotor Decorations Changes

#### `onDidChangeDecorations`

```ts
  readonly onDidChangeDecorations: Event<IResourceDecorationChangeEvent>;
```

Event distribution is performed for the file name Decoration change event

##### Use Case

```ts
this.decorationsService.onDidChangeDecorations(() => {
  // some listener
});
```

### Get the File Decorator

#### `getDecoration`

```ts
getDecoration(uri: Uri, includeChildren: boolean, overwrite?: IDecorationData): IDecoration | undefined;
```

Obtain the result of the current file's Decoration by means of getting the uri, or return "undefined" if it doesn't get the Decoration.

##### Use Case

```ts
this.decorationsService.getDecoration(uri, true);
```

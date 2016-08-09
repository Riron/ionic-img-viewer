# Image viewer

Ionic 2 plugin providing a Twitter inspired experience to visualize pictures.

![Plugin preview](https://raw.githubusercontent.com/riron/ionic-img-viewer/master/demo/img-viewer2.gif)

## Demo

[link to plunkr]

## Installation

Make sure you have Ionic and Angular installed.

```
npm install --save ionic-img-viewer
```

## Usage

Import the image viewer directive in your component, and add the `imageViewer` property to the pictures :

```typescript
import { ImageViewerDirective } from 'ionic-img-viewer/ionic-img-viewer';


@Component({
  template: `<img [src]="url" imageViewer />`,
  directives: [ImageViewerDirective]
})
class MyComponent {

}
```

# Contributing

Please read contributing guidelines here.
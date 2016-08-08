# Image viewer

Ionic 2 plugin providing a Twitter inspired experience to visualize pictures.

![Plugin preview](https://raw.githubusercontent.com/username/projectname/branch/path/to/img.png)

## Demo

[link to plunkr]

## Installation

Make sure you have Ionic and Angular installed.

```
npm install TODO
```

## Usage

Import the image viewer directive in your component, and add the `imageViewer` property to the pictures :

```typescript
import {ImageViewerDirective} from '../image-viewer/image-viewer.directive';


@Component({
  template: `<img [src]="url" imageViewer />`,
  directives: [ImageViewerDirective]
})
class MyComponent {

}
```

# Contributing

Please read contributing guidelines here.
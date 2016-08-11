# Image viewer for Ionic2

Ionic 2 plugin providing a Twitter inspired experience to visualize pictures.

![Plugin preview](https://raw.githubusercontent.com/riron/ionic-img-viewer/master/demo/img-viewer2.gif)

## Features

- Tap on the pic to see it fullscreen
- Slide up/down to close the view
- Tap on the navigation arrow to close the view
- Double tap on the pic when open to zoom

## Demo

[Demo on Plunkr](http://plnkr.co/edit/8f5MubWSohI3Q9DfKX9S?p=preview)

## Installation

Make sure you have Ionic and Angular installed.

```
npm install --save ionic-img-viewer
```

## Usage

Import the image viewer directive in your component.

```typescript
import { ImageViewerDirective } from 'ionic-img-viewer';


@Component({
  template: `<img [src]="url" imageViewer />`,
  directives: [ImageViewerDirective]
})
class MyComponent {

}
```

And add the `imageViewer` property to the pictures.

```html
<img src="IMAGE_URL" imageViewer />
```

# Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

Thank you, [contributors]!

[contributors]: https://github.com/Riron/ionic-img-viewer/graphs/contributors
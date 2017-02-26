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

**For Ionic 2 RC.0 and later:**

```typescript
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  imports: [
    IonicImageViewerModule
  ]
})
export class AppModule {}
```

## Usage

Add the `imageViewer` property to the pictures.

```html
<img src="IMAGE_URL" imageViewer />
```

If you use thumbnails and want to display bigger images, you can use it like so :

```html
<img src="IMAGE_URL" imageViewer="OTHER_IMAGE_URL" />
```

However, if `OTHER_IMAGE_URL` is not preloaded, the animation might suffer. Indeed there will be no ready image to make the transition (it might blink and you'll not get the smooth transition effet while opening).
So try to cache your image before the call if you use it that way.

# Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

Thank you, [contributors]!

[contributors]: https://github.com/Riron/ionic-img-viewer/graphs/contributors

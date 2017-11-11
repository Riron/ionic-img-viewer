# Image viewer for Ionic 2+

[![NPM](https://nodei.co/npm/ionic-img-viewer.png?downloads=true)](https://nodei.co/npm/ionic-img-viewer/)

Ionic 2 plugin providing a Twitter inspired experience to visualize pictures.

![Plugin preview](https://raw.githubusercontent.com/riron/ionic-img-viewer/master/demo/img-viewer2.gif)

## Features

- Tap on the pic to see it fullscreen
- Slide up/down to close the view
- Tap on the navigation arrow to close the view
- Double tap / pinch the pic when open to zoom

## Demo

[Demo on Plunkr](http://embed.plnkr.co/isbTOupNw51JjaaksbSE/)

## Installation

Make sure you have Ionic and Angular installed.

```
npm install --save ionic-img-viewer
```

**Check you peer-dependencies warnings after `npm install` to make sure you are using a version in accordance to your Ionic version.**

### For Ionic 2 RC.0 and later:

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


### As a directive

Add the `imageViewer` property to the image element.

```html
<img src="IMAGE_URL" imageViewer />
```

If you use thumbnails and want to display bigger images, you can use it like so :

```html
<img src="IMAGE_URL" imageViewer="OTHER_IMAGE_URL" />
```

However, if `OTHER_IMAGE_URL` is not preloaded, the animation might suffer. There will be no loaded image to display in order to have the nice and smooth transition, and you might see the image blinking while opening it.

So try to cache your image before the call if you use it that way.

### React to close event

If you need to, you can attach a callback to `close` event, fired right after the image viewer element has been closed :

```html
<img src="IMAGE_URL" imageViewer (close)="callbackAfterImageViewerCloses()" />
```

### Programmatic usage

If you don't want to use the directive, you can create an instance of the ImageViewer yourself and trigger the presentation whenever you want.

```html
<img src="IMAGE_URL" #myImage (click)="presentImage(myImage)" />
```

```typescript
import { ImageViewerController } from 'ionic-img-viewer';

export class MyPage {
  _imageViewerCtrl: ImageViewerController;

  constructor(imageViewerCtrl: ImageViewerController) {
    this._imageViewerCtrl = imageViewerCtrl;
  }

  presentImage(myImage) {
    const imageViewer = this._imageViewerCtrl.create(myImage);
    imageViewer.present();

    setTimeout(() => imageViewer.dismiss(), 1000);
    imageViewer.onDidDismiss(() => alert('Viewer dismissed'));
  }
}
```

As a second argument to the `create(imageElement, config)` method, you can pass an object with the following options.

| Options               | Type     | Description  |
| ---------------       |:---------| :------------|
| fullResImage          | string   | A full resolution image to display instead of the original image when open. Defaults to null |
| onCloseCallback       | Function | Function to be called when the ImageViewer quits. Defaults to null |
| enableBackdropDismiss | boolean  | Boolean to enable dismiss when clicking on the back drop. Defaults to false |

# Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

Thank you, [contributors]!

[contributors]: https://github.com/Riron/ionic-img-viewer/graphs/contributors

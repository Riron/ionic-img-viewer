import { Injectable } from '@angular/core';
import { App, Config, DeepLinker } from 'ionic-angular';

import { ImageViewerOptions, ImageViewer } from './image-viewer';
import { ImageViewerComponent } from './image-viewer.component';

@Injectable()
export class ImageViewerController {

  constructor(private _app: App, public config: Config, private deepLinker: DeepLinker) { }

  /**
   * Create a image-viewer instance to display. See below for options.
   *
   * @param {object} imageElement The image element
   * @param {object} opts ImageViewer options
   */
  create(imageElement: any,  opts: ImageViewerOptions = {}) {
    const image = imageElement.src;
    const position = imageElement.getBoundingClientRect();

    const options = { image, position, ...opts };

    return new ImageViewer(this._app, ImageViewerComponent, options, this.config, this.deepLinker);
  }
}
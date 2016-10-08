import {ViewController} from 'ionic-angular';

import {ImageViewerComponent} from './image-viewer.component';

export class ImageViewer extends ViewController {

	constructor(opts: ImageViewerOptions = {}) {
		super(ImageViewerComponent, opts);
	}

	getTransitionName(direction: string) {
		let key = 'image-viewer-' + (direction === 'back' ? 'leave' : 'enter');
		return key;
	}

	static create(opts: ImageViewerOptions = {}) {
		return new ImageViewer(opts);
	}

}

export interface ImageViewerOptions {
	enableBackdropDismiss?: boolean;
	image?: string;
	position?: ClientRect;
}

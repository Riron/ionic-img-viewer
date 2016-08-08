import {ViewController} from 'ionic-angular';

import {ImageViewerComponent} from './image-viewer.component';

export class ImageViewer extends ViewController {

	constructor(opts: ImageViewerOptions = {}) {
		super(ImageViewerComponent, opts);

		// by default, it should not fire lifecycle events of other views,
		// the current active view should not fire its lifecycle events
		// because it's not conceptually leaving
		this.fireOtherLifecycles = false;
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

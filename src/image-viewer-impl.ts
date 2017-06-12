import { App, Config, ViewController, NavOptions } from 'ionic-angular';

import { ImageViewerOptions } from './image-viewer';
import { ImageViewerEnter, ImageViewerLeave } from './image-viewer-transitions';

export class ImageViewerImpl extends ViewController {

	constructor(private app: App, component: any, opts: ImageViewerOptions = {}, config: Config) {
		super(component, opts);

		config.setTransition('image-viewer-enter', ImageViewerEnter);
		config.setTransition('image-viewer-leave', ImageViewerLeave);

		this.didLeave.subscribe(() => opts.onCloseCallback && opts.onCloseCallback());
	}

	getTransitionName(direction: string) {
		let key = 'image-viewer-' + (direction === 'back' ? 'leave' : 'enter');
		return key;
	}

	present(navOptions: NavOptions = {}) {
		return this.app.present(this, navOptions);
	}
}

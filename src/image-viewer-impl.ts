import { ImageViewerEnter, ImageViewerLeave } from './image-viewer-transitions';
import { App, Config, ViewController, NavOptions } from 'ionic-angular';

export class ImageViewerImpl extends ViewController {

	constructor(private app: App, component: any, opts: ImageViewerOptions = {}, config: Config) {
		super(component, opts);

		config.setTransition('image-viewer-enter', ImageViewerEnter);
		config.setTransition('image-viewer-leave', ImageViewerLeave);
	}

	getTransitionName(direction: string) {
		let key = 'image-viewer-' + (direction === 'back' ? 'leave' : 'enter');
		return key;
	}

	present(navOptions: NavOptions = {}) {
		return this.app.present(this, navOptions);
	}
}

export interface ImageViewerOptions {
	enableBackdropDismiss?: boolean;
	image?: string;
	position?: ClientRect;
}

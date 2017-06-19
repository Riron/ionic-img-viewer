import { App, Config, NavOptions, ViewController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { ImageViewerOptions } from './image-viewer';
import { ImageViewerEnter, ImageViewerLeave } from './image-viewer-transitions';
import { ImageViewerComponent } from "./image-viewer.component";

export class ImageViewerImpl extends ViewController {

	constructor(private app: App, component: ImageViewerComponent, opts: ImageViewerOptions = {}, config: Config) {
		super(component, opts);

		config.setTransition('image-viewer-enter', ImageViewerEnter);
		config.setTransition('image-viewer-leave', ImageViewerLeave);

		this.didLeave.subscribe(() => opts.onCloseCallback && opts.onCloseCallback());

		this.willEnter.subscribe(() => this.handleHighResImageLoad(opts.fullResImage));
	}

	private handleHighResImageLoad(fullResImage){
		if (!fullResImage) {
			return;
		}

		const image = new Image();
		image.src = fullResImage;

		if (!image.complete) {
			const onLoadObservable = Observable.create(obs => {
				image.onload = () => {
					obs.next(image);
					obs.complete();
				}
			});

			// We want the animation to finish before replacing the pic
			// as the calculation has been done with the smaller image
			Observable.zip(onLoadObservable, this.didEnter)
				.subscribe(() => this.instance.updateImageSrc(fullResImage));

		} else {
			this.instance.updateImageSrc(fullResImage)
		}
	}

	getTransitionName(direction: string) {
		let key = 'image-viewer-' + (direction === 'back' ? 'leave' : 'enter');
		return key;
	}

	present(navOptions: NavOptions = {}) {
		return this.app.present(this, navOptions);
	}
}

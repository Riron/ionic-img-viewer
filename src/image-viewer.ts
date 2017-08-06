import { DeepLinker, App, Config } from 'ionic-angular';
import { Overlay } from 'ionic-angular/navigation/overlay';
import { OverlayProxy } from 'ionic-angular/navigation/overlay-proxy';

import { ImageViewerImpl } from './image-viewer-impl';
import { ImageViewerComponent } from './image-viewer.component';

export class ImageViewer extends OverlayProxy {

	constructor(app: App, component: typeof ImageViewerComponent, private opts: ImageViewerOptions = {}, config: Config, deepLinker: DeepLinker) {
		super(app, component, config, deepLinker);
	}

	getImplementation(): Overlay {
		return new ImageViewerImpl(this._app, this._component, this.opts, this._config);
	}
}

export interface ImageViewerOptions {
	enableBackdropDismiss?: boolean;
	image?: string;
	fullResImage?: string
	position?: ClientRect;
	onCloseCallback?: Function;
}

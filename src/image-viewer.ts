import { DeepLinker, App, Config } from 'ionic-angular';
import { Overlay } from "ionic-angular/navigation/overlay";
import { OverlayProxy } from "ionic-angular/navigation/overlay-proxy";

import { ImageViewerImpl } from './image-viewer-impl';

export class ImageViewer extends OverlayProxy {

	constructor(app: App, component: any, private opts: ImageViewerOptions = {}, config: Config, deepLinker: DeepLinker) {
		super(app, component, config, deepLinker);
	}

	getImplementation(): Overlay {
		return new ImageViewerImpl(this._app, this._component, this.opts, this._config);
	}
}

export interface ImageViewerOptions {
	enableBackdropDismiss?: boolean;
	image?: string;
	position?: ClientRect;
}

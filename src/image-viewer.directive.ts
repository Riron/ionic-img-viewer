import { App, Config, DeepLinker } from 'ionic-angular';
import { ElementRef, HostListener, Directive, Input } from '@angular/core';

import { ImageViewerComponent } from './image-viewer.component';
import { ImageViewer } from './image-viewer';

@Directive({
	selector: '[imageViewer]'
})
export class ImageViewerDirective {

	@Input('imageViewer') src: string;

	constructor(private _app: App, private _el: ElementRef, private config: Config, private deepLinker: DeepLinker) { }

	@HostListener('click', ['$event']) onClick(event: Event): void {
		event.stopPropagation();

		const position = this._el.nativeElement.getBoundingClientRect();
		const options = { image: this.src || this._el.nativeElement.src, position: position };

		const imageViewer =  new ImageViewer(this._app, ImageViewerComponent, options, this.config, this.deepLinker);
		imageViewer.present();
	}
}

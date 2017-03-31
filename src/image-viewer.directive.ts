import { App } from 'ionic-angular';
import { ElementRef, HostListener, Directive, Input } from '@angular/core';

import { ImageViewer } from './image-viewer';

@Directive({
	selector: '[imageViewer]'
})
export class ImageViewerDirective {

	@Input('imageViewer') src: string;

	constructor(
		private _app: App,
		private _el: ElementRef
	) { }

	@HostListener('click', ['$event']) onClick(event: Event): void {
		event.stopPropagation();

		let position = this._el.nativeElement.getBoundingClientRect();

		let imageViewer = ImageViewer.create({image: this.src || this._el.nativeElement.src, position: position});
		this._app.present(imageViewer, {});
	}
}

import {App} from 'ionic-angular';
import {ElementRef, HostListener, Directive} from '@angular/core';

import {ImageViewer} from './image-viewer';

@Directive({
	selector: '[imageViewer]'
})
export class ImageViewerDirective {

	constructor(
		private _app: App,
		private _el: ElementRef
	) { }

	@HostListener('click', ['$event.target'])
	onClick($event): void {
		let position = this._el.nativeElement.getBoundingClientRect();

		let imageViewer = ImageViewer.create({image: this._el.nativeElement.src, position: position});
		this._app.present(imageViewer, {});
	}
}
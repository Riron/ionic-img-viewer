import { ImageViewerCarouselComponent } from './image-viewer-carousel.component'
import { ImageViewer } from './image-viewer';

import { App } from 'ionic-angular';
import { ElementRef, HostListener, Directive, Host, Optional, Inject, forwardRef } from '@angular/core';

@Directive({
	selector: '[imageViewer]'
})
export class ImageViewerDirective {

	constructor(
		private _app: App,
		private _el: ElementRef,
		@Optional() @Host() @Inject(forwardRef(() => ImageViewerCarouselComponent)) private carousel
	) { }

	getNativeElement() {
		return this._el.nativeElement;
	}

	@HostListener('click', ['$event.target'])
	onClick($event): void {
		if (this.carousel) {
			this.carousel.onClick(this);

		} else {
			let position = this._el.nativeElement.getBoundingClientRect();

			let imageViewer = ImageViewer.create({images: [this._el.nativeElement.src], position: position});
			this._app.present(imageViewer, {});
		}
	}
}

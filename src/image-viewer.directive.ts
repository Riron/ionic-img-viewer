import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { ImageViewerComponent } from './image-viewer.component';
import { ImageViewer } from './image-viewer';
import { ImageViewerController } from './image-viewer.controller';

@Directive({
	selector: '[imageViewer]'
})
export class ImageViewerDirective {

	@Input('imageViewer') src: string;
	@Output() close = new EventEmitter();

	constructor(
		private _el: ElementRef,
		private imageViewerCtrl: ImageViewerController
	) { }

	@HostListener('click', ['$event']) onClick(event: Event): void {
		event.stopPropagation();

		const element = this._el.nativeElement;
		const onCloseCallback = () => this.close.emit();

		const imageViewer = this.imageViewerCtrl.create(element, { fullResImage: this.src, onCloseCallback });
		imageViewer.present();
	}
}

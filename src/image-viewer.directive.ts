import { App, Config, DeepLinker } from 'ionic-angular';
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { ImageViewerComponent } from './image-viewer.component';
import { ImageViewer } from './image-viewer';

@Directive({
	selector: '[imageViewer]'
})
export class ImageViewerDirective {

	@Input('imageViewer') src: string;
	@Output() onClose = new EventEmitter();

	constructor(private _app: App, private _el: ElementRef, private config: Config, private deepLinker: DeepLinker) { }

	@HostListener('click', ['$event']) onClick(event: Event): void {
		event.stopPropagation();

		const image = this.src || this._el.nativeElement.src;
		const position = this._el.nativeElement.getBoundingClientRect();
		const onCloseCallback = () => this.onClose.emit()

		const options = { image, position, onCloseCallback };

		const imageViewer =  new ImageViewer(this._app, ImageViewerComponent, options, this.config, this.deepLinker);
		imageViewer.present();
	}
}

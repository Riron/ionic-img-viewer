import { App } from 'ionic-angular';
import { Component, ContentChildren, Input, QueryList, ViewChildren, ViewContainerRef, forwardRef } from '@angular/core';
import { ImageViewerDirective } from './image-viewer.directive';
import { ImageViewer } from './image-viewer';

@Component({
	selector: 'image-viewer-carousel',
	template: `
		<div [ngClass]="cssClass">
			<ng-content></ng-content>
		</div>
	`
})
export class ImageViewerCarouselComponent {
	@Input() cssClass: string;
	@ContentChildren(forwardRef(() => ImageViewerDirective)) imageViewerItems: QueryList<ImageViewerDirective>;

	constructor(private _app: App) {}

	onClick(item): void {
		const clickedItemPosition = item.getNativeElement().getBoundingClientRect();
		const images = this.imageViewerItems.map(i => i.getNativeElement().src);

		const imageViewer = ImageViewer.create({images: images, position: clickedItemPosition});
		this._app.present(imageViewer, {});
	}
}

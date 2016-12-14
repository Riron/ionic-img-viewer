import { ImageViewerSliderGesture } from './image-viewer-slider-gesture';
import { NavController, NavParams, Transition } from 'ionic-angular';
import { Ion } from 'ionic-angular/components/ion';
import { PanGesture } from 'ionic-angular/gestures/drag-gesture';
import { GestureController } from 'ionic-angular/gestures/gesture-controller';
import { Config } from 'ionic-angular/config/config';
import { ElementRef, Renderer, Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { ImageViewerGesture } from './image-viewer-gesture';
import { ImageViewerEnter, ImageViewerLeave } from './image-viewer-transitions';

const DOUBLE_TAP_INTERVAL = 300;

@Component({
	selector: 'image-viewer',
	template: `
		<ion-header>
			<ion-navbar>
			</ion-navbar>
		</ion-header>

		<ion-backdrop></ion-backdrop>

		<div class="image-wrapper">
			<div class="image">
				<template ngFor let-imageUrl [ngForOf]="imageUrls">
					<img [src]="imageUrl" (click)="onImageClick()" (dblclick)="onImageDblClick()" tappable />
				</template>
			</div>
		</div>
	`
})
export class ImageViewerComponent extends Ion implements OnInit, OnDestroy {
	public imageUrls: Array<SafeUrl>;

	private dragGesture: PanGesture;
	private nextSlideGesture: PanGesture;
	private dblClickInAction: boolean;
	public isZoomed: boolean;

	constructor(
		public _gestureCtrl: GestureController,
		public elementRef: ElementRef,
		private _nav: NavController,
		private _zone: NgZone,
		private renderer: Renderer,
		_navParams: NavParams,
		_config: Config,
		_sanitizer: DomSanitizer
	) {
		super(_config, elementRef, renderer);

		const urls = _navParams.get('images');
		this.imageUrls = urls.map(url => _sanitizer.bypassSecurityTrustUrl(url));
	}

	ngOnInit() {
		let gestureCallBack = () => this._nav.pop();
		this._zone.runOutsideAngular(() => {
			this.dragGesture = new ImageViewerGesture(this, gestureCallBack);
			this.nextSlideGesture = new ImageViewerSliderGesture(this, null);
		});
	}

	ngOnDestroy() {
		this.dragGesture && this.dragGesture.destroy();
		this.nextSlideGesture && this.nextSlideGesture.destroy();
	}

	onImageClick() {
		if (this.dblClickInAction) {
			this.onImageDblClick();
		} else {
			this.dblClickInAction = true;
			setTimeout(() => this.dblClickInAction = false, DOUBLE_TAP_INTERVAL);
		}
	}

	onImageDblClick() {
		this.isZoomed = !this.isZoomed;
		this.renderer.setElementClass(this.getNativeElement(), 'zoom', this.isZoomed);
	}
}

import {
	DomController,
	NavController,
	NavParams,
	Transition,
	Ion,
	PanGesture,
	Gesture,
	GestureController,
	Config,
	Platform
} from 'ionic-angular';
import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from 'ionic-angular/gestures/hammer';
import { ElementRef, Renderer, Component, OnInit, OnDestroy, AfterViewInit, NgZone, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { ImageViewerGesture } from './image-viewer-gesture';
import { ImageViewerEnter, ImageViewerLeave } from './image-viewer-transitions';

const DOUBLE_TAP_INTERVAL = 300;
const MAX_SCALE = 2;

@Component({
	selector: 'image-viewer',
	template: `
		<ion-header>
			<ion-navbar>
			</ion-navbar>
		</ion-header>

		<ion-backdrop></ion-backdrop>

		<div class="image-wrapper">
			<div class="image" #imageContainer>
				<img [src]="imageUrl" (click)="onImageClick()" tappable />
			</div>
		</div>
	`
})
export class ImageViewerComponent extends Ion implements OnInit, OnDestroy, AfterViewInit {
	public imageUrl: SafeUrl;

	private dragGesture: PanGesture;

	@ViewChild('imageContainer') imageContainer;
	private pinchGesture: Gesture;
	private adjustScale = 1;
	private adjustDeltaX = 0;
	private adjustDeltaY = 0;

	private currentScale: number = 1;
	private currentDeltaX = null;
	private currentDeltaY = null;

	private dblClickInAction: boolean;
	public isZoomed: boolean;

	constructor(
		public _gestureCtrl: GestureController,
		public elementRef: ElementRef,
		private _nav: NavController,
		private _zone: NgZone,
		private renderer: Renderer,
		private domCtrl: DomController,
		private platform: Platform,
		_navParams: NavParams,
		_config: Config,
		_sanitizer: DomSanitizer
	) {
		super(_config, elementRef, renderer);

		const url = _navParams.get('image');
		this.imageUrl = _sanitizer.bypassSecurityTrustUrl(url);
	}

	ngOnInit() {
		let gestureCallBack = () => this._nav.pop();
		this._zone.runOutsideAngular(() => this.dragGesture = new ImageViewerGesture(this.platform, this, this.domCtrl, gestureCallBack));
	}

	ngAfterViewInit() {
		// imageContainer is set after the view has been initialized
		this._zone.runOutsideAngular(() => {
			this.pinchGesture = new Gesture(this.imageContainer.nativeElement, {direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL});
			this.pinchGesture.listen();
			this.pinchGesture.on('pinch', (e) => this.onPinch(e));
			this.pinchGesture.on('pinchend', (e) => this.onPinchEnd(e));
			this.pinchGesture.on('pan', (e) => this.onPan(e));
		});
	}

	ngOnDestroy() {
		this.dragGesture && this.dragGesture.destroy();
		this.pinchGesture && this.pinchGesture.destroy();
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
		// Clear eventual transforms caused by a previous pinch
		this.imageContainer.nativeElement.style.transform = '';

		this.isZoomed = !this.isZoomed;

		if (this.isZoomed) {
			this.currentScale === 2;
		}

		this.renderer.setElementClass(this.imageContainer.nativeElement, 'zoom', this.isZoomed);
	}

	onPinch(event) {
		this.dragGesture.abort(event);

		this.currentScale = Math.max(1, Math.min(MAX_SCALE, this.adjustScale * event.scale));

		if (this.currentScale === 1) {
			this.currentDeltaX = 0;
			this.currentDeltaY = 0;
		} else {
			this.currentDeltaX = this.adjustDeltaX + (event.deltaX / this.currentScale);
			this.currentDeltaY = this.adjustDeltaY + (event.deltaY / this.currentScale);
		}

		this.setImageContainerTransform();
	}

	onPan(event) {
		if (this.isZoomed) {
			this.currentDeltaX = this.adjustDeltaX + event.deltaX;
			this.currentDeltaY = this.adjustDeltaY + event.deltaY;

			this.setImageContainerTransform();
		}
	}

	onPinchEnd(event) {
		this.isZoomed = (this.currentScale !== 1);

		// Saving the final transforms for adjustment next time the user interacts.
		this.adjustScale = this.currentScale;
		this.adjustDeltaX = this.currentDeltaX;
		this.adjustDeltaY = this.currentDeltaY;
	}

	setImageContainerTransform() {
		const transforms = [];
		transforms.push(`scale(${this.currentScale})`);
		transforms.push(`translate(${this.currentDeltaX}px, ${this.currentDeltaY}px)`);

		this.renderer.setElementStyle(this.imageContainer.nativeElement, 'transform', transforms.join(' '));
	}
}

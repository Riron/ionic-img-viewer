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
	private currentScale: number = 1;
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
			this.pinchGesture = new Gesture(this.imageContainer.nativeElement);
			this.pinchGesture.listen();
			this.pinchGesture.on('pinch', (e) => this.onPinch(e));
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
		this.renderer.setElementClass(this.imageContainer.nativeElement, 'zoom', this.isZoomed);
	}

	onPinch(event) {
		console.log(event, this.currentScale)
		this.currentScale = Math.max(MAX_SCALE, this.currentScale * event.scale);
		this.imageContainer.nativeElement.style.transform = `scale(${this.currentScale})`;
	}
}

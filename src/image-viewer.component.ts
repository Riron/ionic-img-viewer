import {NavController, NavParams, Transition} from 'ionic-angular';
import {Ion} from 'ionic-angular/components/ion';
import {PanGesture} from 'ionic-angular/gestures/drag-gesture';
import {GestureController} from 'ionic-angular/gestures/gesture-controller';
import {Config} from 'ionic-angular/config/config';
import {ElementRef, Renderer, Component, OnInit, OnDestroy, NgZone} from '@angular/core';

import {ImageViewerGesture} from './image-viewer-gesture';
import {ImageViewerEnter, ImageViewerLeave} from './image-viewer-transitions';

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
				<img [src]="d.image" (click)="onImageClick()" />
			</div>
		</div>
	`
})
export class ImageViewerComponent extends Ion implements OnInit, OnDestroy {
	public d: any;
	private created: number;

	private computedHeight: number;
	private computedWidth: number;

	private dragGesture: PanGesture;
	private dblClickInAction: boolean;
	public isZoomed: boolean;

	constructor(
		public _gestureCtrl: GestureController,
		public elementRef: ElementRef,
		private _nav: NavController,
		private _zone: NgZone,
		private renderer: Renderer,
		params: NavParams,
		config: Config
	) {
		super(config, elementRef, renderer);

		this.d = params.data;
		this.created = Date.now();

		if (this.d.cssClass) {
			this.d.cssClass.split(' ').forEach(cssClass => {
				renderer.setElementClass(this.getNativeElement(), cssClass, true);
			});
		}
	}

	ngOnInit() {
		let gestureCallBack = () => this._nav.pop();
		this._zone.runOutsideAngular(() => this.dragGesture = new ImageViewerGesture(this, gestureCallBack));
	}

	ngOnDestroy() {
		this.dragGesture && this.dragGesture.destroy();
	}

	onImageClick() {
		if (this.dblClickInAction) {
			this.isZoomed = !this.isZoomed;
			this.renderer.setElementClass(this.getNativeElement(), 'zoom', this.isZoomed);
		} else {
			this.dblClickInAction = true;
			setTimeout(() => this.dblClickInAction = false, DOUBLE_TAP_INTERVAL);
		}
	}
}

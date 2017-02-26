import { Renderer } from '@angular/core';
import { Animation, DomController, Gesture, Platform } from 'ionic-angular';
import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from 'ionic-angular/gestures/hammer';

import { ImageViewerComponent } from './image-viewer.component';

const MAX_SCALE = 2;

export class ImageViewerZoomGesture extends Gesture {
	private adjustScale = 1;
	private adjustDeltaX = 0;
	private adjustDeltaY = 0;

	private currentScale = 1;
	private currentDeltaX = 0;
	private currentDeltaY = 0;

	constructor(private component: ImageViewerComponent, element: any,  private platform: Platform, private renderer: Renderer) {
		super(element.nativeElement);

		// Force both directions after super to avoid override allowing only one direction
		this.options({ direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL });

		this.listen();
		this.on('pinch', (e) => this.onPinch(e));
		this.on('pinchend', (e) => this.onPinchEnd(e));
		this.on('pan', (e) => this.onPan(e));
		this.on('panend', (e) => this.onPanEnd(e));
		this.on('doubletap', (e) => this.onDoubleTap(e));
	}

	onPinch(event) {
		this.component.dragGesture.abort(event);

		this.currentScale = Math.max(1, Math.min(MAX_SCALE, this.adjustScale * event.scale));

		this.currentDeltaX = this.adjustDeltaX + (event.deltaX / this.currentScale);
		this.currentDeltaY = this.adjustDeltaY + (event.deltaY / this.currentScale);

		this.setImageContainerTransform();
	}

	onPinchEnd(event) {
		this.component.isZoomed = (this.currentScale !== 1);

		if (!this.component.isZoomed) {

			new Animation(this.platform, this.element)
				.fromTo('translateX', `${this.currentDeltaX}px`, '0')
				.fromTo('translateY', `${this.currentDeltaY}px`, '0')
				.easing('ease-in')
				.duration(50)
				.play();

			this.currentDeltaX = 0;
			this.currentDeltaY = 0;
		}

		// Saving the final transforms for adjustment next time the user interacts.
		this.adjustScale = this.currentScale;
		this.adjustDeltaX = this.currentDeltaX;
		this.adjustDeltaY = this.currentDeltaY;
	}

	onPan(event) {
		if (!this.component.isZoomed) {
			return;
		}

		this.currentDeltaX = Math.floor(this.adjustDeltaX + event.deltaX);
		this.currentDeltaY = Math.floor(this.adjustDeltaY + event.deltaY);

		this.setImageContainerTransform();
	}

	onPanEnd(event) {
		if (!this.component.isZoomed) {
			return;
		}

		const imageWidth = this.element.offsetWidth;
		const imageHeight = this.element.offsetHeight;

		const isOverOnX = (this.currentDeltaX > imageWidth) || (this.currentDeltaX < -imageWidth);
		const isOverOnY = (this.currentDeltaY < -imageHeight) || (this.currentDeltaY > imageHeight);

		if (isOverOnX || isOverOnY) {
			const correctedX = Math.min(imageWidth, Math.max(this.currentDeltaX, -imageWidth));
			const correctedY = Math.min(imageHeight, Math.min(this.currentDeltaX, -imageHeight));

			new Animation(this.platform, this.element)
				.fromTo('translateX', `${this.currentDeltaX}px`, `${correctedX}px`)
				.fromTo('translateY', `${this.currentDeltaY}px`, `${correctedY}px`)
				.fromTo('scale', this.currentScale, this.currentScale)
				.easing('ease-in')
				.duration(50)
				.play();

			this.currentDeltaX = correctedX;
			this.currentDeltaY = correctedY;
		}

		this.adjustDeltaX = this.currentDeltaX;
		this.adjustDeltaY = this.currentDeltaY;
	}

	onDoubleTap(event) {
		this.component.isZoomed = !this.component.isZoomed;
		if (this.component.isZoomed) {
			this.currentScale = MAX_SCALE;
		} else {
			this.currentScale = 1;

			this.adjustDeltaX = this.currentDeltaX = 0;
			this.adjustDeltaY = this.currentDeltaY = 0;
		}

		this.adjustScale = this.currentScale;
		this.setImageContainerTransform();
	}

	setImageContainerTransform() {
		const transforms = [];
		transforms.push(`scale(${this.currentScale})`);
		transforms.push(`translate(${this.currentDeltaX}px, ${this.currentDeltaY}px)`);

		this.renderer.setElementStyle(this.element, this.platform.Css.transform, transforms.join(' '));
	}
}
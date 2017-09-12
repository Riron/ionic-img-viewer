import { Renderer } from '@angular/core';
import { PanGesture, Platform, Animation, DomController } from 'ionic-angular';
import { pointerCoord } from 'ionic-angular/util/dom';

import { ImageViewerComponent } from './image-viewer.component';

const HAMMER_THRESHOLD = 10;
const MAX_ATTACK_ANGLE = 45;
const DRAG_THRESHOLD = 70;

export class ImageViewerTransitionGesture extends PanGesture {

	private translationY: number;
	private opacity: number;
	private startY: number;
	private imageContainer: HTMLElement;
	private backdrop: HTMLElement;

	constructor(platform: Platform, private component: ImageViewerComponent, domCtrl: DomController, private renderer: Renderer, private cb: Function) {
		super(platform, component.getNativeElement(), {
			maxAngle: MAX_ATTACK_ANGLE,
			threshold: HAMMER_THRESHOLD,
			gesture: component._gestureCtrl.createGesture({ name: 'image-viewer' }),
			direction: 'y',
			domController: domCtrl
		});

		this.translationY = 0;
		this.imageContainer = <HTMLElement>component.getNativeElement().querySelector('.image');
		this.backdrop = <HTMLElement>component.getNativeElement().querySelector('ion-backdrop');

		this.listen();
	}

	// As we handle both pinch and drag, we have to make sure we don't drag when we are trying to pinch
	isPinching(ev) {
		return ev.touches && ev.touches.length > 1;
	}

	onDragStart(ev: any): boolean {
		ev.preventDefault();

		if (this.isPinching(ev)) {
			this.abort(ev);
		}

		let coord = pointerCoord(ev);
		this.startY = coord.y;
		return true;
	}

	canStart(ev: any): boolean {
		return !this.component.isZoomed && !this.isPinching(ev);
	}

	onDragMove(ev: any): boolean {
		if (this.isPinching(ev)) {
			this.abort(ev);
		}

		let coord = pointerCoord(ev);
		this.translationY = coord.y - this.startY;
		this.opacity = Math.max(1 - Math.abs(this.translationY) / (10 * DRAG_THRESHOLD), .5);

		this.plt.raf(() => {
			this.renderer.setElementStyle(this.imageContainer, this.plt.Css.transform, `translateY(${this.translationY}px)`);
			this.renderer.setElementStyle(this.backdrop, 'opacity', this.opacity.toString());
		});

		return true;
	}

	onDragEnd(ev: any): boolean {

		if (Math.abs(this.translationY) > DRAG_THRESHOLD) {
			this.cb();
		} else {
			let imageContainerAnimation = new Animation(this.plt, this.imageContainer);
			let backdropAnimation = new Animation(this.plt, this.backdrop);

			backdropAnimation.fromTo('opacity', this.opacity, '1');
			imageContainerAnimation.fromTo('translateY', `${this.translationY}px`, '0px');

			new Animation(this.plt)
				.easing('ease-in')
				.duration(150)
				.add(backdropAnimation)
				.add(imageContainerAnimation)
				.play();
		}

		return true;
	}
}

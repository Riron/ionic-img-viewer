import { ImageViewerComponent } from './image-viewer.component';
import { PanGesture } from 'ionic-angular/gestures/drag-gesture';
import { CSS, nativeRaf, pointerCoord } from 'ionic-angular/util/dom';
import { Animation } from 'ionic-angular';

const HAMMER_THRESHOLD = 10;
const MAX_ATTACK_ANGLE = 45;
const DRAG_THRESHOLD = 70;

export class ImageViewerGesture extends PanGesture {

	private translationY: number;
	private opacity: number;
	private startY: number;
	private imageContainer: HTMLElement;
	private backdrop: HTMLElement;

	constructor(private component: ImageViewerComponent, private cb: Function) {
		super(component.getNativeElement(), {
			maxAngle: MAX_ATTACK_ANGLE,
			threshold: HAMMER_THRESHOLD,
			gesture: component._gestureCtrl.createGesture({ name: 'image-viewer' }),
			direction: 'y'
		});

		this.translationY = 0;
		this.imageContainer = <HTMLElement>component.getNativeElement().querySelector('.image');
		this.backdrop = <HTMLElement>component.getNativeElement().querySelector('ion-backdrop');

		this.listen();
	}

	onDragStart(ev: any): boolean {
		let coord = pointerCoord(ev);
		this.startY = coord.y;
		return true;
	}

	canStart(): boolean {
		return !this.component.isZoomed;
	}

	onDragMove(ev: any): boolean {
		let coord = pointerCoord(ev);
		this.translationY = coord.y - this.startY;
		this.opacity = Math.max(1 - Math.abs(this.translationY) / (10 * DRAG_THRESHOLD), .5);

		nativeRaf(() => {
			this.imageContainer.style[<any>CSS.transform] = `translateY(${this.translationY}px)`;
			this.backdrop.style['opacity'] = this.opacity.toString();
		});

		return true;
	}

	onDragEnd(ev: any): boolean {

		if (Math.abs(this.translationY) > DRAG_THRESHOLD) {
			this.cb();
		} else {
			let imageContainerAnimation = new Animation(this.imageContainer);
			let backdropAnimation = new Animation(this.backdrop);

			backdropAnimation.fromTo('opacity', this.opacity, '1');
			imageContainerAnimation.fromTo('translateY', `${this.translationY}px`, '0px');

			new Animation()
				.easing('ease-in')
				.duration(150)
				.add(backdropAnimation)
				.add(imageContainerAnimation)
				.play();
		}

		return true;
	}
}

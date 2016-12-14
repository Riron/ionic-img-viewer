import { ImageViewerComponent } from './image-viewer.component';
import { PanGesture } from 'ionic-angular/gestures/drag-gesture';
import { CSS, nativeRaf, pointerCoord } from 'ionic-angular/util/dom';
import { swipeShouldReset } from 'ionic-angular/util/util';
import { Animation } from 'ionic-angular';

const HAMMER_THRESHOLD = 10;
const MAX_ATTACK_ANGLE = 30;

const getTranslationValue = (direction: string, element: HTMLElement): number => {
	const regex = new RegExp(`\.*translate${direction}\((.*)px\)`, 'i');
	const style = element.style[<any>CSS.transform];
	const test = regex.exec(style) || ['0', '0'];

	return parseInt(test[1], 10);
}

export class ImageViewerSliderGesture extends PanGesture {

	private translationX: number;
	private startX: number;
	private startTranslateX: number;
	private imageWrapper: HTMLElement;
	private firstTimestamp: number;
	private windowWidth: number;

	constructor(private component: ImageViewerComponent, private cb: Function) {
		super(component.getNativeElement(), {
			maxAngle: MAX_ATTACK_ANGLE,
			threshold: HAMMER_THRESHOLD,
			zone: false,
			gesture: component._gestureCtrl.createGesture({ name: 'image-viewer-slider' }),
			direction: 'x'
		});

		this.imageWrapper = <HTMLElement>component.getNativeElement().querySelector('.image-wrapper');

		this.translationX = 0;
		this.startTranslateX = getTranslationValue('X', this.imageWrapper);

		this.windowWidth = component
			.getNativeElement()
			.querySelector('ion-backdrop')
			.clientWidth;


		this.listen();
	}

	onDragStart(ev: any): boolean {
		let coord = pointerCoord(ev);
		this.startX = coord.x;
		return true;
	}

	canStart(): boolean {
		return !this.component.isZoomed;
	}

	onDragMove(ev: any): boolean {
		let coord = pointerCoord(ev);
		this.translationX = this.startTranslateX + coord.x - this.startX;

		nativeRaf(() => {
			this.imageWrapper.style[<any>CSS.transform] = `translateX(${this.translationX}px)`;
		});

		return true;
	}

	onDragEnd(ev: any): boolean {

		const coordX = pointerCoord(ev).x;

		const deltaX = (coordX - this.startX);
		const velocity = deltaX / (Date.now() - this.firstTimestamp);

		const isResetDirection = (deltaX > 0) === !(velocity < 0);
		const isMovingFast = Math.abs(velocity) > 0.3;
		const isOnCloseZone = Math.abs(deltaX) < Math.abs(this.windowWidth / 2);

		const moveX = (swipeShouldReset(isResetDirection, isMovingFast, isOnCloseZone)) ? 0 : Math.sign(deltaX) * this.windowWidth;
		const endPoint = this.startTranslateX + moveX;
		const duration = 150 - (150 * deltaX / this.windowWidth);

		const imageWrapperAnimation = new Animation(this.imageWrapper);
		imageWrapperAnimation.fromTo('translateX', `${this.translationX}px`, `${endPoint}px`);

		new Animation()
			.easing('ease-in')
			.duration(duration)
			.add(imageWrapperAnimation)
			.play();

		return true;
	}
}

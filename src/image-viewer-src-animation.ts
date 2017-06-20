import { Animation, Platform } from 'ionic-angular';

export class ImageViewerSrcAnimation {
	private imageAnimation: Animation;
	private element: HTMLElement;

	constructor(platform: Platform, image: any) {
		this.element = image.nativeElement;
		this.imageAnimation = new Animation(platform, image);
	}

	scaleFrom(lowResImgWidth) {
		const highResImgWidth = this.element.clientWidth;

		const imageTransition = this.imageAnimation
			.fromTo('scale', lowResImgWidth / highResImgWidth, 1)
			.duration(100)
			.easing('ease-in-out')
			.play();
	}
}
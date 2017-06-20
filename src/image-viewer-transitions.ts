import { Transition, Animation } from 'ionic-angular';

export class ImageViewerEnter extends Transition {
	init() {

		const css = this.plt.Css;
		const ele = this.enteringView.pageRef().nativeElement;

		const fromPosition = this.enteringView.data.position;
		const toPosition = ele.querySelector('img').getBoundingClientRect();
		const flipS = fromPosition.width / toPosition.width;
		const flipY = fromPosition.top - toPosition.top;
		const flipX = fromPosition.left - toPosition.left;

		const imgElement = ele.querySelector('.image');
		const backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
		const image = new Animation(this.plt, imgElement);

		// Using `Animation.beforeStyles()` here does not seems to work
		imgElement.style[css.transformOrigin] = '0 0';

		image.fromTo('translateY', `${flipY}px`, '0px')
			.fromTo('translateX', `${flipX}px`, '0px')
			.fromTo('scale', flipS, '1')
			.afterClearStyles([ css.transformOrigin ]);

		backdrop.fromTo('opacity', '0.01', '1');

		this.easing('ease-in')
			.duration(150)
			.add(backdrop)
			.add(image);

		const enteringPageEle: Element = this.enteringView.pageRef().nativeElement;
		const enteringNavbarEle = enteringPageEle.querySelector('ion-navbar');
		const enteringBackBtnEle = enteringPageEle.querySelector('.back-button');

		const enteringNavBar = new Animation(this.plt, enteringNavbarEle);
		enteringNavBar.afterAddClass('show-navbar');
		this.add(enteringNavBar);

		const enteringBackButton = new Animation(this.plt, enteringBackBtnEle);
		this.add(enteringBackButton);
		enteringBackButton.afterAddClass('show-back-button');
	}
}

export class ImageViewerLeave extends Transition {
	init() {

		const css = this.plt.Css;
		const ele = this.leavingView.pageRef().nativeElement;

		const toPosition = this.leavingView.data.position;
		const fromPosition = ele.querySelector('img').getBoundingClientRect();

		const imageElement = ele.querySelector('.image');

		let offsetY = 0;
		const imageYOffset = imageElement.style[css.transform];
		if (imageYOffset) {
			const regexResult = imageYOffset.match(/translateY\((-?\d*\.?\d*)px\)/);
			offsetY = regexResult ? parseFloat(regexResult[1]) : offsetY;
		}

		const flipS = toPosition.width / fromPosition.width;
		const flipY = toPosition.top - fromPosition.top + offsetY;
		const flipX = toPosition.left - fromPosition.left;

		const backdropOpacity = ele.querySelector('ion-backdrop').style['opacity'];

		const backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
		const image = new Animation(this.plt, imageElement);

		image.fromTo('translateY', `${offsetY}px`, `${flipY}px`)
			.fromTo('translateX', `0px`, `${flipX}px`)
			.fromTo('scale', '1', flipS)
			.beforeStyles({ [css.transformOrigin]: '0 0' })
			.afterClearStyles([css.transformOrigin]);

		backdrop.fromTo('opacity', backdropOpacity, '0');

		this.easing('ease-in-out')
			.duration(150)
			.add(backdrop)
			.add(image);
	}
}

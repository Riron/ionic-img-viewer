import { Transition, Animation } from 'ionic-angular';

export class ImageViewerEnter extends Transition {
	init() {

		const ele = this.enteringView.pageRef().nativeElement;

		const fromPosition = this.enteringView.data.position;
		const toPosition = ele.querySelector('img').getBoundingClientRect();
		const flipS = fromPosition.width / toPosition.width;
		const flipY = fromPosition.top - toPosition.top;
		const flipX = fromPosition.left - toPosition.left;

		const backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
		const image = new Animation(this.plt, ele.querySelector('.image'));

		image.fromTo('translateY', `${flipY}px`, '0px')
			.fromTo('translateX', `${flipX}px`, '0px')
			.fromTo('scale', flipS, '1')
			.beforeStyles({ 'transform-origin': '0 0' })
			.afterClearStyles(['transform-origin']);

		backdrop.fromTo('opacity', '0.01', '1');

		this.easing('ease-in')
			.duration(150)
			.add(backdrop)
			.add(image);

		const enteringPageEle: Element = this.enteringView.pageRef().nativeElement;
		const enteringNavbarEle = enteringPageEle.querySelector('ion-navbar');
		const enteringBackBtnEle = enteringPageEle.querySelector('.back-button');

		const enteringNavBar = new Animation(this.plt, enteringNavbarEle);
		enteringNavBar.beforeAddClass('show-navbar');
		this.add(enteringNavBar);

		const enteringBackButton = new Animation(this.plt, enteringBackBtnEle);
		this.add(enteringBackButton);
		enteringBackButton.beforeAddClass('show-back-button');
	}
}

export class ImageViewerLeave extends Transition {
	init() {

		const ele = this.leavingView.pageRef().nativeElement;

		const toPosition = this.leavingView.data.position;
		const fromPosition = ele.querySelector('img').getBoundingClientRect();

		let offsetY = 0;
		const imageYOffset = ele.querySelector('.image').style[this.plt.Css.transform];
		if (imageYOffset) {
			const regexResult = imageYOffset.match(/translateY\((-?\d*\.?\d*)px\)/);
			offsetY = regexResult ? parseFloat(regexResult[1]) : offsetY;
		}

		const flipS = toPosition.width / fromPosition.width;
		const flipY = toPosition.top - fromPosition.top + offsetY;
		const flipX = toPosition.left - fromPosition.left;

		const backdropOpacity = ele.querySelector('ion-backdrop').style['opacity'];

		const backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
		const image = new Animation(this.plt, ele.querySelector('.image'));

		image.fromTo('translateY', `${offsetY}px`, `${flipY}px`)
			.fromTo('translateX', `0px`, `${flipX}px`)
			.fromTo('scale', '1', flipS)
			.beforeStyles({ 'transform-origin': '0 0' })
			.afterClearStyles(['transform-origin']);

		backdrop.fromTo('opacity', backdropOpacity, '0');

		this.easing('ease-in-out')
			.duration(150)
			.add(backdrop)
			.add(image);
	}
}

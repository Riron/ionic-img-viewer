import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from "@angular/core";

import { ImageViewerController } from "./image-viewer.controller";
import { IconOptions } from "./image-viewer";

@Directive({
  selector: "[imageViewer]"
})
export class ImageViewerDirective {
  @Input("imageViewer") src: string;
  @Input("title") title: string;
  @Input("imageId") imageId: number;
  @Input("iconsRight") iconsRight:IconOptions[];
  @Output() close = new EventEmitter();

  constructor(
    private _el: ElementRef,
    private imageViewerCtrl: ImageViewerController
  ) {}

  @HostListener("click", ["$event"])
  onClick(event: Event): void {
    event.stopPropagation();

    const element = this._el.nativeElement;
    const onCloseCallback = () => this.close.emit();
    const imageViewer = this.imageViewerCtrl.create(element, {
      title: this.title,
      imageId: this.imageId,
      iconsRight: this.iconsRight,
      fullResImage: this.src.split(","),
      onCloseCallback
    });
    imageViewer.present();
  }
}

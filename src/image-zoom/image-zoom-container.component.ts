/**
 * Created by craftsvilla on 15/03/17.
 */
import {Component, ElementRef} from '@angular/core';

@Component({
    selector: 'image-zoom-container',
    template: ``,
    styles: [`
    :host{
      position: absolute;
      width: 400px;
      height: 400px;
      overflow: hidden;
      display: none;
      border: 1px solid #7a7a7a;
    }
  `]
})
export class ImageZoomContainer {
    public el: HTMLElement;

    constructor(private _elementRef: ElementRef) {
        this.el = this._elementRef.nativeElement;
    }

    public setOptions(options: any) {
        this.el.style.backgroundImage = `url(${options['src']})`;
        this.el.style.left = options['left'] + 'px';
        this.el.style.top = options['top'] + 'px';
        this.el.style.width = options['width'] + 'px';
        this.el.style.height = options['height'] + 'px';
    }

    public setVisibility(visible:boolean) {
        this.el.style.display = visible ? 'block' : 'none';
    }

    public setBackgroundPosition(position:string) {
        this.el.style.backgroundPosition = position;
    }
}

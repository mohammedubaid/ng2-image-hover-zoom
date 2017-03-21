import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'zoom-lens-container',
  template: ``,
  styles: [`
    :host{
      position: absolute;
      width: 0px;
      height: 0px;
      overflow: hidden;
      display: none;
      background-color: rgba(0,0,0,0.4);
      pointer-events: none;
    }
  `]
})
export class ZoomLensContainer {
  public el: HTMLElement;
  constructor(private _elementRef: ElementRef) {
    this.el = this._elementRef.nativeElement;
  }

  public setOptions(options: any) {
    this.el.style.left = options['left']+ 'px';
    this.el.style.top = options['top']+ 'px';
    this.el.style.width = options['width']+ 'px';
    this.el.style.height = options['height']+ 'px';
  }

  public setVisibility(visible: boolean) {
    this.el.style.display = visible ? 'block' : 'none';
  }
}

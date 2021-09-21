import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import * as marked from 'marked';

@Directive( {
  selector: '[appMarked]'
} )
export class MarkedDirective implements AfterViewInit {

  @Input() appMarked = '';

  constructor(
    private el: ElementRef
  ) { }

  public ngAfterViewInit(): void {
    this.el.nativeElement.innerHTML = marked( this.appMarked );
    this.el.nativeElement.classList.add( 'markdown' );
    for ( const el of this.el.nativeElement.getElementsByTagName( 'a' ) ) {
      el.target = "_blank";
    }
  }
}

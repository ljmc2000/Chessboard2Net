import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PieceColourService {

  styleSheet: CSSStyleSheet;

  constructor() {
    var link = document.getElementById("piece_colours_stylesheet_link") as HTMLLinkElement;
    var styleSheet = link.sheet!=null?link.sheet:new CSSStyleSheet();
    this.styleSheet=styleSheet;
  }

  setColour(context: string, target: string, colour: string) {
    var rule: CSSStyleRule;
    for(var i=0; i<this.styleSheet.cssRules.length; i++) {
      rule=this.styleSheet.cssRules[i] as CSSStyleRule
      if(rule.selectorText==`.${context} .${target}`) {
        this.styleSheet.deleteRule(i)
        break;
      }
    }

    this.styleSheet.insertRule(`.${context} .${target} {fill: ${colour} !important}`);
  }
}

"use strict";
exports.__esModule = true;
exports.logoSlideAnimation = exports.mobileSidenavAnimation = exports.contentAnimation = exports.tableVisibleAnimation = exports.mobileSlidingSidenavAnimation = exports.slidingContentAnimation = exports.inputAnimation = exports.toolbarButtonAnimation = exports.slideDownAnimation = exports.translateRationaleContent = exports.expandButtonAnimation = exports.dropInAnimation = exports.slideInLeftFast = exports.slideInLeft = exports.fadeInAnimation = exports.toolbarItemsFade = void 0;
var animations_1 = require("@angular/animations");
exports.toolbarItemsFade = animations_1.trigger('toolbarItemsFade', [
    animations_1.transition(':enter', [
        animations_1.style({ opacity: 0 }),
        animations_1.animate('300ms ease-out', animations_1.style({ opacity: 1 })),
    ]),
]);
exports.fadeInAnimation = animations_1.trigger('fadeIn', [
    // the "in" style determines the "resting" state of the element when it is visible.
    // fade in when created. this could also be written as transition('void => *')
    animations_1.transition(':enter', [
        animations_1.style({ opacity: 0 }),
        animations_1.animate('10s ease', animations_1.style({ opacity: 1 })),
    ]),
]);
exports.slideInLeft = animations_1.trigger('slideInLeft', [
    animations_1.transition(':enter', [
        animations_1.style({ opacity: 0, transform: 'translateX(-200px)' }),
        animations_1.animate('450ms ease', animations_1.style({ opacity: 1, transform: 'translateX(0)' })),
    ]),
]);
exports.slideInLeftFast = animations_1.trigger('slideInLeftFast', [
    animations_1.transition(':enter', [
        animations_1.style({ opacity: 0 }),
        animations_1.animate('250ms ease-out', animations_1.style({ opacity: '*' })),
    ]),
]);
exports.dropInAnimation = animations_1.trigger('dropIn', [
    animations_1.transition(':enter', [
        animations_1.style({ boxShadow: 'none', opacity: 0, transform: 'translateY(-5em)' }),
        animations_1.sequence([
            animations_1.animate('300ms', animations_1.style({ boxShadow: '2px 2px 10px 2px #808080', opacity: 0.7 })),
            animations_1.animate('500ms ease', animations_1.style({
                opacity: 1,
                transform: 'translateX(0)'
            })),
            animations_1.animate('600ms ease-in', animations_1.style({ boxShadow: '*', transform: 'translateX(0)' })),
        ]),
    ]),
]);
exports.expandButtonAnimation = animations_1.trigger('expandButton', [
    animations_1.state('default', animations_1.style({ transform: 'rotate(0deg)' })),
    animations_1.state('rotated', animations_1.style({ transform: 'rotate(90deg)' })),
    animations_1.transition('rotated => default', animations_1.animate('400ms ease-out')),
    animations_1.transition('default => rotated', animations_1.animate('400ms ease-in')),
]);
exports.translateRationaleContent = animations_1.trigger('translateRationale', [
    animations_1.transition(':leave', [
        animations_1.style({ transform: 'translateY(0)' }),
        animations_1.animate('200ms ease-out', animations_1.style({
            transform: 'translateY(-200px)'
        })),
    ]),
    animations_1.transition(':enter', [
        animations_1.style({ transform: 'translateY(-200px)' }),
        animations_1.animate('200ms ease', animations_1.style({
            transform: 'translateY(0)'
        })),
    ]),
]);
exports.slideDownAnimation = animations_1.trigger('slideDown', [
    // fade in when created. this could also be written as transition('void => *')
    animations_1.transition(':enter', [
        animations_1.style({
            transform: 'translateY(-200px)'
        }),
        animations_1.animate('200ms ease', animations_1.style({ transform: 'translateY(0px)' })),
    ]),
]);
exports.toolbarButtonAnimation = animations_1.trigger('toolbarMargin', [
    // fade in when created. this could also be written as transition('void => *')
    animations_1.state('slideIn', animations_1.style({ transform: 'translateX(0px)' })),
    animations_1.state('slideOut', animations_1.style({ transform: 'translateX(0px)' })),
    animations_1.transition('slideIn <=> slideOut', animations_1.animate('240ms ease')),
]);
exports.inputAnimation = animations_1.trigger('inputSlideIn', [
    animations_1.transition(':enter', [
        animations_1.style({
            transform: 'translateX(-300px)'
        }),
        animations_1.animate('400ms ease'),
    ]),
    animations_1.transition(':leave', [
        animations_1.style({
            transform: 'translateX(0px)'
        }),
        animations_1.animate('200ms ease'),
    ]),
]);
exports.slidingContentAnimation = animations_1.trigger('slidingContent', [
    animations_1.state('closed', animations_1.style({ transform: 'translateX(0px)' })),
    animations_1.state('open', animations_1.style({ transform: 'translateX(285px)' })),
    animations_1.transition('open => closed', animations_1.animate('200ms ease-in')),
    animations_1.transition('closed => open', animations_1.animate('200ms ease-out')),
]);
exports.mobileSlidingSidenavAnimation = animations_1.trigger('mobileSlidingSidenav', [
    animations_1.transition(':enter', [
        animations_1.style({
            transform: 'translateX(calc(-100vw))'
        }),
        animations_1.animate('400ms ease', animations_1.style({ transform: 'translateX(0px)' })),
    ]),
    animations_1.transition(':leave', [
        animations_1.style({
            transform: 'translateX(0px)'
        }),
        animations_1.animate('200ms ease', animations_1.style({
            transform: 'translateX(calc(-100vw))'
        })),
    ]),
]);
exports.tableVisibleAnimation = animations_1.trigger('toggleTables', [
    animations_1.state('static', animations_1.style({ width: 'calc(100vw - (285px + 200px)' })),
    animations_1.state('slide', animations_1.style({ width: 'calc(100vw - 200px)' })),
    animations_1.transition('static => slide', animations_1.animate('400ms ease-out')),
    animations_1.transition('slide => static', animations_1.animate('400ms ease-in')),
]);
exports.contentAnimation = animations_1.trigger('toggleContent', [
    animations_1.state('partial', animations_1.style({ width: 'calc(100vw - 285px)' })),
    animations_1.state('full', animations_1.style({ width: '100vw' })),
    animations_1.transition('static => slide', animations_1.animate('400ms ease-out')),
    animations_1.transition('slide => static', animations_1.animate('400ms ease-in')),
]);
exports.mobileSidenavAnimation = animations_1.trigger('toggleMobileSidenav', [
    animations_1.state('visible', animations_1.style({ transform: 'translateX(0em)' })),
    animations_1.state('hidden', animations_1.style({ transform: 'translateX(-100vw)' })),
    animations_1.transition('visible => hidden', animations_1.animate('200ms ease-in')),
    animations_1.transition('hidden => visible', animations_1.animate('200ms ease-out')),
]);
exports.logoSlideAnimation = animations_1.trigger('logoAnimation', [
    animations_1.state('fullScreen', animations_1.style({ transform: 'translateX(-9.75em)' })),
    animations_1.state('partial', animations_1.style({ transform: 'translateX(0em)' })),
    animations_1.transition('fullScreen => partial', animations_1.animate('200ms ease-in')),
    animations_1.transition('partial => fullScreen', animations_1.animate('200ms ease-out')),
]);

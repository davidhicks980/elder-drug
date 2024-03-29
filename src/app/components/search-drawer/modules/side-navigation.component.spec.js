"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var sidebar_component_1 = require("./sidebar.component");
describe('SideNavigationComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.waitForAsync(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [sidebar_component_1.SidebarComponent]
        }).compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(sidebar_component_1.SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});

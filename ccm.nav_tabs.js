/* 
 * The MIT License
 *
 * Copyright 2017 Moritz Kemp <moritz at kemp-thelen.de>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* global ccm */

(function(){
    var component = {
        name   : 'nav_tabs',    
        ccm    : 'https://akless.github.io/ccm/version/ccm-11.2.0.min.js',
        config : {
            html          : {
                "container" : {
                    "tag"   :"div",
                    "class" :"container",
                    "inner" : [
                        {
                            "tag"   : "div",
                            "class" : "header",
                            "inner" : [
                                {
                                    "tag"   : "div",
                                    "class" : "button-container"
                                },
                                {
                                    "tag"   : "div",
                                    "class" : "text-container" 
                                },
                                {
                                    "tag"   : "div",
                                    "class" : "spacer"
                                }
                            ]
                        },
                        {
                            "tag"   : "div",
                            "class" : "tabs-row",
                            "inner" : [
                                {
                                    "tag"   : "div",
                                    "class" : "tab-0 tab selected"
                                },
                                {
                                    "tag"   : "div",
                                    "class" : "tab-1 tab"
                                },
                                {
                                    "tag"   : "div",
                                    "class" : "tab-2 tab"
                                },
                                {
                                    "tag"   : "div",
                                    "class" : "tab-3 tab"
                                }
                            ]
                        }
                    ]   
                }
            },
            css           : ['ccm.load','./style.css'],
            header_text   : 'Dummy Head', 
            tabs          : [
                {
                    "text"   : "TabNo. 0",
                    "action" : ""
                },
                {
                    "text"   : "TabNo. 1",
                    "action" : ""
                },
                {
                    "text"   : "TabNo. 2",
                    "action" : ""
                },
                {
                    "text"   : "TabNo. 3",
                    "action" : ""
                }
            ],
            scroll_area   : ''
        },
        Instance: function(){
            const self = this;
            let my = {};
            let touchYstart = 0;
            let touchYdistance = 0;

            this.ready = function( callback ) {
                my = self.ccm.helper.privatize( self );                
                if( callback ) callback();
            };

            this.start = function( callback ) {
                // Build view from html.json data
                buildView();
                // Catch touchstart/touchend events either on scroll area
                // or on own tabs element
                if(my.scroll_area){
                    my.scroll_area.addEventListener('touchstart', touchstart);
                    my.scroll_area.addEventListener('touchmove', touchmove);
                }
                    self.element.addEventListener('touchstart', touchstart);
                    self.element.addEventListener('touchmove', touchmove);
                if( callback ) callback();
            };
            
            /* --- Public functions --- */
            
            // Set tab actions. 
            // Range of tab-id: [0-3]
            // Actions is a function (otherwise ignored later)
            this.setTabAction = function( tabId, action ){
                let tabEl = self.element.querySelector('.tab-'+tabId);
                if(tabEl)
                    tabEl.action = action;
            };
          
            // Fill the area right of the headline with any html objec (e.g. log-in button)
            this.setRightHeaderArea = function( domObject ){
                self.element.querySelector('.spacer')
                .appendChild( domObject );
            };
            
            // Fill the area left of the headline with any html object (e.g. back-button)
            this.setLeftHeaderArea = function( domObject ){
                self.element.querySelector('.button-container')
                .appendChild( domObject );
            };
            
            /* --- Private functions from here --- */
            
            const buildView = function( ){
                const container  = self.ccm.helper.html(my.html.container);
                // Add text to headline
                if(my.header_text !== '' && (typeof my.header_text === 'string')) {
                    container.querySelector('.text-container').appendChild(
                        document.createTextNode(my.header_text)
                    );
                }
                self.element.appendChild( container );
                // Get tab-elements
                let i=0;
                const tabs_row = self.element.querySelector('.tabs-row');
                let textEl, tabEl;
                // Add text and onclick-actions to tabs
                // Allow only 4 tabs for ux reasons
                while(i<4 && my.tabs[i]){
                    textEl = document.createTextNode(my.tabs[i].text);
                    tabEl = tabs_row.querySelector('.tab-'+i);
                    tabEl.addEventListener('click', onTabClick);
                    tabEl.appendChild(textEl);
                    if(my.tabs[i].action)
                        self.setTabAction( i, my.tabs[i].action);
                    i++;
                }
            };
            
            const onTabClick = function( event ){
                if(typeof(event.target.action) === 'function')
                    event.target.action();
                const tabs = self.element.getElementsByClassName('tab');
                for(let i=0; i<tabs.length; i++){
                    if( event.target.classList === tabs[i].classList ){ 
                        tabs[i].classList.add('selected');
                    } else {
                        tabs[i].classList.remove('selected');
                    }
                };
            };
            
            const hideTabsRow = function( ){
                self.element.querySelector('.tabs-row')
                .style.transform = 'translateY(-70px)';
            };
            
            const showTabsRow = function( ){
                self.element.querySelector('.tabs-row')
                .style.transform = '';
            };
            
            const touchstart = function( e ) {
                self.touchYstart = e.touches[0].clientY;
            };
            
            const touchmove = function( e ) {
                self.touchYdistance = e.touches[0].clientY - self.touchYstart;
                if( self.touchYdistance > 50 ){
                    showTabsRow();
                } else if( self.touchYdistance < -50){
                    hideTabsRow();
                }
            };
       }
   };
    
    
    
    //The following code gets the framework and registers component from above
    function p(){
        window.ccm[v].component(component);
    }
    var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}} 
}());
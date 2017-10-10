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
        ccm    : 'https://akless.github.io/ccm/ccm.js',
        config : {
            html          : ['ccm.load','./resources/structure.js'],
            css           : ['ccm.load','./resources/style.css'],
            header_text   : '',
            hasBackground : true, 
            tabs          : [],
            scroll_area   : ''
        },
        Instance: function(){
            var self = this;
            var my;
            var touchYstart = 0;
            var touchYdistance = 0;

            this.ready = function( callback ) {
                my = self.ccm.helper.privatize( self );                
                if( callback ) callback();
            };

            this.start = function( callback ) {
                
                // Build view from html.json data
                self.buildView();
                
                // Catch touchstart/touchend events
                if(my.scroll_area){
                    my.scroll_area.addEventListener('touchstart', self.touchstart);
                    my.scroll_area.addEventListener('touchmove', self.touchstart);
                } else {
                    self.element.addEventListener('touchstart', self.touchstart);
                    self.element.addEventListener('touchmove', self.touchmove);
                }
                
                if( callback ) callback();
            };
            
            this.buildView = function( ){
                
                if(my.hasBackground){
                    var background = self.ccm.helper.html(my.html.background);
                    self.element.appendChild( background );
                }
                
                var container  = self.ccm.helper.html(my.html.container);
                
                // Add text to headline
                if(my.header_text !== '' && (typeof my.header_text === 'string')) {
                    container.querySelector('.text-container').appendChild(
                        document.createTextNode(my.header_text)
                    );
                }
                self.element.appendChild( container );
                
                // Build tabs and add click action
                var i=0;
                var tabs_row = self.element.querySelector('.tabs-row');
                // Allow only 4 tabs for ux reasons
                while(i<4 && my.tabs[i]){
                    var textEl = document.createTextNode(my.tabs[i].text);
                    var tabEl = tabs_row.querySelector('.tab-'+(i+1));
                    tabEl.addEventListener('click', self.onTabClick);
                    tabEl.action = my.tabs[i].action;
                    tabEl.appendChild(textEl);
                    i++;
                }
            };
            
            this.onTabClick = function( e ){
                if(typeof(e.target.action) === 'function') {
                    e.target.action();
                }
                
                var tabs = self.element.getElementsByClassName('tab');
                for(var i=0; i<tabs.length; i++){
                    if( e.target.classList === tabs[i].classList ){ 
                        tabs[i].classList.add('selected');
                    } else {
                        tabs[i].classList.remove('selected');
                    }
                };
            };
            
            this.hideTabsRow = function( ){
                self.element.querySelector('.tabs-row')
                .style.transform = 'translateY(-70px)';
            };
            
            this.showTabsRow = function(  ){
                self.element.querySelector('.tabs-row')
                .style.transform = '';
            };
            
            this.touchstart = function( e ) {
                self.touchYstart = e.touches[0].pageY;
            };
            
            this.touchmove = function( e ) {
                self.touchYdistance = e.touches[0].pageY - self.touchYstart;
                if( self.touchYdistance > 70 ){
                    self.showTabsRow();
                } else if( self.touchYdistance < -70){
                    self.hideTabsRow();
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
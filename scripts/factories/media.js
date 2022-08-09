/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */

// import modules
import {domNodeCreator} from "../utils/nodeCreator.js";

// destructuring assignment on function parameters will
// be used whenever possible to set local variables values,
// also, arrow functions will be used to define all listeners
// so that 'this' points to parent object's lexical context
// and listeners can access photogra^her object's properties

const
    // base class for the factory; it will be extended to provide objects with methods to override
    media = class extends domNodeCreator {
        // constructor
        constructor({id = null, photographerId = null, title = null, image = null, video = null, likes = null, date = null, price = null}) {
            // call superclass constructor
            super();
            // assign properties
            this.id = id;
            this.photographerId = photographerId;
            this.title = title;
            // WE WILL ASSESS HERE THAT FILE NAMES ARE UNIQUE FOR ALL THE 'MEDIA' SET
            // IN AN ACTUAL PRODUCTION FILE SYSTEM THO, MEDIA FILES WOULD OF COURSE
            // BE NAMED AFTER THEIR UNIQUE IDS AND NOT AFTER THEIR TITLES, CHAMP
            this.image = image === null ? null : `assets/media/${ image }`;
            this.video = video === null ? null : `assets/media/${ video }`;
            this.likes = likes;
            this.date = date;
            this.price = price;
        }

        // retrieve DOM element to insert (important : this is a method - not a getter)
        // this method will be overriden in subclasses to respect the factory pattern
        get() {}

        lightbox() {}
    },
    // constructor is not specified since it would be empty
    mediaImage = class extends media {
        // use a factory function to override the superclass method and create the photographer
        // card in the DOM - the factory function is a functional programming concept and should
        // not be confused with the factory pattern which is a design pattern
        get(cbLike, cbClick) {
            const
                // specify new DOM elements to create
                [ div1, img, div2, span1, span2, i ] = [ {
                    tag: `div`,
                    attributes: [ {attr: `class`, value: `photographer-media`} ]
                }, {
                    tag: `img`,
                    attributes: [ {attr: `src`, value: this.image} ],
                    listeners: [ {event: `click`, callback: cbClick} ]
                }, {
                    tag: `div`
                }, {
                    tag: `span`,
                    properties: [ {prop: `textContent`, value: this.title} ]
                }, {
                    tag: `span`,
                    properties: [ {prop: `textContent`, value: String(this.likes)} ]
                }, {
                    tag: `i`,
                    attributes: [ {attr: `class`, value: `fa-solid fa-heart`} ],
                    listeners: [ {event: `click`, callback: cbLike} ]
                    // use an arrow function expression so 'this' points to the photographer
                    // instance inside it and it is possible to access the superclass's method
                } ].map(x => this.create(x));

            // append span and i as child nodes to inner div
            [ span1, span2, i ].forEach(x => div2.appendChild(x));

            // append img and inner div as child nodes to outer div
            [ img, div2 ].forEach(x => div1.appendChild(x));

            // return
            return div1;
        }

        lightbox() {
            const
                // specify new DOM elements to create
                [ div, img, br, span ] = [ {
                    tag: `div`
                }, {
                    tag: `img`,
                    attributes: [ {attr: `class`, value: `media`}, {attr: `src`, value: this.image} ]
                }, {
                    tag: `br`
                }, {
                    tag: `span`,
                    properties: [ {prop: `textContent`, value: this.title} ]
                } ].map(x => this.create(x));

            // append img, br and span as child nodes to div
            [ img, br, span ].forEach(x => div.appendChild(x));

            // return
            return div;
        }

    },
    // constructor is not specified since it would be empty
    mediaVideo = class extends media {
        // use another factory function to create the photographer header in the DOM
        get(cbLike, cbClick) {
            const
                // specify new DOM elements to create
                [ div1, video, source, div2, span1, span2, i ] = [ {
                    tag: `div`,
                    attributes: [ {attr: `class`, value: `photographer-media`} ]
                }, {
                    tag: `video`,
                    listeners: [ {event: `click`, callback: cbClick} ]
                }, {
                    tag: `source`,
                    attributes: [ {attr: `src`, value: this.video}, {attr: `type`, value: `video/mp4`} ]
                }, {
                    tag: `div`
                }, {
                    tag: `span`,
                    properties: [ {prop: `textContent`, value: this.title} ]
                }, {
                    tag: `span`,
                    properties: [ {prop: `textContent`, value: String(this.likes)} ]
                }, {
                    tag: `i`,
                    attributes: [ {attr: `class`, value: `fa-solid fa-heart`} ],
                    listeners: [ {event: `click`, callback: cbLike} ]
                } ].map(x => this.create(x));

            // append source as child nodes to video
            [ source ].forEach(x => video.appendChild(x));

            // append span and i as child nodes to inner div
            [ span1, span2, i ].forEach(x => div2.appendChild(x));

            // append img and inner div as child nodes to outer div
            [ video, div2 ].forEach(x => div1.appendChild(x));

            // return
            return div1;
        }

        lightbox() {
            const
                // specify new DOM elements to create
                [ div, video, source, br, span ] = [ {
                    tag: `div`
                }, {
                    tag: `video`,
                    attributes: [ {attr: `class`, value: `media`}, {attr: `controls`, value: `1`} ]
                }, {
                    tag: `source`,
                    attributes: [ {attr: `src`, value: this.video}, {attr: `type`, value: `video/mp4`} ]
                }, {
                    tag: `br`
                }, {
                    tag: `span`,
                    properties: [ {prop: `textContent`, value: this.title} ]
                } ].map(x => this.create(x));

            // append source as child nodes to video
            [ source ].forEach(x => video.appendChild(x));

            // append video, br and span as child nodes to div
            [ video, br, span ].forEach(x => div.appendChild(x));

            // return
            return div;
        }
    },
    // actual media factory
    mediaFactory = function(data) {
        // select the instance to create
        switch (true) {
        case Object.hasOwn(data, `image`) :
            return new mediaImage(data);
        case Object.hasOwn(data, `video`) :
            return new mediaVideo(data);
        default :
            throw new TypeError(`invalid values provided, media factory can't return an object`);
        }
    };

export {mediaFactory};
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
                [ article, a, img, div, p1, p2, i ] = [ {
                    tag: `article`,
                    attributes: [ {attr: `class`, value: `photographer-media`} ]
                }, {
                    tag: `a`,
                    attributes: [ {attr: `href`, value: `#`} ],
                    listeners: [ {event: `click`, callback: cbClick} ]
                }, {
                    tag: `img`,
                    attributes: [ {attr: `src`, value: this.image}, {attr: `alt`, value: `${ this.title }, closeup view`} ]
                }, {
                    tag: `div`
                }, {
                    tag: `p`,
                    properties: [ {prop: `textContent`, value: this.title} ]
                }, {
                    tag: `p`,
                    properties: [ {prop: `textContent`, value: String(this.likes)} ]
                }, {
                    tag: `i`,
                    attributes: [ {attr: `class`, value: `fa-solid fa-heart`}, {attr: `aria-label`, value: `likes`} ],
                    listeners: [ {event: `click`, callback: cbLike} ]
                    // use an arrow function expression so 'this' points to the photographer
                    // instance inside it and it is possible to access the superclass's method
                } ].map(x => this.create(x));

            // append ps and i as child nodes to inner div
            [ p1, p2, i ].forEach(x => div.appendChild(x));

            // append img to a
            [ img ].forEach(x => a.appendChild(x));

            // append a and inner div as child nodes to article
            [ a, div ].forEach(x => article.appendChild(x));

            // return
            return article;
        }

        lightbox() {
            const
                // specify new DOM elements to create
                [ div, img, br, span ] = [ {
                    tag: `div`
                }, {
                    tag: `img`,
                    attributes: [ {attr: `class`, value: `media`}, {attr: `src`, value: this.image}, {attr: `alt`, value: this.title} ]
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
                [ article, a, video, source, div, p1, p2, i ] = [ {
                    tag: `article`,
                    attributes: [ {attr: `class`, value: `photographer-media`} ]
                }, {
                    tag: `a`,
                    attributes: [ {attr: `href`, value: `#`}, {attr: `aria-label`, value: `${ this.title }, closeup view`} ],
                    listeners: [ {event: `click`, callback: cbClick} ]
                }, {
                    tag: `video`
                }, {
                    tag: `source`,
                    attributes: [ {attr: `src`, value: this.video}, {attr: `type`, value: `video/mp4`} ]
                }, {
                    tag: `div`
                }, {
                    tag: `p`,
                    properties: [ {prop: `textContent`, value: this.title} ]
                }, {
                    tag: `p`,
                    properties: [ {prop: `textContent`, value: String(this.likes)} ]
                }, {
                    tag: `i`,
                    attributes: [ {attr: `class`, value: `fa-solid fa-heart`}, {attr: `aria-label`, value: `likes`} ],
                    listeners: [ {event: `click`, callback: cbLike} ]
                } ].map(x => this.create(x));

            // append source as child nodes to video
            [ source ].forEach(x => video.appendChild(x));

            // append video to a
            [ video ].forEach(x => a.appendChild(x));

            // append ps and i as child nodes to inner div
            [ p1, p2, i ].forEach(x => div.appendChild(x));

            // append a and inner div as child nodes to article
            [ a, div ].forEach(x => article.appendChild(x));

            // return
            return article;
        }

        lightbox() {
            const
                // specify new DOM elements to create
                [ div, video, source, br, span ] = [ {
                    tag: `div`
                }, {
                    tag: `video`,
                    attributes: [ {attr: `class`, value: `media`}, {attr: `controls`, value: `1`}, {attr: `title`, value: this.title} ]
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
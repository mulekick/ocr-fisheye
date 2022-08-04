/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */

// destructuring assignment on function parameters will
// be used whenever possible to set local variables values

const
    // base class for the factory - it will be extended to provide objects with
    // the ability to create new elements in the DOM and with methods to override
    media = class {
        // constructor
        constructor({id = null, photographerId = null, title = null, image = null, video = null, likes = null, date = null, price = null}) {
            // assign properties
            this.id = id;
            this.photographerId = photographerId;
            this.title = title;
            // WE WILL ASSESS HERE THAT FILE NAMES ARE UNIQUE FOR ALL THE 'MEDIA' SET
            // IN AN ACTUAL PRODUCTION FILE SYSTEM THO, MEDIA FILES WOULD OF COURSE
            // BE NAMED AFTER THEIR UNIQUE IDS AND NOT AFTER THEIR TITLES, CHAMP
            this.image = `assets/media/${ image }`;
            this.video = `assets/media/${ video }`;
            this.likes = likes;
            this.date = date;
            this.price = price;
        }

        // DOM element creation
        create({tag = null, attributes = null, properties = null}) {
            if (typeof tag !== `string`)
                // throw error if tag is invalid
                throw new TypeError(`impossible to create new element: tag parameter is invalid.`);

            const
                // create DOM element
                element = document.createElement(tag);

            if (attributes instanceof Array)
                // append element attributes
                attributes.forEach(({attr, value}) => {
                    const
                        // create new attribute node
                        newAttribute = document.createAttribute(attr);
                    // set value
                    newAttribute.value = value;
                    // add to new element
                    element.attributes.setNamedItem(newAttribute);
                });

            if (properties instanceof Array)
                // set element DOM properties
                properties.forEach(({prop, value}) => (element[prop] = value));

            // return new element
            return element;
        }

        // retrieve DOM element to insert (important : this is a method - not a getter)
        // this method will be overriden in subclasses to respect the factory pattern
        get() {}
    },
    // constructor is not specified since it would be empty
    mediaImage = class extends media {
        // use a factory function to override the superclass method and create the photographer
        // card in the DOM - the factory function is a functional programming concept and should
        // not be confused with the factory pattern which is a design pattern
        get() {
            const
                // specify new DOM elements to create
                [ div1, img, div2, span1, span2, i ] = [ {
                    tag: `div`,
                    attributes: [ {attr: `class`, value: `photograph-media`} ]
                }, {
                    tag: `img`,
                    attributes: [ {attr: `src`, value: this.image} ]
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
                    attributes: [ {attr: `class`, value: `fa-solid fa-heart`} ]
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

    },
    // constructor is not specified since it would be empty
    mediaVideo = class extends media {
        // use another factory function to create the photographer header in the DOM
        get() {
            const
                // specify new DOM elements to create
                [ div1, video, source, div2, span, i ] = [ {
                    tag: `div`,
                    attributes: [ {attr: `class`, value: `photograph-media`} ]
                }, {
                    tag: `video`,
                    attributes: [ {attr: `controls`, value: `1`} ]
                }, {
                    tag: `source`,
                    attributes: [ {attr: `src`, value: this.video}, {attr: `type`, value: `video/mp4`} ]
                }, {
                    tag: `div`
                }, {
                    tag: `span`,
                    properties: [ {prop: `textContent`, value: this.title} ]
                }, {
                    tag: `i`,
                    attributes: [ {attr: `class`, value: `fa-solid fa-heart`} ]
                    // use an arrow function expression so 'this' points to the photographer
                    // instance inside it and it is possible to access the superclass's method
                } ].map(x => this.create(x));

            // append source as child nodes to video
            [ source  ].forEach(x => video.appendChild(x));

            // append span and i as child nodes to inner div
            [ span, i  ].forEach(x => div2.appendChild(x));

            // append img and inner div as child nodes to outer div
            [ video, div2 ].forEach(x => div1.appendChild(x));

            // return
            return div1;
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
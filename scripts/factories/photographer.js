/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */

// destructuring assignment on function parameters will
// be used whenever possible to set local variables values

const
    // base class for the factory - it will be extended to provide objects with
    // the ability to create new elements in the DOM and with methods to override
    photographer = class {
        // constructor
        constructor({name = null, id = null, city = null, country = null, tagline = null, price = null, portrait = null}) {
            // assign properties
            this.name = name;
            this.id = id;
            this.city = city;
            this.country = country;
            this.tagline = tagline;
            this.price = price;
            this.portrait = `assets/photographers/${ portrait }`;
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
    photographerCard = class extends photographer {
        // use a factory function to override the superclass method and create the photographer
        // card in the DOM - the factory function is a functional programming concept and should
        // not be confused with the factory pattern which is a design pattern
        get() {
            const
                // specify new DOM elements to create
                [ article, img, a, h2, div, span1, span2, span3 ] = [ {
                    tag: `article`
                }, {
                    tag: `img`,
                    attributes: [ {attr: `src`, value: this.portrait} ]
                }, {
                    tag: `a`,
                    attributes: [ {attr: `href`, value: `photographer.html?pid=${ String(this.id) }`} ]
                }, {
                    tag: `h2`,
                    properties: [ {prop: `textContent`, value: this.name} ]
                }, {
                    tag: `div`
                }, {
                    tag: `span`,
                    properties: [ {prop: `textContent`, value: `${ this.city }, ${ this.country }`} ]
                }, {
                    tag: `span`,
                    properties: [ {prop: `textContent`, value: this.tagline} ]
                }, {
                    tag: `span`,
                    properties: [ {prop: `textContent`, value: `${ String(this.price) }€/jour`} ]
                // use an arrow function expression so 'this' points to the photographer
                // instance inside it and it is possible to access the superclass's method
                } ].map(x => this.create(x));

            // append new spans as child nodes to div
            [ span1, span2, span3 ].forEach(x => div.appendChild(x));

            // append img and h2 as child nodes to a
            [ img, h2 ].forEach(x => a.appendChild(x));

            // append a and div as child nodes to article
            [ a, div ].forEach(x => article.appendChild(x));

            // return
            return article;
        }

    },
    // constructor is not specified since it would be empty
    photographerHeader = class extends photographer {
        // use another factory function to create the photographer header in the DOM
        get() {
            const
                // specify new DOM elements to create
                [ div1, div2, h1, span1, span2, button, img ] = [ {
                    tag: `div`,
                    attributes: [ {attr: `class`, value: `photograph-header`} ]
                }, {
                    tag: `div`
                }, {
                    tag: `h1`,
                    properties: [ {prop: `textContent`, value: this.name} ]
                }, {
                    tag: `span`,
                    properties: [ {prop: `textContent`, value: `${ this.city }, ${ this.country }`} ]
                }, {
                    tag: `span`,
                    properties: [ {prop: `textContent`, value: this.tagline} ]
                }, {
                    tag: `button`,
                    attributes: [ {attr: `id`, value: `contact-open`}, {attr: `class`, value: `contact_button`} ],
                    properties: [ {prop: `textContent`, value: `Contactez-moi`} ]
                }, {
                    tag: `img`,
                    attributes: [ {attr: `src`, value: this.portrait} ]
                    // use an arrow function expression so 'this' points to the photographer
                    // instance inside it and it is possible to access the superclass's method
                } ].map(x => this.create(x));

            // append h1 and new spans as child nodes to inner div
            [ h1, span1, span2 ].forEach(x => div2.appendChild(x));

            // append div2, button and img as child nodes to header div
            [ div2, button, img ].forEach(x => div1.appendChild(x));

            // return header div
            return div1;
        }
    },
    // actual photographer factory
    photographerFactory = function(type, data) {
        // select the instance to create
        switch (type) {
        case `card` :
            return new photographerCard(data);
        case `header` :
            return new photographerHeader(data);
        default :
            throw new TypeError(`primitive value is not of the expected type`);
        }
    };

export {photographerFactory};
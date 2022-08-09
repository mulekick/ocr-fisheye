/* eslint-disable no-invalid-this */
/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */

// import modules
import {MEDIA_SORT_POPULAR, MEDIA_SORT_DATE, MEDIA_SORT_TITLE, manageMediaLikes} from "../utils/utils.js";
import {domNodeCreator} from "../utils/nodeCreator.js";
import {mediaFactory} from "./media.js";


// destructuring assignment on function parameters will
// be used whenever possible to set local variables values

const
    // base class for the factory; it will be extended to provide objects with methods to override
    photographer = class extends domNodeCreator {
        // constructor
        constructor({name = null, id = null, city = null, country = null, tagline = null, price = null, portrait = null}) {
            // call superclass constructor
            super();
            // assign properties
            this.name = name;
            this.id = id;
            this.city = city;
            this.country = country;
            this.tagline = tagline;
            this.price = price;
            this.portrait =  portrait === null ? null : `assets/photographers/${ portrait }`;
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
                    attributes: [ {attr: `class`, value: `photographer-header`} ]
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
    // use a constructor there to store the media list
    photographerSortMedia = class extends photographer {
        // constructor
        constructor(data, media) {
            // call superclass constructor
            super(data);
            // assign properties
            this.media = media;
        }

        // use another factory function to create the photographer sorting div in the DOM
        get(plikes) {
            const
                // specify new DOM elements to create
                [ div1, label, div2, select, option1, option2, option3, i ] = [ {
                    tag: `div`,
                    attributes: [ {attr: `class`, value: `photographer-sort-media`} ]
                }, {
                    tag: `label`,
                    attributes: [ {attr: `for`, value: `select-sort-media`} ],
                    properties: [ {prop: `textContent`, value: `Trier par`} ]
                }, {
                    tag: `div`,
                    attributes: [ {attr: `class`, value: `select-sort-media-wrapper`} ]
                }, {
                    tag: `select`,
                    attributes: [ {attr: `id`, value: `select-sort-media`} ],
                    listeners: [ {
                        event: `change`,
                        // use an arrow function expression so 'this' points to the photographer
                        // instance inside it and it is possible to access the superclass's method
                        callback: e => {

                            let
                                // retrieve media list
                                list = document.querySelector(`.photographer-media-list`);

                            if (list !== null)
                                // delete current media list
                                list.remove();

                            // create new media list
                            list = this.create({
                                tag: `div`,
                                attributes: [ {attr: `class`, value: `photographer-media-list`} ]
                            });

                            // populate media list
                            this.media
                                .sort((a, b) => {
                                    switch (e.target.value) {
                                    // sort by likes, descending
                                    case MEDIA_SORT_POPULAR :
                                        return b[`likes`] - a[`likes`];
                                    // sort by date, descending
                                    case MEDIA_SORT_DATE :
                                        return new Date(b[`date`]).getTime() - new Date(a[`date`]).getTime();
                                    // sort by title, ascending
                                    case MEDIA_SORT_TITLE :
                                        return a[`title`] > b[`title`] ? 1 : b[`title`] > a[`title`] ? -1 : 0;
                                    // don't sort
                                    default :
                                        return 0;
                                    }
                                })
                                .forEach(x => {
                                    const
                                        // create a new media object instance
                                        media = mediaFactory(x);
                                    // retrieve a new element for the media and add it to DOM, bind like management
                                    // function to the photographer sorting object to preserve a reference to it as
                                    // well as to the photographer likes object during listener's callback execution
                                    list.appendChild(media.get(manageMediaLikes.bind(this, media, plikes)));
                                });

                            // append media list to DOM
                            document.querySelector(`#main`).appendChild(list);

                        }
                    } ]
                }, {
                    tag: `option`,
                    attributes: [ {attr: `value`, value: MEDIA_SORT_POPULAR}, {attr: `selected`, value: `true`} ],
                    properties: [ {prop: `textContent`, value: `Popularité`} ]
                }, {
                    tag: `option`,
                    attributes: [ {attr: `value`, value: MEDIA_SORT_DATE} ],
                    properties: [ {prop: `textContent`, value: `Date`} ]
                }, {
                    tag: `option`,
                    attributes: [ {attr: `value`, value: MEDIA_SORT_TITLE} ],
                    properties: [ {prop: `textContent`, value: `Titre`} ]
                }, {
                    tag: `i`,
                    attributes: [ {attr: `class`, value: `fa-solid fa-angle-up`} ]
                } ].map(x => this.create(x));

            // append options to select
            [ option1, option2, option3 ].forEach(x => select.appendChild(x));

            // append select and i to wrapper div
            [ select, i ].forEach(x => div2.appendChild(x));

            // append label and wrapper div to sorting div
            [ label, div2 ].forEach(x => div1.appendChild(x));

            // return sorting div
            return div1;
        }
    },
    // constructor is not specified since it would be empty
    photographerLikes = class extends photographer {
        // use another factory function to create the photographer sorting div in the DOM
        get(media) {
            const
                // specify new DOM elements to create
                [ div, span1, i, span2 ] = [ {
                    tag: `div`,
                    attributes: [ {attr: `class`, value: `photographer-likes`} ]
                }, {
                    tag: `span`,
                    // eslint-disable-next-line no-param-reassign
                    properties: [ {prop: `textContent`, value: `${ media.reduce((r, x) => (r += x[`likes`]), 0) } `} ]
                }, {
                    tag: `i`,
                    attributes: [ {attr: `class`, value: `fa-solid fa-heart`} ]
                }, {
                    tag: `span`,
                    properties: [ {prop: `textContent`, value: `${ this.price }€ / jour`} ]
                } ].map(x => this.create(x));

            // append i to span 1
            [ i ].forEach(x => span1.appendChild(x));

            // append span 1 and 2 div
            [ span1, span2 ].forEach(x => div.appendChild(x));

            // return likes div
            return div;
        }
    },
    // actual photographer factory
    photographerFactory = function(type, data, media) {
        // select the instance to create
        switch (type) {
        case `card` :
            return new photographerCard(data);
        case `header` :
            return new photographerHeader(data);
        case `sorting` :
            return new photographerSortMedia(data, media);
        case `likes` :
            return new photographerLikes(data, media);
        default :
            throw new TypeError(`invalid values provided, photographer factory can't return an object`);
        }
    };

export {photographerFactory};
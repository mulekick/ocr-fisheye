/* eslint-disable no-constructor-return */
/* eslint-disable no-invalid-this */
/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */

// import modules
import {MEDIA_SORT_POPULAR, MEDIA_SORT_DATE, MEDIA_SORT_TITLE, manageMediaLikes, openLightbox, manageKeyPress} from "../utils/utils.js";
import {displayModal, closeModal, logFormData} from "../utils/contactForm.js";
import {domNodeCreator} from "../utils/nodeCreator.js";
import {mediaFactory} from "./media.js";


// destructuring assignment on function parameters will
// be used whenever possible to set local variables values

const
    // -------------------------------------------------------
    // use a singleton to manage the lightbox
    lightboxSingleton = class extends domNodeCreator {
        // constructor
        constructor(pmedialist) {
            // call superclass constructor
            super();
            const
                // retrieve constructor function
                cf = Object.getPrototypeOf(this).constructor;
            // if the static singleton is not null ...
            if (cf.instance instanceof cf)
                // return it (any call to new() will always return the same object)
                return cf.instance;
            // else, create the singleton and init its properties
            this.mediaList = pmedialist;
            this.currentIndex = null;
            // store 'this' in the static singleton, return is implicit
            cf.instance = this;
        }

        // value getter
        get index() { return this.currentIndex; }

        // value setter
        set index(i) { this.currentIndex = i; }

        // use a factory function to create the photographer lightbox div in the DOM
        get() {
            const
                // specify new DOM elements to create
                [ div1, div2, div3, btn1, img1, div5, btn2, img2, btn3, img3, span ] = [ {
                    tag: `div`,
                    attributes: [ {attr: `class`, value: `media-lightbox-container`} ]
                }, {
                    tag: `div`,
                    attributes: [ {attr: `class`, value: `media-lightbox`}, {attr: `tabindex`, value: `0`}, {attr: `aria-label`, value: `image closeup view`} ]
                }, {
                    tag: `div`
                },
                {
                    tag: `button`,
                    // navigate to previous media
                    listeners: [ {event: `click`, callback: () => this.display(this.index > 0, this.index--)} ]
                }, {
                    tag: `img`,
                    attributes: [ {attr: `src`, value: `assets/icons/navigate-left-lightbox.svg`}, {attr: `aria-label`, value: `Previous image`} ]
                }, {
                    tag: `div`
                },
                {
                    tag: `button`,
                    // close lightbox
                    listeners: [ {event: `click`, callback: () => this.display(false)} ]
                },
                {
                    tag: `img`,
                    attributes: [ {attr: `src`, value: `assets/icons/close-lightbox.svg`}, {attr: `aria-label`, value: `Close dialog`} ]
                },
                {
                    tag: `button`,
                    // navigate to next media
                    listeners: [ {event: `click`, callback: () => this.display(this.index < this.mediaList.media.length - 1, this.index++)} ]
                },  {
                    tag: `img`,
                    attributes: [ {attr: `src`, value: `assets/icons/navigate-right-lightbox.svg`}, {attr: `aria-label`, value: `Next image`} ]
                }, {
                    tag: `span`
                } ].map(x => this.create(x)),

                // retrieve media div
                div4 = mediaFactory(this.mediaList.media[this.index]).lightbox();

            // append img1 to btn1
            [ img1 ].forEach(x => btn1.appendChild(x));

            // append btn1 to div3
            [ btn1 ].forEach(x => div3.appendChild(x));

            // append img2 to btn2 and img3 to btn3
            [ img2 ].forEach(x => btn2.appendChild(x));
            [ img3 ].forEach(x => btn3.appendChild(x));

            // append btn2, btn3 and span to div5
            [ btn2, btn3, span ].forEach(x => div5.appendChild(x));

            // append div3, media div and div5 to div2
            [ div3, div4, div5 ].forEach(x => div2.appendChild(x));

            // append div2 to div1
            [ div2 ].forEach(x => div1.appendChild(x));

            // return lightbox div
            return div1;
        }

        // manage lightbox display
        display(v) {

            const lb = document.querySelector(`.media-lightbox-container`);

            // remove current lightbox
            if (lb)
                lb.remove();

            // display new lightbox
            if (v) {

                // hide header and main on photographer page
                [ `header`, `main` ].forEach(x => document.querySelector(x).setAttribute(`style`, `display:none`));

                // open current media in new lightbox
                document.querySelector(`body`).append(this.get());

                // add event listener for arrow keys press
                document.addEventListener(`keydown`, manageKeyPress);

                // set focus
                document.querySelector(`.media-lightbox`).focus();

            // hide lightbox
            } else {

                // display header and main on photographer page
                [ `header`, `main` ].forEach(x => document.querySelector(x).removeAttribute(`style`));

                // remove event listener for arrow keys press
                document.removeEventListener(`keydown`, manageKeyPress);

            }
        }
    },
    // -------------------------------------------------------
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
                [ article, img, a, h2, div, p1, p2, p3 ] = [ {
                    tag: `article`
                }, {
                    tag: `img`,
                    attributes: [ {attr: `src`, value: this.portrait}, {attr: `alt`, value: ``} ]
                }, {
                    tag: `a`,
                    attributes: [ {attr: `href`, value: `photographer.html?pid=${ String(this.id) }`} ]
                }, {
                    tag: `h2`,
                    properties: [ {prop: `textContent`, value: this.name} ]
                }, {
                    tag: `div`
                }, {
                    tag: `p`,
                    properties: [ {prop: `textContent`, value: `${ this.city }, ${ this.country }`} ]
                }, {
                    tag: `p`,
                    properties: [ {prop: `textContent`, value: this.tagline} ]
                }, {
                    tag: `p`,
                    properties: [ {prop: `textContent`, value: `${ String(this.price) }€/jour`} ]
                // use an arrow function expression so 'this' points to the photographer
                // instance inside it and it is possible to access the superclass's method
                } ].map(x => this.create(x));

            // append new ps as child nodes to div
            [ p1, p2, p3 ].forEach(x => div.appendChild(x));

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
                [ div1, div2, h1, p1, p2, button, img ] = [ {
                    tag: `div`,
                    attributes: [ {attr: `class`, value: `photographer-header`} ]
                }, {
                    tag: `div`
                }, {
                    tag: `h1`,
                    properties: [ {prop: `textContent`, value: this.name} ]
                }, {
                    tag: `p`,
                    properties: [ {prop: `textContent`, value: `${ this.city }, ${ this.country }`} ]
                }, {
                    tag: `p`,
                    properties: [ {prop: `textContent`, value: this.tagline} ]
                }, {
                    tag: `button`,
                    attributes: [ {attr: `id`, value: `contact-open`}, {attr: `class`, value: `contact_button`}, {attr: `aria-label`, value: `Contact Me`} ],
                    properties: [ {prop: `textContent`, value: `Contactez-moi`} ],
                    // open contact form
                    listeners: [ {
                        event: `click`,
                        callback: () => {
                            // update form title
                            document.querySelector(`.modal > header > h2`).textContent = `Contactez-moi ${ this.name }`;
                            // add event listeners to popup
                            document.querySelector(`#contact-close`).addEventListener(`click`, closeModal);
                            document.querySelector(`#contact-form`).addEventListener(`submit`, logFormData);
                            // launch popup
                            displayModal();
                        }
                    } ]
                }, {
                    tag: `img`,
                    attributes: [ {attr: `src`, value: this.portrait}, {attr: `alt`, value: ``} ]
                    // use an arrow function expression so 'this' points to the photographer
                    // instance inside it and it is possible to access the superclass's method
                } ].map(x => this.create(x));

            // append h1 and new ps as child nodes to inner div
            [ h1, p1, p2 ].forEach(x => div2.appendChild(x));

            // append div2, button and img as child nodes to header div
            [ div2, button, img ].forEach(x => div1.appendChild(x));

            // return header div
            return div1;
        }
    },
    // use a constructor there to store the media list
    photographerMediaList = class extends photographer {
        // constructor
        constructor(data, media) {
            // call superclass constructor
            super(data);
            // assign properties
            this.media = media;
            // use a singleton to manage the lightbox display
            this.lightbox = new lightboxSingleton(this);
        }

        // use another factory function to create the photographer media list div in the DOM
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
                    attributes: [ {attr: `id`, value: `select-sort-media`}, {attr: `aria-label`, value: `Order by`} ],
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
                                .forEach((x, index) => {
                                    const
                                        // create a new media object instance
                                        media = mediaFactory(x);
                                    // retrieve a new element for the media and add it to DOM, bind like management
                                    // function to the photographer media list object to preserve a reference to it
                                    // as well as to the photographer likes object during listener's callback execution
                                    list.appendChild(media.get(manageMediaLikes.bind(this, media, plikes), openLightbox.bind(this, index)));
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

            // append label and wrapper div to list div
            [ label, div2 ].forEach(x => div1.appendChild(x));

            // return list div
            return div1;
        }
    },
    // constructor is not specified since it would be empty
    photographerLikes = class extends photographer {
        // use another factory function to create the photographer likes div in the DOM
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
                    attributes: [ {attr: `class`, value: `fa-solid fa-heart`}, {attr: `aria-label`, value: `likes`} ]
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
        case `list` :
            return new photographerMediaList(data, media);
        case `likes` :
            return new photographerLikes(data, media);
        default :
            throw new TypeError(`invalid values provided, photographer factory can't return an object`);
        }
    };

export {photographerFactory};
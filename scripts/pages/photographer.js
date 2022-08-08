// eslint-disable-next-line no-unused-vars

// import modules
import {MEDIA_SORT_POPULAR, MEDIA_SORT_DATE, MEDIA_SORT_TITLE} from "../utils/sorting.js";
import {displayModal, closeModal} from "../utils/contactForm.js";
import {photographerFactory} from "../factories/photographer.js";
import {mediaFactory} from "../factories/media.js";

// use an async IIFE so we are able to wait for the resolution of promises during execution
(async() => {

    try {

        const
            // validate current url using regexp
            match = document.location.href.match(/^(?:http|https):\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+(?::\d+)?\/[^ "]+\?pid=(?<photographer>\d+)$/u);

        if (match === null)
            // throw error if parameter is missing
            throw new Error(`invalid url`);

        const
            // store the id, we don't want to pop multiple times during array search weSmart
            photographerId =  Number(match.pop()),
            // retrieve static photographers data from server using fetch
            readable = await fetch(`/data/photographers.json`, {method: `GET`}),
            // parse response stream into a JSON object using json() method
            // destructure the object to retrieve photographers data array
            {photographers, media} = await readable.json(),
            // retrieve current photographer data and media using url parameter
            photographerData = photographers.find(x => x[`id`] === photographerId),
            // retrieve current photographer media
            photographerMedia = media.filter(x => x[`photographerId`] === photographerId);

        if (typeof photographerData === `undefined`)
            // throw error if data is not found
            throw new Error(`invalid url`);

        const
            // create a new photographer header object instance
            pheader = photographerFactory(`header`, photographerData),
            // create a new photographer sorting object instance
            psorting = photographerFactory(`sorting`, photographerData),
            // declare the media sorting function
            bindSort = function(...[ medias, element, event ]) {

                // clear media list
                element.replaceChildren();

                // populate media list
                medias
                    .sort((a, b) => {
                        switch (event.target.value) {
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
                    // create a new media object instance, retrieve a new element for the media and add it to DOM
                    .forEach(x => element.appendChild(mediaFactory(x).get()));

            // bind function to the photographer sorting object to preserve a reference to it as well
            // as to the media list and the media display div during listener's callback execution
            }.bind(psorting, photographerMedia, document.querySelector(`.photographer-media-list`));

        // create a new element for the photographer header and add it to DOM
        document.querySelector(`#main`).insertBefore(pheader.get(), document.querySelector(`.photographer-media-list`));

        // create a new element for the photographer sorting and add it to DOM
        document.querySelector(`#main`).insertBefore(psorting.get(bindSort), document.querySelector(`.photographer-media-list`));

        // dispatch a change event on the select to display photographer's media sorted by default
        document.querySelector(`#select-sort-media`).dispatchEvent(new Event(`change`));

        // add event listeners to modal popup
        document.querySelector(`#contact-open`).addEventListener(`click`, displayModal);
        document.querySelector(`#contact-close`).addEventListener(`click`, closeModal);

    } catch (err) {
        // write to stderr
        console.error(`error: ${ err.message }`);
    }

})();
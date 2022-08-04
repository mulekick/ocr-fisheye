// eslint-disable-next-line no-unused-vars
import {displayModal, closeModal} from "../utils/contactForm.js";
// import modules
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
            // create a new photographer object instance
            pheader = photographerFactory(`header`, photographerData);

        // create a new element for the photographer header and add it to DOM
        document.querySelector(`#main`).insertBefore(pheader.get(), document.querySelector(`.photograph-media-list`));

        // populate media list
        photographerMedia.forEach(x => {
            const
                // create a new media object instance
                pmedia = mediaFactory(x);
            // create a new element for the photographer card and add it to DOM
            document.querySelector(`.photograph-media-list`).appendChild(pmedia.get());
        });

        // add event listeners to modal popup
        document.querySelector(`#contact-open`).addEventListener(`click`, displayModal);
        document.querySelector(`#contact-close`).addEventListener(`click`, closeModal);

    } catch (err) {
        // write to stderr
        console.error(`error: ${ err.message }`);
    }

})();
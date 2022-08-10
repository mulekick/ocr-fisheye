// eslint-disable-next-line no-unused-vars

// import modules
import {RGX_URL_VALIDATION} from "../utils/utils.js";
import {displayModal, closeModal, logFormData} from "../utils/contactForm.js";
import {photographerFactory} from "../factories/photographer.js";

// use an async IIFE so we are able to wait for the resolution of promises during execution
(async() => {

    try {

        const
            // validate current url using regexp
            match = document.location.href.match(RGX_URL_VALIDATION);

        if (match === null)
            // throw error if url is invalid
            throw new Error(`invalid url`);

        const
            // extract site path and photographer id
            {groups: {path, photographer}} = match,
            // store photographer id
            photographerId =  Number(photographer),
            // retrieve static photographers data from server using fetch
            readable = await fetch(`${ path || `` }data/photographers.json`, {method: `GET`}),
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
            // create a new photographer media list object instance
            pmedialist = photographerFactory(`list`, photographerData, photographerMedia),
            // create a new photographer likes object instance
            plikes = photographerFactory(`likes`, photographerData);

        // create new elements for the photographer header, media list and likes and add it to DOM
        document.querySelector(`#main`).append(pheader.get(), pmedialist.get(plikes), plikes.get(pmedialist.media));

        // dispatch a change event on the select to display photographer's media list sorted by default
        document.querySelector(`#select-sort-media`).dispatchEvent(new Event(`change`));

        // add event listeners to modal popup
        document.querySelector(`#contact-open`).addEventListener(`click`, displayModal);
        document.querySelector(`#contact-close`).addEventListener(`click`, closeModal);
        document.querySelector(`#contact-form`).addEventListener(`submit`, logFormData);

    } catch (err) {
        // write to stderr
        console.error(`error: ${ err.message }`);
    }

})();
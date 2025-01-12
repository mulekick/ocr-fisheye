// import modules
import {RGX_URL_VALIDATION} from "../utils/utils.js";
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
            // extract site path
            {groups: {path}} = match,
            // retrieve static photographers data from server using fetch
            readable = await fetch(`${ path || `` }data/photographers.json`, {method: `GET`}),
            // parse response stream into a JSON object using json() method
            // destructure the object to retrieve photographers data array
            {photographers} = await readable.json();

        // display photographers data
        photographers
            // loop on each photographers data array's element
            .forEach(x => {
                const
                    // create a new photographer card object instance
                    pcard = photographerFactory(`card`, x);
                // create a new element for the photographer card and add it to DOM
                document.querySelector(`.photographer_section`).appendChild(pcard.get());
            });

    } catch (err) {
        // write to stderr
        console.error(`error: ${ err.message }`);
    }

})();
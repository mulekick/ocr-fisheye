/* eslint-disable no-invalid-this */

const
    // declare media sorting order options as constants (all ascending)
    MEDIA_SORT_POPULAR = `sortPopular`,
    MEDIA_SORT_DATE = `sortDate`,
    MEDIA_SORT_TITLE = `sortTitle`,
    // url validation regex
    RGX_URL_VALIDATION = /^(?:http|https):\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+(?::\d+)?(?<path>\/(?:[^ "]+\/)*)(?<page>[^ "?]+)?(?:\?pid=(?<photographer>\d+))?#?$/u,
    // 'like' click event listener callback
    manageMediaLikes = function(...[ media, plikes, event ]) {
        const
            // retrieve liked media index
            index = this.media.findIndex(x => x[`id`] === media.id);

        // throw error if media not found
        if (index === -1)
            throw new Error(`invalid media id`);

        // update media 'liked' state
        this.media[index][`liked`] = !this.media[index][`liked`];

        // update media likes
        this.media[index][`likes`] += this.media[index][`liked`] ? 1 : -1;

        const
            // retrieve likes display div
            likes = document.querySelector(`.photographer-likes`);

        if (likes !== null)
            // delete current likes display div
            likes.remove();

        // create new elements for the photographer likes display div and add it to DOM
        document.querySelector(`#main`).append(plikes.get(this.media));

        // update likes on current media
        event.target.previousElementSibling.textContent = this.media[index][`likes`];
    },
    // 'open lightbox' click event listener callback
    openLightbox = function(...[ index ]) {
        // update current lightbox media index
        this.lightbox.index = index;
        // display lightbox
        this.lightbox.display(true);
    },
    // left / right arrow keys navigation management
    manageKeyPress = e => {
        // retrieve relevant element as per pressed key
        const elt = e.code === `ArrowLeft` ? document.querySelector(`.media-lightbox > div:nth-child(1) > button`) : e.code === `ArrowRight` ? document.querySelector(`.media-lightbox > div:nth-child(3) > button:nth-child(2)`) : null;
        // dispatch click event
        if (elt)
            elt.dispatchEvent(new Event(`click`));
    };

export {MEDIA_SORT_POPULAR, MEDIA_SORT_DATE, MEDIA_SORT_TITLE, RGX_URL_VALIDATION, manageMediaLikes, openLightbox, manageKeyPress};
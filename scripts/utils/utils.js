/* eslint-disable no-invalid-this */

const
    // declare media sorting order options as constants (all ascending)
    MEDIA_SORT_POPULAR = `sortPopular`,
    MEDIA_SORT_DATE = `sortDate`,
    MEDIA_SORT_TITLE = `sortTitle`,
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
    openLightbox = function(...[ media ]) {
        const
            // retrieve opened media index
            index = this.media.findIndex(x => x[`id`] === media.id);

        // throw error if media not found
        if (index === -1)
            throw new Error(`invalid media id`);

        // create new elements for the photographer lightbox div and add it to DOM
        document.querySelector(`body`).append(this.lightbox.get(media));
    };

export {MEDIA_SORT_POPULAR, MEDIA_SORT_DATE, MEDIA_SORT_TITLE, manageMediaLikes, openLightbox};
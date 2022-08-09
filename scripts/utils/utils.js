/* eslint-disable no-invalid-this */
const
    // declare media sorting order options as constants (all ascending)
    MEDIA_SORT_POPULAR = `sortPopular`,
    MEDIA_SORT_DATE = `sortDate`,
    MEDIA_SORT_TITLE = `sortTitle`,
    // declare the likes management function
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
    };

export {MEDIA_SORT_POPULAR, MEDIA_SORT_DATE, MEDIA_SORT_TITLE, manageMediaLikes};
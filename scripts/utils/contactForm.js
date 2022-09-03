const
    displayModal = function() {
        // hide header and main on photographer page
        [ `header`, `main` ].forEach(x => document.querySelector(x).setAttribute(`style`, `display:none`));
        // display contact form
        [ `#contact_modal` ].forEach(x => document.querySelector(x).setAttribute(`style`, `display:block`));
        // set focus
        document.querySelector(`#contact_modal`).focus();
    },
    closeModal = function() {
        // hide contact form
        [ `#contact_modal` ].forEach(x => document.querySelector(x).removeAttribute(`style`));
        // display header and main on photographer page
        [ `header`, `main` ].forEach(x => document.querySelector(x).removeAttribute(`style`));
    },
    logFormData = function(e) {
        // prevent form submission
        e.preventDefault();

        const
            // retrieve form data
            data = new FormData(e.target);

        // destructure current entry into local variables
        for (const [ key, value ] of data)
            // log
            console.log(`field ${ key }: ${ value }\n`);

        // close form
        closeModal();
    };

export {displayModal, closeModal, logFormData};

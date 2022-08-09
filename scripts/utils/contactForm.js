const
    displayModal = function() {
        const modal = document.getElementById(`contact_modal`);
        modal.style.display = `block`;
    },
    closeModal = function() {
        const modal = document.getElementById(`contact_modal`);
        modal.style.display = `none`;
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
    };

export {displayModal, closeModal, logFormData};

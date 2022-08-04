const
    displayModal = function() {
        const modal = document.getElementById(`contact_modal`);
        modal.style.display = `block`;
    },
    closeModal = function() {
        const modal = document.getElementById(`contact_modal`);
        modal.style.display = `none`;
    };

export {displayModal, closeModal};

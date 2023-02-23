/**
 * Open modal with info selected command
 * @param {*} event
 * @param {object} info
 */
export const openModal = (event, info) => {
    // Show modal
    const overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "flex";
    console.log("info: ", info)
}

/**
 * Close modal
 * @param {*} event
 */
export const closeModal = (event) => {
    const btn_close_modal = document.getElementById("btn-close-modal");
    btn_close_modal.addEventListener("click", () => {
        const overlay = document.getElementsByClassName("overlay")[0];
        overlay.style.display = "none";
    });
}
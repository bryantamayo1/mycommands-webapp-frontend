/**
 * Handle modal of version: open and close
 */
export const handleModalVersionApp = () => {
    openVersionApp();
    closeModalVersionApp();
}

/**
 * Open Modal
 */
const openVersionApp = () => {
    const version_app = document.getElementsByClassName("version-app")[0];
    const overlay = document.getElementsByClassName("modal-version")[0];
    version_app.addEventListener("click", () => {
        // Show modal
        overlay.style.display = "flex";
    });
}

/**
 * Close Modal
 */
const closeModalVersionApp = () => {
    const btn = document.getElementsByClassName("modal-version__btn-close")[0];
    btn.addEventListener("click", () => {   
        const overlay = document.getElementsByClassName("modal-version")[0];
        // Hide modal
        overlay.style.display = "none";
    });
}
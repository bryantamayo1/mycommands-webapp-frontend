/**
 * Open modal with info selected command
 * @param {*} event
 * @param {object} info
 * @param {string} lang
 */
export const openModal = (event, info, lang) => {
    // Show modal
    const overlay = document.getElementsByClassName("overlay")[0];
    const overlay__command = document.getElementsByClassName("overlay__command")[0];
    const overlay__meaning = document.getElementsByClassName("overlay__meaning")[0];

    // Reset command and meaning in modal
    overlay__command.innerHTML = "";
    overlay__meaning.innerHTML = "";
    
    // Chage color in character hash #
    if(info[lang].charAt(0) === "#"){
        const span = document.createElement("span");
        span.innerHTML = "# ";
        span.classList.add("hash-in-meaning");   
        overlay__meaning.appendChild(span);
        overlay__meaning.appendChild( document.createTextNode(info[lang].slice(2, info[lang].length)) );
    }else{
        overlay__meaning.appendChild( document.createTextNode(info[lang].slice(2, info[lang].length)) );
    }

    overlay__command.innerHTML = info.command;
    overlay.style.display = "flex";
}

/**
 * Close modal with btn and outside of modal
 * @param {*} event
 */
export const closeModal = (event) => {
    // Close with btn
    const btn_close_modal = document.getElementById("btn-close-modal");
    btn_close_modal.addEventListener("click", () => {
        const overlay = document.getElementsByClassName("overlay")[0];
        overlay.style.display = "none";
    });

    // Close outside of modal
    const overlay = document.getElementsByClassName("overlay")[0];
    overlay.addEventListener("click", (event_overlay) => {
        const overlay__modal = document.getElementsByClassName("overlay__modal")[0];
        if(!overlay__modal.contains(event_overlay.target)){
            overlay.style.display = "none";
        }
    });
}
document.addEventListener('DOMContentLoaded', function() {
    const addBox = document.querySelector(".add-box");
    const popupBox = document.querySelector(".popup-box");
    const popupTitle = popupBox.querySelector("header p");
    const closeIcon = popupBox.querySelector("header i");
    const addBtn = popupBox.querySelector("button");

    addBox.addEventListener("click", () => {
        popupTitle.innerText = "Add a new Note";
        addBtn.innerText = "Add Note";
        popupBox.classList.add("show");
        document.querySelector("body").style.overflow = "hidden";
    });

    closeIcon.addEventListener("click", () => {
        popupBox.classList.remove("show");
        document.querySelector("body").style.overflow = "auto";
    });
});

document.querySelectorAll(".item img").forEach((img) => {
        img.addEventListener("click", (e) => {
            //run modal function
            imgModal(e.target.src);
        });
    });
//creating the modal
function imgModal(src){
    const modal = document.createElement("div");
    modal.setAttribute("class", "modal");
    //add the modal to the main section or the root element of the page
    document.querySelector(".ajax-page-content").append(modal);
    //adding image to modal
    const newImage = document.createElement("img");
    newImage.setAttribute("src", src);
    //creating the close button
    const closeBtn = document.createElement("i");
    closeBtn.setAttribute("class", "fas fa-times closeBtn");
    //close function
    closeBtn.onclick = () => {
        modal.remove();
    };
    modal.append(newImage, closeBtn);
};
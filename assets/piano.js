document.querySelectorAll(".position").forEach(el=>{
    el.addEventListener("click", event=>{
        el.classList.add("highlighted")
    })
})
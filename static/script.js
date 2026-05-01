var navbar = document.getElementById("navbarrrrrr");

window.addEventListener("scroll", ()=>{
    var scrolltop = document.documentElement.scrollTop || document.body.scrollTop > 200;
    if(scrolltop > 100){
        navbar.style.top = "0"
    }else{
        navbar.style.top = "-100%";
    }
})
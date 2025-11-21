const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");
const hamburger = document.getElementById("hamburgerIcon");
const sidebarContent = document.querySelector(".sidebar-content");

toggleBtn.addEventListener("click", () => {
  if (!sidebar.classList.contains("open")) {
    sidebar.classList.add("open");
    hamburger.classList.add("is-active");

    setTimeout(() => {
      sidebarContent.classList.add("show-links");
    }, 50);
  } else {
    setTimeout(() => {
      sidebar.classList.remove("open");
      hamburger.classList.remove("is-active");
    }, 0);
  }
});

let itemCard = document.getElementById("itemCard");

itemCard.addEventListener("click", function () {
  console.log(itemCard);
});

// =====================
// SIDEBAR
// =====================
// =====================
// SIDEBAR TOGGLE
// =====================
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");
const hamburger = document.getElementById("hamburgerIcon");
const sidebarContent = document.querySelector(".sidebar-content");

toggleBtn.addEventListener("click", () => {
  if (!sidebar.classList.contains("open")) {
    sidebar.classList.add("open");
    hamburger.classList.add("is-active");
    setTimeout(() => sidebarContent.classList.add("show-links"), 50);
  } else {
    sidebar.classList.remove("open");
    hamburger.classList.remove("is-active");
  }
});

// =====================
// CLOSE SIDEBAR WHEN CLICKING ANY LINK
// =====================
document.querySelectorAll(".sidebar-content a").forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("open");
    hamburger.classList.remove("is-active");
    sidebarContent.classList.remove("show-links");
  });
});


// =====================
// FETCH MEALS ON LOAD
// =====================
async function getMeals() {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s="
  );
  const data = await res.json();
  displayMeals(data.meals);
}

// =====================
// DISPLAY MEALS
// =====================
function displayMeals(meals) {
  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";

  if (!meals) {
    container.innerHTML = `<h3 class="text-white text-center">No results found</h3>`;
    return;
  }

  meals.forEach((meal) => {
    const div = document.createElement("div");
    div.classList.add("col-3", "item-card");
    div.setAttribute("data-id", meal.idMeal);

    div.innerHTML = `
      <div class="img-wrapper">
        <img src="${meal.strMealThumb}" alt="">
        <div class="overlay-content">
          <h5 class="text-white m-0">${meal.strMeal}</h5>
        </div>
      </div>
    `;

    div.addEventListener("click", () => {
      getMealDetails(meal.idMeal);
      const myModal = new bootstrap.Modal(
        document.getElementById("fullScreenModal")
      );
      myModal.show();
    });

    container.appendChild(div);
  });
}

// =====================
// GET MEAL DETAILS
// =====================
async function getMealDetails(id) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await res.json();
  displayMealDetails(data.meals[0]);
}

// =====================
// DISPLAY MEAL DETAILS
// =====================
function displayMealDetails(meal) {
  document.querySelector(".left-side img").src = meal.strMealThumb;
  document.querySelector(".item-name").textContent = meal.strMeal;
  document.querySelector(".right-side p").textContent = meal.strInstructions;
  document.querySelector(
    ".right-side h3:nth-of-type(1)"
  ).innerHTML = `<span class="fw-bolder">Area : </span>${meal.strArea}`;
  document.querySelector(
    ".right-side h3:nth-of-type(2)"
  ).innerHTML = `<span class="fw-bolder">Category : </span>${meal.strCategory}`;

  const recipesList = document.querySelector(".recipes-tags");
  recipesList.innerHTML = "";
  for (let i = 1; i <= 20; i++) {
    let ingredient = meal[`strIngredient${i}`];
    let measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      const li = document.createElement("li");
      li.classList.add("alert", "alert-info", "m-2", "p-1");
      li.textContent = `${measure} ${ingredient}`;
      recipesList.appendChild(li);
    }
  }

  document.querySelector(".btn-success").href = meal.strSource || "#";
  document.querySelector(".btn-danger").href = meal.strYoutube || "#";
}

// =====================
// SIDEBAR LINKS WITHOUT DUPLICATION
// =====================
const sidebarLinks = document.querySelectorAll(".sidebar-content a");

// Search
sidebarLinks[0].addEventListener("click", (e) => {
  e.preventDefault();
  hideContactForm();
  hideItems();
  showSearchSection();
});

// Categories
sidebarLinks[1].addEventListener("click", (e) => {
  e.preventDefault();
  hideContactForm();
  hideSearch();
  showCategories();
});

// Areas
sidebarLinks[2].addEventListener("click", (e) => {
  e.preventDefault();
  hideContactForm();
  hideSearch();
  showAreas();
});

// Ingredients / Random
sidebarLinks[3].addEventListener("click", (e) => {
  e.preventDefault();
  hideContactForm();
  hideSearch();
  showIngredients();
});

// Contact Form
sidebarLinks[4].addEventListener("click", (e) => {
  e.preventDefault();
  hideSearch();
  hideItems();
  showContactForm();
});

// =====================
// HELPER FUNCTIONS
// =====================
function hideSearch() {
  const searchSection = document.getElementById("searchSection");
  searchSection.style.display = "none";
  searchSection.innerHTML = "";
}

function hideItems() {
  document.getElementById("itemsContainer").innerHTML = "";
}

function hideContactForm() {
  document.getElementById("contactFormContainer").classList.add("d-none");
}

function showContactForm() {
  document.getElementById("contactFormContainer").classList.remove("d-none");
  document.getElementById("searchSection").innerHTML = "";
  document.getElementById("itemsContainer").innerHTML = "";
  document
    .getElementById("contactFormContainer")
    .scrollIntoView({ behavior: "smooth" });
}

function showSearchSection() {
  const searchSection = document.getElementById("searchSection");
  searchSection.style.display = "block";
  searchSection.innerHTML = `
    <div class="row py-3 g-3">
      <div class="col-md-6">
        <label for="searchByName" class="form-label text-white">Search by Name</label>
        <input id="searchByName" type="text" class="form-control bg-dark text-white border-white">
      </div>
      <div class="col-md-6">
        <label for="searchByLetter" class="form-label text-white">Search by First Letter</label>
        <input id="searchByLetter" maxlength="1" type="text" class="form-control bg-dark text-white border-white">
      </div>
    </div>
  `;

  document
    .getElementById("searchByName")
    .addEventListener("input", function () {
      searchByName(this.value);
    });

  document
    .getElementById("searchByLetter")
    .addEventListener("input", function () {
      searchByFirstLetter(this.value);
    });
}

// =====================
// SEARCH FUNCTIONS
// =====================
async function searchByName(term) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  const data = await res.json();
  displayMeals(data.meals || []);
}

async function searchByFirstLetter(letter) {
  if (!letter) letter = "a";
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  const data = await res.json();
  displayMeals(data.meals || []);
}

// =====================
// CATEGORIES & AREAS
// =====================
async function showCategories() {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
  );
  const data = await res.json();
  hideSearch();
  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";

  const addedCategories = new Set();
  for (let cat of data.meals) {
    if (addedCategories.has(cat.strCategory)) continue;
    addedCategories.add(cat.strCategory);

    const res2 = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat.strCategory}`
    );
    const meals = await res2.json();
    const thumb = meals.meals?.[0]?.strMealThumb || "";

    const div = document.createElement("div");
    div.classList.add("col-3", "item-card");
    div.innerHTML = `
      <div class="img-wrapper">
        <img src="${thumb}" alt="">
        <div class="overlay-content">
          <h5 class="text-white m-0">${cat.strCategory}</h5>
        </div>
      </div>
    `;
    div.addEventListener("click", () => fetchMealsByCategory(cat.strCategory));
    container.appendChild(div);
  }
}

async function showAreas() {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  const data = await res.json();
  hideSearch();
  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";

  const addedAreas = new Set();
  for (let area of data.meals) {
    if (addedAreas.has(area.strArea)) continue;
    addedAreas.add(area.strArea);

    const res2 = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area.strArea}`
    );
    const meals = await res2.json();
    const thumb = meals.meals?.[0]?.strMealThumb || "";

    const div = document.createElement("div");
    div.classList.add("col-3", "item-card");
    div.innerHTML = `
      <div class="img-wrapper">
        <img src="${thumb}" alt="">
        <div class="overlay-content">
          <h5 class="text-white m-0">${area.strArea}</h5>
        </div>
      </div>
    `;
    div.addEventListener("click", () => fetchMealsByArea(area.strArea));
    container.appendChild(div);
  }
}

// =====================
// FETCH BY CATEGORY / AREA
// =====================
async function fetchMealsByCategory(category) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  const data = await res.json();
  displayMeals(data.meals || []);
}

async function fetchMealsByArea(area) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  const data = await res.json();
  displayMeals(data.meals || []);
}

// =====================
// SHOW MAIN INGREDIENTS (LIMITED TO MAIN ONES WITH DESCRIPTION)
// =====================
async function showIngredients() {
    hideSearch();
    hideContactForm();

    const container = document.getElementById("itemsContainer");
    container.innerHTML = "";

    const mainIngredients = [
        "Chicken",
        "Salmon",
        "Beef",
        "Pork",
        "Avocado",
        "Apple Cider Vinegar",
        "Asparagus",
        "Aubergine",
        "Baby Plum Tomatoes",
        "Bacon",
        "Baking Powder",
        "Balsamic Vinegar",
        "Basil",
        "Basil Leaves",
        "Basmati Rice",
        "Bay Leaf",
        "Bay Leaves",
        "Beef Brisket",
        "Beef Fillet",
        "Beef Gravy",
    ];

    const ingredientDescriptions = {
        "Chicken": "A domesticated bird widely consumed worldwide, versatile in cooking, roasted, grilled, or in stews.",
        "Salmon": "A fatty fish rich in omega-3s, often baked, grilled, smoked, or used in sushi and salads.",
        "Beef": "Meat from cattle, used in countless recipes, including steaks, roasts, and minced dishes globally.",
        "Pork": "Meat from domestic pigs, commonly cooked roasted, grilled, or used in bacon, sausages, and stews.",
        "Avocado": "A creamy fruit high in healthy fats, commonly used in salads, spreads, guacamole, and smoothies.",
        "Apple Cider Vinegar": "Fermented apple juice with acidic flavor, often used in dressings, marinades, and natural remedies.",
        "Asparagus": "Green stalk vegetable, tender when steamed or grilled, commonly served with olive oil, butter, or sauces.",
        "Aubergine": "Also known as eggplant, a versatile vegetable, roasted, grilled, or used in stews and Mediterranean dishes.",
        "Baby Plum Tomatoes": "Small, sweet tomatoes ideal for salads, roasting, sauces, or snacking, rich in flavor and vitamins.",
        "Bacon": "Salt-cured pork slices, typically fried or baked, adds savory, smoky flavor to breakfast and dishes.",
        "Baking Powder": "Chemical leavening agent used in baking to make cakes, muffins, and pastries light and fluffy.",
        "Balsamic Vinegar": "Dark, concentrated vinegar from Italy, with a sweet, tangy flavor perfect for dressings and marinades.",
        "Basil": "A fragrant herb used in cooking, especially Italian cuisine, for sauces, salads, and flavoring dishes.",
        "Basil Leaves": "Fresh or dried leaves of basil plant, aromatic, used to enhance soups, sauces, and salads.",
        "Basmati Rice": "Long-grain aromatic rice from Indian subcontinent, fluffy and fragrant when cooked, ideal with curries.",
        "Bay Leaf": "Aromatic leaf used in cooking to flavor soups, stews, and sauces, removed before serving.",
        "Bay Leaves": "Multiple aromatic leaves added to slow-cooked dishes to impart subtle earthy and herbal flavor.",
        "Beef Brisket": "Cut of beef from chest, slow-cooked, smoked or braised, tender and flavorful for various dishes.",
        "Beef Fillet": "Prime tender cut of beef, ideal for steaks or roasting, known for delicate texture and flavor.",
        "Beef Gravy": "Savory sauce made from beef drippings and stock, perfect to enhance meats, potatoes, and dishes."
    };

    mainIngredients.forEach(ingredient => {
        const thumb = `https://www.themealdb.com/images/ingredients/${ingredient}-Small.png`;

        const div = document.createElement("div");
        div.classList.add("col-3", "item-card", "mb-3");
        div.innerHTML = `
            <div class="img-wrapper text-center bg-dark p-2 rounded position-relative overflow-hidden">
                <img src="${thumb}" alt="${ingredient}" class="img-fluid mb-2">
                <h5 class="text-white m-0">${ingredient}</h5>
                <div class="ingredient-desc position-absolute text-white p-2">${ingredientDescriptions[ingredient]}</div>
            </div>
        `;

        // لما يدوس على المكون نجيب الأكلات المرتبطة بيه
        div.addEventListener("click", () => fetchMealsByIngredient(ingredient));
        container.appendChild(div);
    });
}

// =====================
// FETCH MEALS BY INGREDIENT
// =====================
async function fetchMealsByIngredient(ingredient) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const data = await res.json();
    displayMeals(data.meals || []);
}

// =====================
// BINDING TO SIDEBAR LINK
// =====================
document.querySelector(".sidebar-content a:nth-child(4)")
    .addEventListener("click", showIngredients);



// =====================
// CONTACT FORM VALIDATION
// =====================
const contactForm = document.getElementById("contactForm");

// Regex rules
const nameRegex = /^[A-Za-z\s]{2,30}$/;
const ageRegex = /^(?:1[01][0-9]|120|[1-9][0-9]?)$/;
const phoneRegex = /^[0-9]{10,}$/;

// Error messages
const errorMessages = {
  name: "Name must be letters only (2-30 characters)",
  age: "Age must be between 1 and 120",
  email: "Email must be valid",
  phone: "Phone must be at least 10 digits",
  password: "Password must be at least 6 characters",
  confirmPassword: "Passwords do not match",
};

// Validation function
function validateInput(input) {
  let valid = true;
  const value = input.value.trim();

  if (input.id === "name") valid = nameRegex.test(value);
  if (input.id === "age") valid = ageRegex.test(value);
  if (input.id === "email") valid = value.includes("@");
  if (input.id === "phone") valid = phoneRegex.test(value);
  if (input.id === "password") valid = value.length >= 6;
  if (input.id === "confirmPassword") {
    const password = document.getElementById("password").value.trim();
    valid = value === password && value.length >= 6;
  }

  // Remove old feedback
  let feedback = input.nextElementSibling;
  if (feedback && feedback.classList.contains("invalid-feedback"))
    feedback.remove();

  if (valid) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");

    const div = document.createElement("div");
    div.className = "invalid-feedback";
    div.textContent = errorMessages[input.id];
    input.parentNode.appendChild(div);
  }

  return valid;
}

// Validate on blur
contactForm.querySelectorAll("input").forEach((input) => {
  input.addEventListener("blur", () => validateInput(input));
});

// Validate on submit
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let allValid = true;
  contactForm.querySelectorAll("input").forEach((input) => {
    if (!validateInput(input)) allValid = false;
  });

  if (allValid) {
    alert("Form submitted successfully!");
    contactForm.reset();
    contactForm.querySelectorAll("input").forEach((input) => {
      input.classList.remove("is-valid");
    });
  }
});

// =====================
// INITIAL LOAD
// =====================
getMeals();

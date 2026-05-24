const appsGrid = document.getElementById("appsGrid");
const searchInput = document.getElementById("searchInput");
const filtersContainer = document.getElementById("filters");

let apps = [];
let currentCategory = "Все";

async function loadApps() {
  const response = await fetch("./data/apps.json");
  apps = await response.json();

  createFilters(apps);
  renderApps(apps);
}

function createFilters(apps) {
  const categories = ["Все", ...new Set(apps.map(app => app.category))];

  categories.forEach(category => {
    const button = document.createElement("button");

    button.className = "filter-btn";
    button.textContent = category;

    if (category === "Все") {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn")
        .forEach(btn => btn.classList.remove("active"));

      button.classList.add("active");

      currentCategory = category;
      filterApps();
    });

    filtersContainer.appendChild(button);
  });
}

function renderApps(appsToRender) {
  appsGrid.innerHTML = "";

  appsToRender.forEach(app => {
    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <img src="${app.image}" alt="${app.name}">
      <div class="card-content">
        <div class="card-category">${app.category}</div>

        <h2 class="card-title">${app.name}</h2>

        <p class="card-description">
          ${app.description}
        </p>

        <a class="card-link" href="./apps/${app.slug}.html">
          Подробнее
        </a>
      </div>
    `;

    appsGrid.appendChild(card);
  });
}

function filterApps() {
  const search = searchInput.value.toLowerCase();

  const filtered = apps.filter(app => {
    const matchesSearch =
      app.name.toLowerCase().includes(search) ||
      app.description.toLowerCase().includes(search);

    const matchesCategory =
      currentCategory === "Все" ||
      app.category === currentCategory;

    return matchesSearch && matchesCategory;
  });

  renderApps(filtered);
}

searchInput.addEventListener("input", filterApps);

loadApps();

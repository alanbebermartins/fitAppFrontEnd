const routes = {
  "/home": "/pages/dashboard.html",
  "/sobre": "/pages/sobre.html",
  "/servicos": "/pages/servicos.html",
  "/contato": "/pages/contato.html",
  "/login": "/pages/login.html",
};

async function loadPage(path) {
  const app = document.getElementById("app");

  const route = routes[path] || routes["/home"];

  const response = await fetch(route);

  if (!response.ok) {
    app.innerHTML = "<h1>Erro ao carregar página</h1>";
    return;
  }

  const html = await response.text();
  app.innerHTML = html;
}

function navigateTo(url) {
  history.pushState(null, null, url);
  loadPage(url);
}

document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-link]");
  if (!link) return;

  e.preventDefault();
  navigateTo(link.getAttribute("href"));
});

window.addEventListener("popstate", () => {
  loadPage(location.pathname);
});

// carrega a rota inicial ao abrir o site
loadPage(location.pathname);

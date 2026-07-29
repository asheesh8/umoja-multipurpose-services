const ROUTES = ["home", "services", "proof", "quote", "admin", "contact"];
const REQUEST_KEY = "umoja-service-requests";

const services = {
  residential: {
    number: "01",
    title: "Residential cleaning",
    copy: "Home resets, move-in or move-out cleaning, deep cleaning, and recurring care shaped around the rooms and surfaces that matter most.",
    scope: ["Kitchens, bathrooms, living areas, and bedrooms", "Move-related cleaning and one-time deep cleans", "Window, floor, and carpet add-ons"],
    image: "assets/listing-window-cleaning-enhanced.webp",
    caption: "Residential spaces ready for the next day."
  },
  commercial: {
    number: "02",
    title: "Office and commercial cleaning",
    copy: "Custom plans for offices, schools, retail, medical, hospitality, warehouse, nonprofit, mall, and shared commercial spaces.",
    scope: ["Nightly janitorial routines", "Lobbies, restrooms, common areas, and trash removal", "Hard-surface floors, carpets, upholstery, and green cleaning"],
    image: "assets/listing-team-member-enhanced.webp",
    caption: "A practical team for public-facing spaces."
  },
  events: {
    number: "03",
    title: "Event and venue cleaning",
    copy: "Support before, during, and after weddings, baby showers, concerts, indoor sports, arenas, and other gathering spaces.",
    scope: ["Day porter services and event staffing", "Post-event cleanup", "Indoor and outdoor venue cleaning"],
    image: "assets/listing-service-car-enhanced.webp",
    caption: "Ready for the next guest arrival."
  },
  construction: {
    number: "04",
    title: "Post-construction cleaning",
    copy: "Detailed cleaning after building or renovation work so a site can move from dusty project to usable space.",
    scope: ["Dust, dirt, scuff, sticker, and label removal", "Trim, baseboards, frames, jambs, fixtures, and appliances", "Rough clean, light clean, and final touch phases"],
    image: "assets/listing-stair-cleaning-enhanced.webp",
    caption: "Final details for new or renovated spaces."
  },
  surfaces: {
    number: "05",
    title: "Windows, floors, and carpets",
    copy: "Glass, tracks, frames, carpets, stairs, and hard-surface floors for homes, offices, commercial premises, and post-construction sites.",
    scope: ["Interior windows, screens, tracks, and frames", "Glass balconies, balustrades, and solariums", "Floor support and carpet deep cleaning"],
    image: "assets/owner-window-cleaning-enhanced.png",
    caption: "Glass and surfaces with a visible finish."
  },
  green: {
    number: "06",
    title: "Green cleaning",
    copy: "Environmentally responsible choices for teams that want cleaner spaces with a lighter pollutant load.",
    scope: ["Eco-minded product choices", "Safer routines for homes and workplaces", "Useful for recurring maintenance plans"],
    image: "assets/listing-window-cleaning-enhanced.webp",
    caption: "Cleaner routines for everyday spaces."
  }
};

const routeLinks = document.querySelectorAll("[data-route]");
const scenes = document.querySelectorAll("[data-scene]");
const main = document.querySelector("#main");
let activeRoute = "";
let selectedRequestId = null;
let requests = [];

const byId = (id) => document.getElementById(id);
const formatDate = (value) => {
  if (!value) return "No date";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
};

const clean = (value) => String(value || "").trim();

function setRoute(route, options = {}) {
  const nextRoute = ROUTES.includes(route) ? route : "home";
  if (activeRoute === nextRoute && !options.force) return;

  const previousScene = document.querySelector(".scene.is-active");
  const nextScene = byId(nextRoute);
  activeRoute = nextRoute;

  scenes.forEach((scene) => {
    const isActive = scene.dataset.scene === nextRoute;
    scene.classList.toggle("is-active", isActive);
    scene.setAttribute("aria-hidden", String(!isActive));
    scene.toggleAttribute("inert", !isActive);
    if (isActive) {
      scene.classList.remove("is-wiping");
      window.requestAnimationFrame(() => scene.classList.add("is-wiping"));
    } else {
      scene.classList.remove("is-wiping");
    }
  });

  routeLinks.forEach((link) => {
    const isActive = link.dataset.route === nextRoute;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (location.hash !== `#${nextRoute}`) {
    history.pushState(null, "", `#${nextRoute}`);
  }

  if (options.focus && nextScene) {
    main?.focus({ preventScroll: true });
  }

  previousScene?.classList.remove("is-wiping");
}

routeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const route = link.dataset.route;
    if (!route) return;
    event.preventDefault();
    setRoute(route, { focus: true });
  });
});

window.addEventListener("popstate", () => setRoute(location.hash.slice(1), { force: true }));
window.addEventListener("hashchange", () => setRoute(location.hash.slice(1), { force: true }));

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
  if (isTyping) return;
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  const index = ROUTES.indexOf(activeRoute);
  const offset = event.key === "ArrowRight" ? 1 : -1;
  setRoute(ROUTES[(index + offset + ROUTES.length) % ROUTES.length], { focus: true });
});

function renderService(key) {
  const service = services[key] || services.residential;
  document.querySelector("[data-service-number]").textContent = service.number;
  document.querySelector("[data-service-title]").textContent = service.title;
  document.querySelector("[data-service-copy]").textContent = service.copy;
  document.querySelector("[data-service-caption]").textContent = service.caption;

  const image = document.querySelector("[data-service-image]");
  image.src = service.image;
  image.alt = service.caption;

  const scope = document.querySelector("[data-service-scope]");
  scope.replaceChildren(
    ...service.scope.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    })
  );

  document.querySelectorAll("[data-service-tab]").forEach((button) => {
    const isActive = button.dataset.serviceTab === key;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

document.querySelectorAll("[data-service-tab]").forEach((button) => {
  button.addEventListener("click", () => renderService(button.dataset.serviceTab));
});

function getLocalRequests() {
  try {
    const parsed = JSON.parse(localStorage.getItem(REQUEST_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setLocalRequests(items) {
  localStorage.setItem(REQUEST_KEY, JSON.stringify(items));
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with ${response.status}`);
  }
  return response.json();
}

async function loadRequests() {
  try {
    const data = await apiRequest("/api/requests");
    requests = Array.isArray(data.requests) ? data.requests : [];
  } catch {
    requests = getLocalRequests();
  }
  selectedRequestId = selectedRequestId || requests[0]?.id || null;
  renderAdmin();
}

async function createRequest(payload) {
  try {
    const data = await apiRequest("/api/requests", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    requests = [data.request, ...requests.filter((item) => item.id !== data.request.id)];
    setLocalRequests(requests);
    return data.request;
  } catch {
    const request = {
      id: `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "new",
      source: "browser",
      ...payload
    };
    requests = [request, ...getLocalRequests()];
    setLocalRequests(requests);
    return request;
  }
}

async function updateRequestStatus(id, status) {
  const existing = requests.find((item) => item.id === id);
  if (!existing) return;
  try {
    const data = await apiRequest(`/api/requests/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    requests = requests.map((item) => (item.id === id ? data.request : item));
    setLocalRequests(requests);
  } catch {
    requests = requests.map((item) =>
      item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
    );
    setLocalRequests(requests);
  }
  renderAdmin();
}

function requestSummary(item) {
  const contact = item.phone || item.email || "No contact";
  return `${item.service || "Cleaning request"} - ${contact}`;
}

function renderAdmin() {
  const total = requests.length;
  const counts = requests.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    { new: 0, scheduled: 0, completed: 0, archived: 0 }
  );

  document.querySelector("[data-metric-total]").textContent = total;
  document.querySelector("[data-metric-new]").textContent = counts.new || 0;
  document.querySelector("[data-metric-scheduled]").textContent = counts.scheduled || 0;
  document.querySelector("[data-metric-completed]").textContent = counts.completed || 0;

  const list = document.querySelector("[data-request-list]");
  const detail = document.querySelector("[data-request-detail]");

  if (!requests.length) {
    list.innerHTML = '<p class="empty-state">No requests yet.</p>';
    detail.innerHTML = '<p class="empty-state">Requests submitted through the form will show up here.</p>';
    return;
  }

  if (!requests.some((item) => item.id === selectedRequestId)) {
    selectedRequestId = requests[0].id;
  }

  list.replaceChildren(
    ...requests.map((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `request-card${item.id === selectedRequestId ? " is-active" : ""}`;
      button.innerHTML = `
        <span class="status-chip" data-status="${item.status || "new"}">${item.status || "new"}</span>
        <strong>${escapeHtml(item.name || "Unnamed request")}</strong>
        <small>${escapeHtml(requestSummary(item))}</small>
        <small>${formatDate(item.createdAt)}</small>
      `;
      button.addEventListener("click", () => {
        selectedRequestId = item.id;
        renderAdmin();
      });
      return button;
    })
  );

  const selected = requests.find((item) => item.id === selectedRequestId);
  detail.innerHTML = `
    <span class="status-chip" data-status="${selected.status || "new"}">${selected.status || "new"}</span>
    <h3>${escapeHtml(selected.name || "Unnamed request")}</h3>
    <p>${escapeHtml(selected.notes || "No notes added yet.")}</p>
    <div class="detail-grid">
      ${detailItem("Service", selected.service)}
      ${detailItem("Property", selected.property)}
      ${detailItem("Timing", selected.timing)}
      ${detailItem("Location", selected.location)}
      ${detailItem("Phone", selected.phone)}
      ${detailItem("Email", selected.email)}
      ${detailItem("Created", formatDate(selected.createdAt))}
      ${detailItem("Source", selected.source || "api")}
    </div>
    <div class="status-actions" aria-label="Update request status">
      <button type="button" data-status-button="new">Mark new</button>
      <button type="button" data-status-button="scheduled">Schedule</button>
      <button type="button" data-status-button="completed">Complete</button>
      <button type="button" data-status-button="archived">Archive</button>
    </div>
  `;

  detail.querySelectorAll("[data-status-button]").forEach((button) => {
    button.addEventListener("click", () => updateRequestStatus(selected.id, button.dataset.statusButton));
  });
}

function detailItem(label, value) {
  return `<div class="detail-item"><span>${label}</span><strong>${escapeHtml(value || "Not provided")}</strong></div>`;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

document.querySelector("[data-export-json]")?.addEventListener("click", () => {
  download("umoja-requests.json", JSON.stringify(requests, null, 2), "application/json");
});

document.querySelector("[data-export-csv]")?.addEventListener("click", () => {
  const headers = ["createdAt", "status", "name", "phone", "email", "service", "property", "timing", "location", "notes"];
  const rows = requests.map((item) => headers.map((key) => csvCell(item[key])).join(","));
  download("umoja-requests.csv", [headers.join(","), ...rows].join("\n"), "text/csv");
});

function csvCell(value) {
  return `"${String(value || "").replaceAll('"', '""')}"`;
}

document.querySelector("[data-quote-form]")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  Object.keys(payload).forEach((key) => {
    payload[key] = clean(payload[key]);
  });

  const status = document.querySelector("[data-form-status]");
  const hasContact = payload.phone || payload.email;
  if (!hasContact) {
    status.classList.add("is-error");
    status.innerHTML = "<strong>Contact needed</strong><span>Add a phone number or email before saving.</span>";
    return;
  }

  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  status.classList.remove("is-error");
  status.innerHTML = "<strong>Saving</strong><span>Adding this request to the desk.</span>";

  try {
    const request = await createRequest(payload);
    selectedRequestId = request.id;
    renderAdmin();
    form.reset();
    status.innerHTML = "<strong>Saved</strong><span>The request is now visible in the admin desk.</span>";
    setRoute("admin", { focus: true });
  } catch (error) {
    status.classList.add("is-error");
    status.innerHTML = `<strong>Could not save</strong><span>${escapeHtml(error.message)}</span>`;
  } finally {
    submit.disabled = false;
  }
});

setRoute(location.hash.slice(1) || "home", { force: true });
renderService("residential");
loadRequests();

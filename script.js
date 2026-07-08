const alerts = [
  {
    id: 1,
    fields: [
      ["Vehicle", "R4F00099"],
      ["Fault Code", "GZ010203"],
      ["Fault Type", "Autopilot Malfunction"],
      ["Device Location", "Left Blind Spot Lidar"],
      ["Safety Mechanism", "COMFORTABLE PULL OVER"],
      ["Failure Time", "2026-06-01 11:01:02"]
    ],
    status: "waiting process"
  },
  {
    id: 2,
    fields: [
      ["Vehicle", "R4F00099"],
      ["Event Type", "Brake pedal takeover"],
      ["Event Time", "2026-06-01 09:05:10"]
    ],
    status: "waiting process"
  },
  {
    id: 3,
    fields: [
      ["Vehicle", "R4F00099"],
      ["Event Type", "Lost luggage"],
      ["Event picture", "View", "view"],
      ["Event Time", "2026-06-01 08:10:09"]
    ],
    status: "waiting process"
  }
];

const alertsList = document.getElementById("alertsList");
const modal = document.getElementById("imageModal");
const closeModal = document.getElementById("closeModal");

function getStatusClass(status) {
  if (status === "Processing") return "status-processing";
  if (status === "Figure Out") return "status-figure";
  return "status-waiting";
}

function renderAlerts() {
  alertsList.innerHTML = alerts.map((alert) => {
    const fieldHtml = alert.fields.map(([key, value, type]) => {
      const valueHtml = type === "view"
        ? `<button class="view-link" data-action="view">${value}</button>`
        : value;

      return `
        <div class="alert-line">
          <span class="alert-key">${key}:</span>
          <span class="alert-value">${valueHtml}</span>
        </div>
      `;
    }).join("");

    const actionButtons = alert.status === "waiting process"
      ? `
        <div class="alert-actions">
          <button data-action="processing">Processing</button>
          <button data-action="figure">Figure Out</button>
        </div>
      `
      : alert.status === "Processing"
        ? `
          <div class="alert-actions single-action">
            <button data-action="figure">Figure Out</button>
          </div>
        `
        : "";

    return `
      <article class="alert-item" data-id="${alert.id}">
        ${fieldHtml}
        <div class="alert-line">
          <span class="alert-key">Status:</span>
          <span class="alert-value ${getStatusClass(alert.status)}">${alert.status}</span>
        </div>
        ${actionButtons}
      </article>
    `;
  }).join("");
}

function updateStatus(alertId, status) {
  const alert = alerts.find((item) => item.id === alertId);
  if (!alert) return;
  alert.status = status;
  renderAlerts();
}

function openModal() {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function hideModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

alertsList.addEventListener("click", (event) => {
  const target = event.target;
  const action = target.dataset.action;
  if (!action) return;

  if (action === "view") {
    openModal();
    return;
  }

  const card = target.closest(".alert-item");
  const alertId = Number(card.dataset.id);

  if (action === "processing") {
    updateStatus(alertId, "Processing");
  }

  if (action === "figure") {
    updateStatus(alertId, "Figure Out");
  }
});

closeModal.addEventListener("click", hideModal);
modal.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal-backdrop")) {
    hideModal();
  }
});

renderAlerts();

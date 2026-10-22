const HANDLER_NAME = "chenwei1_sgp";
const PROCESS_START_TIME = "2026-10-22 12:00:01";
const PROCESS_FINISH_TIME = "2026-10-22 12:30:20";

const alerts = [
  {
    id: 1,
    priority: "high",
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
    priority: "medium",
    fields: [
      ["Vehicle", "R4F00099"],
      ["Event Type", "Brake pedal takeover"],
      ["Event Time", "2026-06-01 09:05:10"]
    ],
    status: "waiting process"
  },
  {
    id: 3,
    priority: "low",
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
const alertTabs = document.querySelector(".alert-tabs");
const modal = document.getElementById("imageModal");
const closeModal = document.getElementById("closeModal");

let activeAlertStatus = "waiting process";

function getStatusClass(status) {
  if (status === "Processing") return "status-processing";
  if (status === "Figure Out") return "status-figure";
  return "status-waiting";
}

function getPriorityText(priority) {
  if (priority === "high") return "High";
  if (priority === "medium") return "Medium";
  return "Low";
}

function getWorkflowFields(status) {
  if (status === "Processing") {
    return [
      ["Handler", HANDLER_NAME],
      ["Start Time", PROCESS_START_TIME]
    ];
  }

  if (status === "Figure Out") {
    return [
      ["Handler", HANDLER_NAME],
      ["Start Time", PROCESS_START_TIME],
      ["Finish Time", PROCESS_FINISH_TIME]
    ];
  }

  return [];
}

function updateTabCounts() {
  alertTabs.querySelectorAll(".alert-tab").forEach((tab) => {
    const count = alerts.filter((alert) => alert.status === tab.dataset.status).length;
    tab.querySelector(".alert-tab-count").textContent = count;
  });
}

function renderAlerts() {
  updateTabCounts();
  const visibleAlerts = alerts.filter((alert) => alert.status === activeAlertStatus);

  if (visibleAlerts.length === 0) {
    alertsList.innerHTML = `<div class="alerts-empty">No data</div>`;
    return;
  }

  alertsList.innerHTML = visibleAlerts.map((alert) => {
    const fieldHtml = alert.fields
      .concat(getWorkflowFields(alert.status))
      .concat([["Priority", getPriorityText(alert.priority)]])
      .map(([key, value, type]) => {
      const valueHtml = type === "view"
        ? `<button class="view-link" data-action="view">${value}</button>`
        : value;
      const valueClass = key === "Priority" ? " priority-value" : "";

      return `
        <div class="alert-line">
          <span class="alert-key">${key}:</span>
          <span class="alert-value${valueClass}">${valueHtml}</span>
        </div>
      `;
    }).join("");

    const priorityClass = ` priority-${alert.priority}`;

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
      <article class="alert-item${priorityClass}" data-id="${alert.id}">
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

function setActiveAlertTab(status) {
  activeAlertStatus = status;
  alertTabs.querySelectorAll(".alert-tab").forEach((tab) => {
    const selected = tab.dataset.status === status;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", selected ? "true" : "false");
  });
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

alertTabs.addEventListener("click", (event) => {
  const tab = event.target.closest(".alert-tab");
  if (!tab) return;
  setActiveAlertTab(tab.dataset.status);
});

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

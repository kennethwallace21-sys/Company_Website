(function () {
  const STYLE_ID = "catalyst-contact-form-style";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .catalyst-contact-overlay {
        position: fixed;
        inset: 0;
        z-index: 300;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background: rgba(7, 11, 18, 0.74);
        backdrop-filter: blur(14px);
      }
      .catalyst-contact-overlay.open { display: flex; }
      .catalyst-contact-panel {
        width: min(100%, 680px);
        max-height: calc(100vh - 48px);
        overflow: auto;
        border-radius: 24px;
        border: 1px solid rgba(99, 232, 255, 0.16);
        background: linear-gradient(180deg, rgba(14, 30, 48, 0.96), rgba(7, 17, 28, 0.98));
        box-shadow: 0 28px 80px rgba(0, 0, 0, 0.34);
        color: #eaf8ff;
        padding: 24px;
      }
      .catalyst-contact-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
      }
      .catalyst-contact-kicker {
        font: 11px "IBM Plex Mono", monospace;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #63e8ff;
      }
      .catalyst-contact-title {
        margin: 10px 0 0;
        font: 700 30px "Sora", sans-serif;
        line-height: 1.05;
      }
      .catalyst-contact-copy {
        margin: 12px 0 0;
        font: 400 14px/1.7 "IBM Plex Sans", sans-serif;
        color: #8ea6bc;
      }
      .catalyst-contact-close,
      .catalyst-contact-cancel,
      .catalyst-contact-submit {
        cursor: pointer;
        border: 1px solid transparent;
      }
      .catalyst-contact-close {
        width: 42px;
        height: 42px;
        border-radius: 999px;
        background: rgba(7, 17, 28, 0.75);
        color: #eaf8ff;
        border-color: rgba(99, 232, 255, 0.16);
      }
      .catalyst-contact-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
        margin-top: 18px;
      }
      .catalyst-contact-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .catalyst-contact-field.full {
        grid-column: 1 / -1;
      }
      .catalyst-contact-field label {
        font: 11px "IBM Plex Mono", monospace;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #8ea6bc;
      }
      .catalyst-contact-field input,
      .catalyst-contact-field textarea {
        width: 100%;
        border-radius: 16px;
        border: 1px solid rgba(99, 232, 255, 0.16);
        background: rgba(7, 17, 28, 0.86);
        color: #eaf8ff;
        padding: 14px 16px;
        font: 400 14px/1.6 "IBM Plex Sans", sans-serif;
        outline: none;
      }
      .catalyst-contact-field textarea {
        min-height: 140px;
        resize: vertical;
      }
      .catalyst-contact-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 18px;
      }
      .catalyst-contact-actions-right {
        display: flex;
        gap: 12px;
      }
      .catalyst-contact-cancel {
        border-radius: 999px;
        border-color: rgba(99, 232, 255, 0.2);
        background: rgba(10, 22, 37, 0.65);
        color: #eaf8ff;
        padding: 12px 18px;
      }
      .catalyst-contact-submit {
        border-radius: 999px;
        background: linear-gradient(135deg, #63e8ff, #225cff);
        color: #061019;
        padding: 12px 18px;
        font-weight: 700;
      }
      .catalyst-contact-status {
        font: 400 13px/1.6 "IBM Plex Sans", sans-serif;
        color: #8ea6bc;
      }
      @media (max-width: 720px) {
        .catalyst-contact-grid { grid-template-columns: 1fr; }
        .catalyst-contact-actions {
          flex-direction: column;
          align-items: stretch;
        }
        .catalyst-contact-actions-right {
          width: 100%;
          flex-direction: column;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function buildOverlay(config) {
    const productLabel = config.product || "Catalyst";
    const overlay = document.createElement("div");
    overlay.className = "catalyst-contact-overlay";
    overlay.innerHTML = `
      <div class="catalyst-contact-panel" role="dialog" aria-modal="true" aria-label="Contact Catalyst sales">
        <div class="catalyst-contact-top">
          <div>
            <div class="catalyst-contact-kicker">Sales Contact</div>
            <h3 class="catalyst-contact-title">Talk to ${productLabel} sales.</h3>
            <p class="catalyst-contact-copy">
              Submit your request here instead of opening an email client.
              Your note will be routed to ${config.salesEmail}.
            </p>
          </div>
          <button type="button" class="catalyst-contact-close" aria-label="Close contact form">✕</button>
        </div>
        <form class="catalyst-contact-form">
          <div class="catalyst-contact-grid">
            <div class="catalyst-contact-field">
              <label for="catalyst-contact-name">Name</label>
              <input id="catalyst-contact-name" name="name" autocomplete="name" required>
            </div>
            <div class="catalyst-contact-field">
              <label for="catalyst-contact-email">Work Email</label>
              <input id="catalyst-contact-email" type="email" name="email" autocomplete="email" required>
            </div>
            <div class="catalyst-contact-field">
              <label for="catalyst-contact-company">Company</label>
              <input id="catalyst-contact-company" name="company" autocomplete="organization">
            </div>
            <div class="catalyst-contact-field">
              <label for="catalyst-contact-intent">Request</label>
              <input id="catalyst-contact-intent" name="intent" readonly>
            </div>
            <div class="catalyst-contact-field full">
              <label for="catalyst-contact-message">Message</label>
              <textarea id="catalyst-contact-message" name="message" required></textarea>
            </div>
          </div>
          <div class="catalyst-contact-actions">
            <div class="catalyst-contact-status" aria-live="polite"></div>
            <div class="catalyst-contact-actions-right">
              <button type="button" class="catalyst-contact-cancel">Cancel</button>
              <button type="submit" class="catalyst-contact-submit">Submit Request</button>
            </div>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  window.initCatalystContactForm = function initCatalystContactForm(config) {
    injectStyles();
    const settings = Object.assign(
      {
        endpoint: "/api/contact",
        triggerSelector: 'a[href^="mailto:"]',
        salesEmail: "sales@catalystappliedai.com",
        product: "Catalyst",
        defaultIntent: "General inquiry",
        defaultMessage: "Tell us what you want to see, deploy, or evaluate.",
      },
      config || {},
    );

    const overlay = buildOverlay(settings);
    const form = overlay.querySelector(".catalyst-contact-form");
    const closeButton = overlay.querySelector(".catalyst-contact-close");
    const cancelButton = overlay.querySelector(".catalyst-contact-cancel");
    const statusNode = overlay.querySelector(".catalyst-contact-status");
    const intentInput = overlay.querySelector('[name="intent"]');
    const messageInput = overlay.querySelector('[name="message"]');

    function open(intentText) {
      intentInput.value = intentText || settings.defaultIntent;
      if (!messageInput.value) messageInput.value = settings.defaultMessage;
      overlay.classList.add("open");
      overlay.querySelector('[name="name"]').focus();
    }

    function close() {
      overlay.classList.remove("open");
      statusNode.textContent = "";
    }

    closeButton.addEventListener("click", close);
    cancelButton.addEventListener("click", close);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });

    document.querySelectorAll(settings.triggerSelector).forEach((link) => {
      link.setAttribute("href", "#contact");
      link.addEventListener("click", (event) => {
        event.preventDefault();
        open(link.getAttribute("data-contact-intent") || link.textContent.trim() || settings.defaultIntent);
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      statusNode.textContent = "Submitting your request...";
      const payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        company: form.company.value.trim(),
        intent: form.intent.value.trim(),
        message: form.message.value.trim(),
        page_url: window.location.href,
      };

      try {
        const response = await fetch(settings.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Unable to submit request.");
        statusNode.textContent = data.message || "Request submitted.";
        form.reset();
        setTimeout(close, 1200);
      } catch (error) {
        statusNode.textContent = error.message || "Unable to submit request.";
      }
    });
  };
})();

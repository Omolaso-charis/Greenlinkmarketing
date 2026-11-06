// Campaign page behaviour: WhatsApp links, campaign tracking, event preselection and quote submission.

const CAMPAIGN_WHATSAPP_NUMBER = '234XXXXXXXXXX';
const CAMPAIGN_WHATSAPP_TEXT = "Hello Green Link, I'd like to know more about sourcing shoes or bags.";
const REFERENCE_PREFIX = 'CG-';

function whatsappLink(text) {
  return `https://wa.me/${CAMPAIGN_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function sourceFromVisit() {
  const params = new URLSearchParams(window.location.search);
  let referrerHost = '';
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname : '';
  } catch {
    referrerHost = '';
  }
  return {
    source: params.get('utm_source') || referrerHost || 'direct',
    medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || ''
  };
}

document.addEventListener('DOMContentLoaded', () => {
  // Pre-filled WhatsApp messages
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
    link.setAttribute('href', whatsappLink(CAMPAIGN_WHATSAPP_TEXT));
  });

  const form = document.getElementById('campaign-form');
  if (!form) return;

  // Record where the visitor came from, so you can see which post brought each lead
  const visit = sourceFromVisit();
  ['source', 'medium', 'campaign'].forEach(name => {
    const field = form.elements.namedItem(name);
    if (field) field.value = visit[name];
  });

  // "Request this option" and "Register interest" buttons preselect the matching choice
  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      form.elements.namedItem('service').value = link.dataset.service;
    });
  });
  document.querySelectorAll('[data-event]').forEach(link => {
    link.addEventListener('click', () => {
      form.elements.namedItem('event').value = link.dataset.event;
    });
  });

  // Submit to Netlify Forms in the background and show a reference number
  const status = form.querySelector('.form-status');
  const confirmation = document.getElementById('campaign-confirmation');
  const referenceEl = document.getElementById('campaign-reference');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';
    status.classList.remove('error');

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const reference = REFERENCE_PREFIX + Date.now().toString(36).toUpperCase();
    const data = new FormData(form);
    data.set('reference', reference);

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    status.textContent = 'Sending...';

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      });
      if (!response.ok) throw new Error('Submission failed');

      form.hidden = true;
      referenceEl.textContent = reference;
      confirmation.hidden = false;
      confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
      status.textContent = '';
    } catch (err) {
      status.textContent = 'Sorry, we could not send your request. Please try again or message us on WhatsApp.';
      status.classList.add('error');
      submitBtn.disabled = false;
    }
  });
});

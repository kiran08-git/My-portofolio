/* ================================================================
   SECTION A: FOOTER YEAR
   Fills in the current year automatically so it never needs to
   be updated by hand.
================================================================ */
document.getElementById('year').textContent = new Date().getFullYear();


/* ================================================================
   SECTION B: TERMINAL TYPING EFFECT
   Types the text in `fullText` character-by-character into the
   #typeTarget span in the hero, next to the blinking cursor.
   If the visitor's OS has "reduce motion" turned on, we skip the
   animation and just show the full text immediately.
================================================================ */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const typeTarget = document.getElementById('typeTarget');
const fullText = 'open-to-opportunities --focus="web dev, ui/ux, data analysis"';

if (reduceMotion) {
  typeTarget.textContent = fullText;
} else {
  let charIndex = 0;
  function typeNextChar(){
    if (charIndex <= fullText.length){
      typeTarget.textContent = fullText.slice(0, charIndex);
      charIndex++;
      setTimeout(typeNextChar, 35); // typing speed in ms per character
    }
  }
  typeNextChar();
}


/* ================================================================
   SECTION C: EXPAND / COLLAPSE PROJECTS & CERTIFICATES
   Both sections start hidden (see .reveal-section in style.css).
   Clicking a toggle button adds/removes the "open" class on its
   matching section, which is what actually reveals it. This is
   the mechanism that keeps projects/certificates off the page
   until the visitor chooses to see them.
================================================================ */
function openRevealSection(sectionId, buttonId){
  const section = document.getElementById(sectionId);
  if (!section) return false;

  section.classList.add('open');

  const button = buttonId ? document.getElementById(buttonId) : null;
  if (button) {
    button.setAttribute('aria-expanded', 'true');
  }

  setTimeout(() => {
    section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, 60);

  return true;
}

function wireToggle(buttonId, sectionId){
  const button = document.getElementById(buttonId);
  const section = document.getElementById(sectionId);

  button.addEventListener('click', () => {
    const isNowOpen = section.classList.toggle('open');

    // Keep the button's accessibility state in sync (screen readers rely on this)
    button.setAttribute('aria-expanded', String(isNowOpen));

    // If we just opened it, scroll it into view once the expand animation starts
    if (isNowOpen){
      setTimeout(() => {
        section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }, 60);
    }
  });
}

wireToggle('projectsToggle', 'projects');
wireToggle('certsToggle', 'certificates');

document.querySelectorAll('.navlinks a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href')?.slice(1);
    const targetSection = targetId ? document.getElementById(targetId) : null;

    if (!targetSection || !targetSection.classList.contains('reveal-section')) {
      return;
    }

    event.preventDefault();

    const buttonId = targetId === 'projects'
      ? 'projectsToggle'
      : targetId === 'certificates'
        ? 'certsToggle'
        : null;

    openRevealSection(targetId, buttonId);
    history.replaceState(null, '', `#${targetId}`);
  });
});


/* ================================================================
   SECTION D: CONTACT FORM -> SENDS VIA MAILJS
   Replace the placeholder MailJS values below with your own
   service ID, template ID, and public key from MailJS.
================================================================ */
const MAILJS_SERVICE_ID = 'service_i9czqb2';
const MAILJS_TEMPLATE_ID = 'template_o9q60xq';
const MAILJS_PUBLIC_KEY = '2SOHpL2oYkuNhekqn';

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
  emailjs.init(MAILJS_PUBLIC_KEY);

  contactForm.addEventListener('submit', function(event){
    event.preventDefault();

    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton ? submitButton.textContent : 'send-email';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'sending...';
    }

    formStatus.textContent = 'Sending your message...';
    formStatus.style.color = '#8bd3ff';

    emailjs.sendForm(MAILJS_SERVICE_ID, MAILJS_TEMPLATE_ID, this)
      .then(() => {
        formStatus.textContent = 'Message sent successfully!';
        formStatus.style.color = '#7ee787';
        this.reset();
      })
      .catch((error) => {
        console.error('MailJS error:', error);
        formStatus.textContent = 'Unable to send right now. Please try again later.';
        formStatus.style.color = '#ff7b72';
      })
      .finally(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      });
  });
}

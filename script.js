const mouse = document.querySelector('.mainLanding')
const front = document.querySelector('.bubble1')
const back = document.querySelector('.bubble2')


const sensFront = 1000;
const sensBack = 1000;

function initSlideInSequence(selector = '.slide', options = {}) {
  const elements = Array.from(document.querySelectorAll(selector));

  const {
    threshold = 0.2,
    rootMargin = "0px",
    delay = 150,
    once = true
  } = options;

  let visibleQueue = [];
  let isRunning = false;

  const runQueue = () => {
    if (isRunning || visibleQueue.length === 0) return;

    isRunning = true;

    const el = visibleQueue.shift();
    el.classList.add('show');

    setTimeout(() => {
      isRunning = false;
      runQueue(); // trigger next
    }, delay);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        visibleQueue.push(entry.target);

        if (once) {
          obs.unobserve(entry.target);
        }
      }
    });

    runQueue();
  }, { threshold, rootMargin });

  elements.forEach(el => observer.observe(el));
}

const mediaQuery = window.matchMedia("(min-width: 768px)");

if (mediaQuery.matches) {
    mouse.addEventListener('mousemove', e => {
        const x = e.clientX;
        const y = e.clientY;

        front.style.transform = `
    translate(
        ${-x/sensFront}%,
         ${-y/sensFront}%
    )`;
        back.style.transform = `
    translate(
        ${
           x/sensBack
        }%, ${y/sensBack
}% ) `;
    })
}


let lastKnownScrollPosition = 0;
let ticking = false;


function changeTheme(scrollPos) {
    const cards = document.querySelectorAll(".card"); // get all cards
    const projectCard = document.querySelectorAll(".projectCard");
    if (scrollPos > 500 && scrollPos <= 2500) {
        document.body.style.backgroundImage = "url('images/programmador.jpg')";
        cards.forEach(card => {
            card.style.backgroundColor = "rgba(61, 61, 61, 0.75)";
            card.style.borderColor = ""; // white border
            card.style.color = "";
        });

        projectCard.forEach(pc => {
            pc.style.backgroundColor = "";
            pc.style.borderColor = "#ffffff";
            pc.style.color = "#000000ff";
        });
    } else if (scrollPos > 2500 && scrollPos <= 3000) {
        document.body.style.backgroundImage = "url('images/droneBackground.jpg')";
        cards.forEach(card => {
            card.style.backgroundColor = "rgba(61, 61, 61, 0.75)";
            card.style.borderColor = ""; // white border
            card.style.color = "";
        });

        projectCard.forEach(pc => {
            pc.style.backgroundColor = "";
            pc.style.borderColor = "#ffffff";
            pc.style.color = "#000000ff";
        });
    } else if (scrollPos > 3000) {
        document.body.style.backgroundImage = "url('images/sponsorbanner.png')";
        cards.forEach(card => {
            card.style.backgroundColor = "rgba(61, 61, 61, 0.75)";
            card.style.borderColor = ""; // white border
            card.style.color = "";
        });

        projectCard.forEach(pc => {
            pc.style.backgroundColor = "";
            pc.style.borderColor = "#ffffff";
            pc.style.color = "#000000ff";
        });
    } else {
        document.body.style.backgroundImage = ""; // reset to default
        cards.forEach(card => {
            card.style.backgroundColor = "rgba(224, 224, 224,0.9)";
            card.style.borderColor = "#ffffff"; // white border
            card.style.color = "#000000ff";
        });

        projectCard.forEach(pc => {
            pc.style.backgroundColor = "#ffffff";
            pc.style.borderColor = "#000000";
            pc.style.color = "#000000";
        });
    }
}

document.addEventListener("scroll", () => {
    lastKnownScrollPosition = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            changeTheme(lastKnownScrollPosition);
            ticking = false;
        });

        ticking = true;
    }
});

initSlideInSequence('.slide', {
  delay: 200
});
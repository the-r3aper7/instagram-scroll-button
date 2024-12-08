const reelsMap = new Map()
const feedContainerClass = ".xilefcg"
const reelClass = ".x1winvzj"
let currentlyViewing = 0

const intersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !(entry.target.getAttribute("data-buttons-added") === "true")) {
      addButtons(entry.target)
    }
    if (entry.isIntersecting) {
      currentlyViewing = Array.from(reelsMap.entries())
        .find(([_, node]) => node === entry.target)?.[0] ?? 0;
    }
  });
}, {
  root: null,
  rootMargin: '0px',
  threshold: 0.5
});

function startMonitor() {
  updateReelsArray()
  const reelsContainer = document.querySelector(feedContainerClass)
  const observer = new MutationObserver(() => {
    updateReelsArray()
  });

  observer.observe(reelsContainer, {
    childList: true,
  })
}

/**
 * @param {HTMLButtonElement} upButton
 * @param {HTMLButtonElement} downButton 
*/
function updateButtonStates(upButton, downButton) {
  upButton.disabled = currentlyViewing === 0;
  downButton.disabled = currentlyViewing === reelsMap.size - 1;
}

/**
 * @param {Element} targetElement
 */
function addButtons(targetElement) {
  const target = targetElement.querySelector(`div[id^="clipsoverlay"][class*="x1i10hfl"] > div:nth-child(3)`)
  
  const buttonStyle = `
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: currentColor;
    opacity: 0.8;
    transition: opacity 0.2s;
    margin-bottom: 12.5px
  `
  
  const upButton = document.createElement("button") 
  upButton.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M18 11l-6 -6" /><path d="M6 11l6 -6" /></svg>`
  upButton.style.cssText = buttonStyle
  upButton.addEventListener('mouseover', () => upButton.style.opacity = '1')
  upButton.addEventListener('mouseout', () => upButton.style.opacity = '0.8')

  const downButton = document.createElement("button")
  downButton.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-down"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M18 13l-6 6" /><path d="M6 13l6 6" /></svg>` 
 
  downButton.style.cssText = buttonStyle
  downButton.addEventListener('mouseover', () => downButton.style.opacity = '1')
  downButton.addEventListener('mouseout', () => downButton.style.opacity = '0.8')

  updateButtonStates(upButton, downButton)

  upButton.onclick = () => {
    currentlyViewing -= 1
    updateButtonStates(upButton, downButton)
    const prevReel = reelsMap.get(currentlyViewing)
    if (prevReel) prevReel.scrollIntoView({ behavior: 'smooth' })
  }

  downButton.onclick = () => {
    currentlyViewing += 1 
    updateButtonStates(upButton, downButton)
    const nextReel = reelsMap.get(currentlyViewing)
    if (nextReel) nextReel.scrollIntoView({ behavior: 'smooth' })
  }

  target.insertBefore(downButton, target.children[0])
  target.insertBefore(upButton, downButton)
  targetElement.setAttribute("data-buttons-added", true)
}

function updateReelsArray() {
  const feedContainerReels = document.querySelectorAll(reelClass);
  
  reelsMap.clear()

  for (let i = 0; i < feedContainerReels.length; i++) {
    const reelNode = feedContainerReels[i]
    reelsMap.set(i, reelNode)
    intersectionObserver.observe(reelNode)
  }
  updateAllButtonStates();
}

function updateAllButtonStates() {
  document.querySelectorAll(reelClass).forEach(reel => {
    if (reel.getAttribute("data-buttons-added") === "true") {
      const target = reel.querySelector(`div[id^="clipsoverlay"][class*="x1i10hfl"] > div:nth-child(3)`);
      const upButton = target.children[1];
      const downButton = target.children[0];
      updateButtonStates(upButton, downButton);
    }
  });
}

// Starting Code
const checkForContainer = setInterval(() => {
  const feedContainer = document.querySelector(feedContainerClass);
  if (feedContainer) {
    clearInterval(checkForContainer);
    startMonitor()
  }
}, 1000);
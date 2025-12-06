// POC: Media content in work items (voor tablet en kleiner)
// Op desktop blijft media een eigen kolom

const workItems = document.querySelectorAll('.work-item');
const mediaSection = document.querySelector('.media');

// Check of we op tablet/mobile zijn
function isTabletOrMobile() {
  return window.matchMedia('(max-width: 1199px)').matches;
}

// Update media content op basis van viewport
function updateActiveWorkItem() {
  const activeItem = document.querySelector('.work-item.is-active');
  
  if (isTabletOrMobile()) {
    // Op tablet/mobiel: kopieer media content naar actief work item
    if (activeItem && mediaSection) {
      const mediaContainer = activeItem.querySelector('.work-item__media');
      if (mediaContainer) {
        mediaContainer.innerHTML = mediaSection.innerHTML;
      }
    }
  } else {
    // Op desktop: verwijder media content uit alle work items
    workItems.forEach((item) => {
      const mediaContainer = item.querySelector('.work-item__media');
      if (mediaContainer) {
        mediaContainer.innerHTML = '';
      }
    });
  }
}

// Event listeners voor klikken op work items
workItems.forEach((item) => {
  item.addEventListener('click', () => {
    // Verwijder active class van alle items
    workItems.forEach((i) => i.classList.remove('is-active'));
    // Voeg active class toe aan geklikte item
    item.classList.add('is-active');
    // Update media content
    updateActiveWorkItem();
  });
});

// Update bij resize
window.addEventListener('resize', updateActiveWorkItem);

// Initial load
updateActiveWorkItem();

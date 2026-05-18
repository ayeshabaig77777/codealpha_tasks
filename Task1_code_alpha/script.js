// Get all necessary elements from the HTML
const galleryImages = document.querySelectorAll('.gallery-grid img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

let currentIndex = 0;

// 1. OPEN LIGHTBOX
galleryImages.forEach(image => {
    image.addEventListener('click', () => {
        lightbox.style.display = 'flex'; // Show the lightbox
        lightboxImg.src = image.src;    // Copy clicked image source
        currentIndex = parseInt(image.getAttribute('data-index')); // Track current index
    });
});

// 2. CLOSE LIGHTBOX
closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
});

// Close lightbox if user clicks the black background outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
    }
});

// 3. NEXT & PREVIOUS BUTTON LOGIC
function showImage(index) {
    // If we go past the last image, loop back to the first (0)
    if (index >= galleryImages.length) {
        currentIndex = 0;
    } 
    // If we go back past the first image, loop to the last one
    else if (index < 0) {
        currentIndex = galleryImages.length - 1;
    } else {
        currentIndex = index;
    }
    lightboxImg.src = galleryImages[currentIndex].src;
}

nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
prevBtn.addEventListener('click', () => showImage(currentIndex - 1));


// 4. BONUS: FILTERING CATEGORIES LOGIC
filterBtns.forEach(button => {
    button.addEventListener('click', () => {
        // Remove 'active' highlight color from old button, add to current clicked button
        document.querySelector('.filter-btn.active').classList.remove('active');
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
                item.style.display = 'block'; // Show item
            } else {
                item.style.display = 'none';  // Hide item
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {

  // ==========================================
  // 1. ADD TO CART & LOCAL STORAGE LOGIC
  // ==========================================
  // Grab the saved count from the user's browser, or start at 0
  let cartCount = parseInt(localStorage.getItem('aciCartCount')) || 0;
  const cartBadge = document.getElementById('cartBadge');
  const toast = document.getElementById('toastNotification');

  // Function to update the red badge in the header
  function updateCartBadge() {
    if (cartBadge) {
      cartBadge.textContent = cartCount;
      if (cartCount > 0) {
        cartBadge.classList.add('visible'); // Show badge if count > 0
      } else {
        cartBadge.classList.remove('visible'); // Hide badge if 0
      }
    }
  }

  // Run immediately on page load to show the saved cart amount
  updateCartBadge();

  // Listen for clicks on ANY button with the class 'add-to-cart'
  const addToCartBtns = document.querySelectorAll('.add-to-cart');
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault(); // Stops the page from jumping if href="#"
      
      // Increase count and save to browser memory
      cartCount++;
      localStorage.setItem('aciCartCount', cartCount);
      updateCartBadge();

      // Trigger the slide-up Toast Notification
      if (toast) {
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 3000); // Hide after 3 seconds
      }
    });
  });

  // ==========================================
  // 2. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealOptions = {
    threshold: 0.15, // Triggers when 15% of the section is visible
    rootMargin: "0px 0px -50px 0px" // Triggers slightly before it enters the viewport
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return; // Do nothing if not on screen
      } else {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once it has revealed once
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });

  // ==========================================
  // 3. SEARCH BAR POP-OUT LOGIC
  // ==========================================
  const searchBtn = document.getElementById('searchBtn');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const searchOverlay = document.getElementById('searchOverlay');

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', function() {
      searchOverlay.classList.toggle('active');
    });
  }
  if (closeSearchBtn && searchOverlay) {
    closeSearchBtn.addEventListener('click', function() {
      searchOverlay.classList.remove('active');
    });
  }

  // ==========================================
  // 4. WORKING CHAT BUTTON LOGIC
  // ==========================================
  const chatBtn = document.getElementById('chatBtn');
  const chatWidget = document.getElementById('chatWidget');
  const iconWrapper = document.getElementById('chatIconWrapper');

  if (chatBtn && chatWidget) {
    chatBtn.addEventListener('click', function() {
      chatWidget.classList.toggle('active');

      if (chatWidget.classList.contains('active')) {
        chatBtn.classList.add('open-state');
        iconWrapper.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#121212" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        `;
      } else {
        chatBtn.classList.remove('open-state');
        iconWrapper.innerHTML = `
          <svg class="chat-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
          <span class="chat-text" id="chatText">Chat</span>
        `;
      }
    });
  }

  // ==========================================
  // 5. STICKY HEADER (SHOWS ONLY WHEN SCROLLING UP)
  // ==========================================
  const header = document.getElementById('mainHeader');
  let lastScrollTop = 0;

  window.addEventListener('scroll', function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll <= 0) {
      header.classList.remove('scroll-down');
      return;
    }

    if (currentScroll > lastScrollTop && !header.classList.contains('scroll-down')) {
      header.classList.add('scroll-down');
    } else if (currentScroll < lastScrollTop && header.classList.contains('scroll-down')) {
      header.classList.remove('scroll-down');
    }
    
    lastScrollTop = currentScroll;
  });

  // ==========================================
  // 6. AUTO-SCROLLING SLIDERS LOGIC
  // ==========================================
  const sliders = document.querySelectorAll('.slider-wrapper');
        
  sliders.forEach(wrapper => {
    const track = wrapper.querySelector('.slider-track');
    const cards = track.querySelectorAll('.slider-card');
    const leftBtn = wrapper.querySelector('.left-btn');
    const rightBtn = wrapper.querySelector('.right-btn');
    
    let currentIndex = 0;
    let autoPlayInterval;

    function getCardsPerView() {
      if (window.innerWidth <= 480) return 1;
      if (window.innerWidth <= 768) return 2;
      if (window.innerWidth <= 900) return 3;
      return 4; 
    }

    function updateSlider() {
      const cardsPerView = getCardsPerView();
      const maxIndex = cards.length - cardsPerView;
      
      if (currentIndex > maxIndex) currentIndex = 0; 
      if (currentIndex < 0) currentIndex = maxIndex; 
      
      const gap = 20; 
      const cardWidth = cards[0].offsetWidth;
      track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
    }

    function nextSlide() {
      currentIndex++;
      updateSlider();
    }

    function prevSlide() {
      currentIndex--;
      updateSlider();
    }

    function startAutoPlay() {
      autoPlayInterval = setInterval(nextSlide, 3500); 
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    if (rightBtn) {
      rightBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
    }

    if (leftBtn) {
      leftBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    window.addEventListener('resize', updateSlider);
    startAutoPlay();
  });

//==========================================
//7. DYNAMIC PRODUCT COUNTER
//==========================================
  const productGrid = document.querySelector('.grid-5');
  const productCountDisplay = document.querySelector('.product-count');

  if (productGrid && productCountDisplay) {
    const count = productGrid.querySelectorAll('.product-card').length;
    

    productCountDisplay.textContent = `${count} product${count === 1 ? '' : 's'}`;
  }

  // ==========================================
  // 8. SIDE FILTER PANEL LOGIC
  // ==========================================
  const openFilterBtn = document.getElementById('openFilterBtn');
  const closeFilterBtn = document.getElementById('closeFilterBtn');
  const applyFiltersBtn = document.getElementById('applyFiltersBtn');
  const filterPanel = document.getElementById('filterPanel');
  const filterOverlay = document.getElementById('filterOverlay');

  function toggleFilterPanel() {
    if(filterPanel && filterOverlay) {
      filterPanel.classList.toggle('active');
      filterOverlay.classList.toggle('active');
    }
  }


  if (openFilterBtn) {
    openFilterBtn.addEventListener('click', (e) => { 
      e.preventDefault(); 
      toggleFilterPanel(); 
    });
  }

  if (closeFilterBtn) closeFilterBtn.addEventListener('click', toggleFilterPanel);
  if (filterOverlay) filterOverlay.addEventListener('click', toggleFilterPanel);
  if (applyFiltersBtn) applyFiltersBtn.addEventListener('click', toggleFilterPanel);

  document.addEventListener('DOMContentLoaded', () => {
  const floatingBtn = document.querySelector('.floating-filter-toggle');
  const chatBtn = document.getElementById('chatBtn');

  if (floatingBtn && chatBtn) {
    function updateFloatingPosition() {
      const chatRect = chatBtn.getBoundingClientRect();
      const offset = 15; 
      floatingBtn.style.bottom = `${window.innerHeight - chatRect.top + offset}px`;
    }

    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateFloatingPosition);
    });

    updateFloatingPosition();
  }
});

// ==========================================
// 9. ADVANCED FILTER & SORT LOGIC
// ==========================================
  const applyBtn = document.getElementById('applyFiltersBtn');
  const resetAvailability = document.getElementById('resetAvailability');
  const resetPrice = document.getElementById('resetPrice');

  if (resetAvailability) {
    resetAvailability.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('inStock').checked = false;
      document.getElementById('outOfStock').checked = false;
    });
  }

  if (resetPrice) {
    resetPrice.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('priceFrom').value = '';
      document.getElementById('priceTo').value = '';
    });
  }

  if (applyBtn) {
    applyBtn.addEventListener('click', function() {
      const grid = document.querySelector('.grid-5');
      const products = Array.from(grid.querySelectorAll('.product-card'));
      
      const sortValue = document.getElementById('sortSelect').value; 
      const inStockChecked = document.getElementById('inStock').checked;
      const outOfStockChecked = document.getElementById('outOfStock').checked;
      
      const minPriceStr = document.getElementById('priceFrom').value;
      const maxPriceStr = document.getElementById('priceTo').value;
      const minPrice = minPriceStr ? parseFloat(minPriceStr) : 0;
      const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : Infinity;

      products.forEach(product => {
        let isVisible = true;
        const isSoldOut = product.querySelector('.badge-sold-out') !== null;
        
        let priceElement = product.querySelector('.actual-price') || product.querySelector('.product-price');
        let productPrice = parseFloat(priceElement.innerText.replace(/[^0-9.]/g, ""));

        if (inStockChecked && !outOfStockChecked && isSoldOut) isVisible = false;
        if (outOfStockChecked && !inStockChecked && !isSoldOut) isVisible = false;
        if (productPrice < minPrice || productPrice > maxPrice) isVisible = false;

        product.style.display = isVisible ? 'block' : 'none';
      });

      let sortedProducts = [...products];

      if (sortValue === "Alphabetically, A-Z") {
        sortedProducts.sort((a, b) => a.querySelector('.product-title').innerText.trim().localeCompare(b.querySelector('.product-title').innerText.trim()));
      } else if (sortValue === "Alphabetically, Z-A") {
        sortedProducts.sort((a, b) => b.querySelector('.product-title').innerText.trim().localeCompare(a.querySelector('.product-title').innerText.trim()));
      } else if (sortValue === "Price, low to high" || sortValue === "Price, high to low") {
        sortedProducts.sort((a, b) => {
          
          let priceElemA = a.querySelector('.actual-price') || a.querySelector('.product-price');
          let priceElemB = b.querySelector('.actual-price') || b.querySelector('.product-price');
          let valA = parseFloat(priceElemA.innerText.replace(/[^0-9.]/g, ""));
          let valB = parseFloat(priceElemB.innerText.replace(/[^0-9.]/g, ""));
          return sortValue === "Price, low to high" ? valA - valB : valB - valA;
        });
      }

      grid.innerHTML = ""; 
      sortedProducts.forEach(product => grid.appendChild(product));
      toggleFilterPanel(); 
    });
  }
});
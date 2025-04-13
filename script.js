// Ajout d'un log pour confirmer que le script est chargé
console.log("Script.js chargé avec succès !");

// Gestionnaire de couleurs (conservé de la version précédente)
// Fonction pour convertir une couleur hexadécimale en RGB
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    
    return { r, g, b };
}

// Fonction pour convertir RGB en hexadécimal
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

// Fonction pour éclaircir une couleur
function lightenColor(hex, percent) {
    const rgb = hexToRgb(hex);
    
    rgb.r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * percent));
    rgb.g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * percent));
    rgb.b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * percent));
    
    return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// Fonction pour déterminer si une couleur est claire ou foncée
function isColorLight(hex) {
    const rgb = hexToRgb(hex);
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5;
}

// Fonction pour mettre à jour les couleurs dérivées
function updateDerivedColors() {
    const style = getComputedStyle(document.documentElement);
    const primaryColor = style.getPropertyValue('--color-primary').trim();
    const secondaryColor = style.getPropertyValue('--color-secondary').trim();
    const accentColor = style.getPropertyValue('--color-accent').trim();
    
    const primaryLight = lightenColor(primaryColor, 0.15);
    const secondaryLight = lightenColor(secondaryColor, 0.15);
    const accentLight = lightenColor(accentColor, 0.3);
    
    document.documentElement.style.setProperty('--color-primary-light', primaryLight);
    document.documentElement.style.setProperty('--color-secondary-light', secondaryLight);
    document.documentElement.style.setProperty('--color-accent-light', accentLight);
    
    const buttonShadowRgb = hexToRgb(accentColor);
    const buttonShadow = `rgba(${buttonShadowRgb.r}, ${buttonShadowRgb.g}, ${buttonShadowRgb.b}, 0.4)`;
    const buttonShadowHover = `rgba(${buttonShadowRgb.r}, ${buttonShadowRgb.g}, ${buttonShadowRgb.b}, 0.6)`;
    
    document.documentElement.style.setProperty('--button-shadow', buttonShadow);
    document.documentElement.style.setProperty('--button-shadow-hover', buttonShadowHover);
}

// Fonction pour optimiser l'affichage des images de service
function optimizeServiceImages() {
    const serviceImages = document.querySelectorAll(".service-img");
    
    serviceImages.forEach((imgContainer) => {
        const bgImage = window.getComputedStyle(imgContainer).backgroundImage;
        const url = bgImage.match(/url\(['"]?(.*?)['"]?\)/)?.[1];
        
        if (url) {
            const img = new Image();
            img.src = url;
            
            img.onload = function () {
                const ratio = img.width / img.height;
                
                if (ratio > 1.5) {
                    imgContainer.style.backgroundPosition = "center center";
                } else if (ratio < 0.8) {
                    imgContainer.style.backgroundPosition = "center top";
                } else {
                    imgContainer.style.backgroundSize = "cover";
                    imgContainer.style.backgroundPosition = "center center";
                }
                
                imgContainer.classList.add("optimized");
            };
            
            img.onerror = function () {
                console.warn(`Impossible de charger l'image: ${url}`);
                imgContainer.style.backgroundColor = "var(--gray-dark)";
            };
        }
    });
}

// ====== VERSION CORRIGÉE DU CARROUSEL ======
function setupTestimonialCarousel() {
    console.log("Initialisation du carrousel de témoignages...");
    
    // Sélectionner le conteneur
    const container = document.querySelector('.testimonials-container');
    if (!container) {
        console.error("Conteneur de témoignages introuvable");
        return;
    }
    
    // Sélectionner tous les témoignages
    const testimonials = container.querySelectorAll('.testimonial');
    if (testimonials.length === 0) {
        console.error("Aucun témoignage trouvé");
        return;
    }
    
    console.log(`Nombre de témoignages trouvés: ${testimonials.length}`);
    
    // CORRECTION: Construire manuellement le HTML du carrousel pour éviter les problèmes
    // Au lieu de déplacer les éléments du DOM, reconstruisons tout depuis zéro
    
    // 1. Créer le HTML du slider
    let sliderHTML = '<div class="testimonials-slider">';
    
    // 2. Ajouter chaque témoignage au HTML du slider
    testimonials.forEach((testimonial, index) => {
        const testimonialHTML = testimonial.outerHTML;
        sliderHTML += testimonialHTML;
    });
    
    sliderHTML += '</div>';
    
    // 3. Remplacer le contenu du container par le nouveau HTML
    container.innerHTML = sliderHTML;
    
    // 4. Référencer le nouveau slider
    const slider = container.querySelector('.testimonials-slider');
    
    // 5. Référencer les nouveaux témoignages
    const newTestimonials = slider.querySelectorAll('.testimonial');
    
    // Initialiser les témoignages (tous invisibles au départ)
    newTestimonials.forEach(testimonial => {
        testimonial.style.opacity = '0';
        testimonial.style.transform = 'scale(0.9)';
    });
    
    // Créer les contrôles de navigation
    const controls = document.createElement('div');
    controls.className = 'testimonial-controls';
    
    // Créer les flèches de navigation
    const prevBtn = document.createElement('div');
    prevBtn.className = 'testimonial-arrow prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const nextBtn = document.createElement('div');
    nextBtn.className = 'testimonial-arrow next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    // Créer les points indicateurs
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'testimonial-dots';
    
    // Créer un point pour chaque témoignage
    for (let i = 0; i < newTestimonials.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'testimonial-dot';
        if (i === 0) dot.classList.add('active');
        
        dotsContainer.appendChild(dot);
    }
    
    // Ajouter les contrôles au DOM
    controls.appendChild(prevBtn);
    controls.appendChild(dotsContainer);
    controls.appendChild(nextBtn);
    container.after(controls);
    
    // Variables d'état du carrousel
    let currentIndex = 0;
    let isAnimating = false;
    
    // Fonction pour aller à un témoignage spécifique
    function goToSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Gérer les limites
        if (index < 0) index = newTestimonials.length - 1;
        if (index >= newTestimonials.length) index = 0;
        
        // Masquer le témoignage actuel
        if (newTestimonials[currentIndex]) {
            newTestimonials[currentIndex].style.opacity = '0';
            newTestimonials[currentIndex].style.transform = 'scale(0.9)';
            newTestimonials[currentIndex].classList.remove('active');
        }
        
        // Mettre à jour les points
        const dots = dotsContainer.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // CORRECTION: Décaler la position du slider
        slider.style.transform = `translateX(-${index * 100}%)`;
        
        // Afficher le nouveau témoignage
        setTimeout(() => {
            newTestimonials[index].style.opacity = '1';
            newTestimonials[index].style.transform = 'scale(1)';
            newTestimonials[index].classList.add('active');
            
            currentIndex = index;
            isAnimating = false;
            
            console.log(`Affichage du témoignage ${index + 1}/${newTestimonials.length}`);
        }, 300);
    }
    
    // Ajout des événements aux dots
    const dots = dotsContainer.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isAnimating && index !== currentIndex) {
                goToSlide(index);
            }
        });
    });
    
    // Événements pour les boutons
    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
    });
    
    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
    });
    
    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentIndex + 1);
        }
    });
    
    // Défilement automatique
    let autoplayInterval;
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 8000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Arrêter le défilement au survol
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
    controls.addEventListener('mouseenter', stopAutoplay);
    controls.addEventListener('mouseleave', startAutoplay);
    
    // Afficher le premier témoignage
    setTimeout(() => {
        goToSlide(0);
        startAutoplay();
    }, 300);
    
    console.log("Initialisation du carrousel terminée");
}

// ====== MENU MOBILE ======
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.classList.toggle('active');
            }
        });
    }
}

// ====== INITIALISATION AU CHARGEMENT DE LA PAGE ======
window.onload = function() {
    console.log("Page entièrement chargée");
    
    // Mettre à jour les couleurs
    updateDerivedColors();
    
    // Initialiser le menu mobile
    setupMobileMenu();
    
    // Initialiser le carrousel avec un délai pour éviter les problèmes de timing
    setTimeout(() => {
        setupTestimonialCarousel();
    }, 500); // Délai augmenté à 500ms
    
    // Optimiser les images
    optimizeServiceImages();
};
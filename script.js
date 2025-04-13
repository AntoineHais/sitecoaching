// Fonction pour convertir une couleur hexadécimale en RGB
function hexToRgb(hex) {
    // Supprime le # si présent
    hex = hex.replace(/^#/, '');
    
    // S'assurer que nous avons un format hexadécimal valide
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    // Analyse la chaîne hexadécimale
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
    
    // Éclaircir chaque composante de couleur
    rgb.r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * percent));
    rgb.g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * percent));
    rgb.b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * percent));
    
    return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// Fonction pour assombrir une couleur
function darkenColor(hex, percent) {
    const rgb = hexToRgb(hex);
    
    // Assombrir chaque composante de couleur
    rgb.r = Math.max(0, Math.round(rgb.r * (1 - percent)));
    rgb.g = Math.max(0, Math.round(rgb.g * (1 - percent)));
    rgb.b = Math.max(0, Math.round(rgb.b * (1 - percent)));
    
    return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// Fonction pour ajuster la saturation d'une couleur
function adjustSaturation(hex, percent) {
    const rgb = hexToRgb(hex);
    
    // Convertir RGB en HSL
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // achromatique
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }
    
    // Ajuster la saturation
    s = Math.min(1, Math.max(0, s * percent));
    
    // Convertir HSL en RGB
    let r1, g1, b1;
    
    if (s === 0) {
        r1 = g1 = b1 = l; // achromatique
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r1 = hue2rgb(p, q, h + 1/3);
        g1 = hue2rgb(p, q, h);
        b1 = hue2rgb(p, q, h - 1/3);
    }
    
    return rgbToHex(Math.round(r1 * 255), Math.round(g1 * 255), Math.round(b1 * 255));
}

// Fonction pour déterminer si une couleur est claire ou foncée
function isColorLight(hex) {
    const rgb = hexToRgb(hex);
    // Formule pour déterminer la luminosité (selon la perception humaine)
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5;
}

// Fonction pour ajuster la couleur d'accent de manière intelligente
function getAccentLightColor(hex) {
    // Si la couleur d'accent est déjà claire, la rendre légèrement plus claire
    // Si elle est foncée, la rendre significativement plus claire
    const isLight = isColorLight(hex);
    
    if (isLight) {
        // Pour les couleurs claires, augmenter la saturation et légèrement la luminosité
        const saturated = adjustSaturation(hex, 1.2); // Augmenter la saturation de 20%
        return lightenColor(saturated, 0.1); // Légèrement plus claire
    } else {
        // Pour les couleurs foncées, les rendre significativement plus claires
        return lightenColor(hex, 0.3); // Beaucoup plus claire
    }
}

// Fonction pour mettre à jour les couleurs dérivées
function updateDerivedColors() {
    // Récupérer les couleurs primaires du CSS
    const style = getComputedStyle(document.documentElement);
    const primaryColor = style.getPropertyValue('--color-primary').trim();
    const secondaryColor = style.getPropertyValue('--color-secondary').trim();
    const accentColor = style.getPropertyValue('--color-accent').trim();
    
    // Calculer les couleurs dérivées de manière intelligente
    const primaryLight = lightenColor(primaryColor, 0.15);
    const secondaryLight = lightenColor(secondaryColor, 0.15);
    const accentLight = getAccentLightColor(accentColor);
    
    // Mettre à jour les variables CSS
    document.documentElement.style.setProperty('--color-primary-light', primaryLight);
    document.documentElement.style.setProperty('--color-secondary-light', secondaryLight);
    document.documentElement.style.setProperty('--color-accent-light', accentLight);
    
    // Mettre à jour les ombres pour les boutons en fonction de la couleur d'accent
    const buttonShadowRgb = hexToRgb(accentColor);
    const buttonShadow = `rgba(${buttonShadowRgb.r}, ${buttonShadowRgb.g}, ${buttonShadowRgb.b}, 0.4)`;
    const buttonShadowHover = `rgba(${buttonShadowRgb.r}, ${buttonShadowRgb.g}, ${buttonShadowRgb.b}, 0.6)`;
    
    // Appliquer les ombres personnalisées aux boutons
    document.documentElement.style.setProperty('--button-shadow', buttonShadow);
    document.documentElement.style.setProperty('--button-shadow-hover', buttonShadowHover);
}
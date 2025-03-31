// Configuration de l'API
const API_BASE_URL = 'https://votre-domaine-beget.com/api';  // À remplacer par votre URL Beget

// Fonction d'observation des éléments
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observer tous les éléments avec animation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-up, .fade-in, .slide-in-left, .slide-in-right, .form-group').forEach(element => {
        observer.observe(element);
    });

    // Image compression function
    const compressImage = (base64String, maxWidth = 400) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64String;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Calculate new dimensions
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                // Taille raisonnable mais suffisante pour une bonne qualité
                if (width > 150) {
                    const ratio = 150 / width;
                    width = 150;
                    height = Math.round(height * ratio);
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress with better quality
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
        });
    };

    // Image upload handling
    const profileImageInput = document.getElementById('profile_image');
    const filePreview = document.querySelector('.file-preview');
    const fileLabel = document.querySelector('.file-input-label');
    const fileLabelText = fileLabel.querySelector('span');
    let profileImageBase64 = '';

    profileImageInput.addEventListener('change', async function(e) {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async function(e) {
                profileImageBase64 = await compressImage(e.target.result);
                filePreview.innerHTML = `<img src="${profileImageBase64}" alt="Profile Preview">`;
                filePreview.classList.add('has-image');
                fileLabelText.textContent = file.name;
                fileLabel.classList.add('has-file');
            }
            reader.readAsDataURL(file);
        } else {
            profileImageBase64 = '';
            filePreview.innerHTML = '';
            filePreview.classList.remove('has-image');
            fileLabelText.textContent = 'Drop your image here or click to browse';
            fileLabel.classList.remove('has-file');
        }
    });

    // LZString compression library
    const LZString={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",_f:String.fromCharCode,compressToEncodedURIComponent:function(r){return null==r?"":LZString._compress(r,6,function(r){return LZString._keyStr.charAt(r)})},_compress:function(r,n,e){if(null==r)return"";var t,o,i,a={},c={},f="",s="",l="",h=2,u=3,p=2,g=[],d=0,v=0;for(i=0;i<r.length;i+=1)if(f=r.charAt(i),Object.prototype.hasOwnProperty.call(a,f)||(a[f]=u++,c[f]=!0),s=l+f,Object.prototype.hasOwnProperty.call(a,s))l=s;else{if(Object.prototype.hasOwnProperty.call(c,l)){if(l.charCodeAt(0)<256){for(t=0;t<p;t++)d<<=1,v==n-1?(v=0,g.push(e(d)),d=0):v++;for(o=l.charCodeAt(0),t=0;t<8;t++)d=d<<1|1&o,v==n-1?(v=0,g.push(e(d)),d=0):v++,o>>=1}else{for(o=1,t=0;t<p;t++)d=d<<1|o,v==n-1?(v=0,g.push(e(d)),d=0):v++,o=0;for(o=l.charCodeAt(0),t=0;t<16;t++)d=d<<1|1&o,v==n-1?(v=0,g.push(e(d)),d=0):v++,o>>=1}0==--h&&(h=Math.pow(2,p),p++),delete c[l]}else for(o=a[l],t=0;t<p;t++)d=d<<1|1&o,v==n-1?(v=0,g.push(e(d)),d=0):v++,o>>=1;0==--h&&(h=Math.pow(2,p),p++),a[s]=u++,l=String(f)}if(""!==l){if(Object.prototype.hasOwnProperty.call(c,l)){if(l.charCodeAt(0)<256){for(t=0;t<p;t++)d<<=1,v==n-1?(v=0,g.push(e(d)),d=0):v++;for(o=l.charCodeAt(0),t=0;t<8;t++)d=d<<1|1&o,v==n-1?(v=0,g.push(e(d)),d=0):v++,o>>=1}else{for(o=1,t=0;t<p;t++)d=d<<1|o,v==n-1?(v=0,g.push(e(d)),d=0):v++,o=0;for(o=l.charCodeAt(0),t=0;t<16;t++)d=d<<1|1&o,v==n-1?(v=0,g.push(e(d)),d=0):v++,o>>=1}0==--h&&(h=Math.pow(2,p),p++),delete c[l]}else for(o=a[l],t=0;t<p;t++)d=d<<1|1&o,v==n-1?(v=0,g.push(e(d)),d=0):v++,o>>=1;0==--h&&(h=Math.pow(2,p),p++)}for(o=2,t=0;t<p;t++)d=d<<1|1&o,v==n-1?(v=0,g.push(e(d)),d=0):v++,o>>=1;for(;;){if(d<<=1,v==n-1){g.push(e(d));break}v++}return g.join("")}};

    // Fonction pour générer un ID court unique
    function generateShortId(length = 6) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Fonction pour sauvegarder l'URL dans la base de données MySQL
    async function saveUrl(longUrl) {
        try {
            // Générer un ID court unique
            const shortId = generateShortId();
            
            // Nettoyer l'URL des caractères d'échappement
            const cleanUrl = longUrl.replace(/\\/g, '');
            
            // Sauvegarder dans la base de données
            const response = await fetch('/FAYNME/src/assets/data/handle_urls.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    [shortId]: {
                        url: cleanUrl,
                        createdAt: new Date().toISOString()
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors de la sauvegarde de l\'URL');
            }
            
            return shortId;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'URL:', error);
            throw error;
        }
    }

    // Fonction pour créer une URL courte
    async function createShortUrl(longUrl) {
        try {
            const response = await fetch(`${API_BASE_URL}/r/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: longUrl })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // Form submission and QR code generation
    const form = document.querySelector('.virtual-card-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Show loading state
        const loadingModal = document.createElement('div');
        loadingModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        const loadingContent = document.createElement('div');
        loadingContent.style.cssText = `
            background: #1A1A1A;
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
        `;

        const loadingText = document.createElement('p');
        loadingText.textContent = 'Génération de votre QR Code...';
        loadingText.style.cssText = `
            color: white;
            margin-bottom: 1rem;
        `;

        const spinner = document.createElement('div');
        spinner.style.cssText = `
            width: 40px;
            height: 40px;
            margin: 0 auto;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            border-top-color: #0088FF;
            animation: spin 1s ease-in-out infinite;
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;

        document.head.appendChild(styleSheet);
        loadingContent.appendChild(loadingText);
        loadingContent.appendChild(spinner);
        loadingModal.appendChild(loadingContent);
        document.body.appendChild(loadingModal);

        try {
            // Récupérer les données du formulaire
            const formData = {
                template: document.querySelector('input[name="template"]:checked').value,
                name: document.getElementById('name').value.trim(),
                profile_image: profileImageBase64 || '',
                phone: document.getElementById('phone').value.trim(),
                email: document.getElementById('email').value.trim(),
                address: document.getElementById('address').value.trim(),
                website: document.getElementById('website').value.trim(),
                title: document.getElementById('title').value.trim(),
                bio: document.getElementById('bio').value.trim(),
                services: document.getElementById('services').value.trim(),
                instagram: document.getElementById('instagram').value.trim(),
                facebook: document.getElementById('facebook').value.trim(),
                linkedin: document.getElementById('linkedin').value.trim(),
                tiktok: document.getElementById('tiktok').value.trim()
            };

            // Créer l'URL avec les données du formulaire
            const templatePath = formData.template;
            const queryString = new URLSearchParams(formData).toString();
            const longUrl = `/FAYNME/src/assets/templates/${templatePath}.html?${queryString}`;
            
            // Generate short URL
            const shortId = await saveUrl(longUrl);
            const shortUrl = `${window.location.origin}/FAYNME/r/${shortId}`;

            // Remove loading modal
            loadingModal.remove();

            // Create modal for QR code
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            `;

            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: #1A1A1A;
                padding: 2rem;
                border-radius: 16px;
                text-align: center;
                max-width: 90%;
                width: 400px;
            `;

            const title = document.createElement('h2');
            title.textContent = 'Votre QR Code est prêt !';
            title.style.cssText = `
                color: white;
                margin-bottom: 1.5rem;
                font-size: 1.5rem;
            `;

            const qrContainer = document.createElement('div');
            qrContainer.id = 'qr-code';
            qrContainer.style.cssText = `
                margin: 0 auto 1.5rem;
                padding: 1rem;
                background: white;
                border-radius: 8px;
                display: inline-block;
            `;

            // Generate QR Code
            new QRCode(qrContainer, {
                text: shortUrl,
                width: 256,
                height: 256,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.L
            });

            const shortUrlContainer = document.createElement('div');
            shortUrlContainer.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
                padding: 0.5rem;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
            `;

            const shortUrlText = document.createElement('span');
            shortUrlText.textContent = shortUrl;
            shortUrlText.style.cssText = `
                color: white;
                word-break: break-all;
            `;

            const copyButton = document.createElement('button');
            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            copyButton.style.cssText = `
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.5rem;
                font-size: 1.2rem;
            `;

            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(shortUrl);
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            });

            shortUrlContainer.appendChild(shortUrlText);
            shortUrlContainer.appendChild(copyButton);

            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Télécharger le QR Code';
            downloadButton.style.cssText = `
                background: #0088FF;
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                margin-bottom: 1rem;
                font-size: 1rem;
                transition: background 0.3s;
            `;

            downloadButton.addEventListener('click', () => {
                const qrImage = qrContainer.querySelector('img');
                const link = document.createElement('a');
                link.download = 'qr-code.png';
                link.href = qrImage.src;
                link.click();
            });

            const shareButton = document.createElement('button');
            shareButton.textContent = 'Partager la carte';
            shareButton.style.cssText = `
                background: #4CAF50;
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                transition: background 0.3s;
            `;

            shareButton.addEventListener('click', async () => {
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: 'Ma carte de visite virtuelle',
                            text: 'Découvrez ma carte de visite virtuelle',
                            url: shortUrl
                        });
                    } catch (error) {
                        console.error('Erreur lors du partage:', error);
                    }
                } else {
                    // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
                    window.open(`https://wa.me/?text=${encodeURIComponent('Découvrez ma carte de visite virtuelle: ' + shortUrl)}`);
                }
            });

            modalContent.appendChild(title);
            modalContent.appendChild(qrContainer);
            modalContent.appendChild(shortUrlContainer);
            modalContent.appendChild(downloadButton);
            modalContent.appendChild(shareButton);

            const closeButton = document.createElement('button');
            closeButton.innerHTML = '&times;';
            closeButton.style.cssText = `
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 0.5rem;
            `;

            closeButton.addEventListener('click', () => {
                modal.remove();
            });

            modal.appendChild(modalContent);
            modal.appendChild(closeButton);
            document.body.appendChild(modal);

        } catch (error) {
            console.error('Erreur:', error);
            loadingModal.remove();
            alert('Une erreur est survenue lors de la génération du QR code.');
        }
    });

    // Smooth scroll for the "Get Started Now" button
    document.querySelector('.cta-button').addEventListener('click', function(e) {
        e.preventDefault();
        const targetSection = document.querySelector('#virtual-card-form');
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
}); 
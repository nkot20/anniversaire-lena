// Configuration - Change this to the correct birthday
const CORRECT_BIRTHDAY = '2025-08-25'; // Format: YYYY-MM-DD

let currentPage = 1;
let revealedMessages = 0;
let viewedSlides = new Set([0]); // Track which slides have been viewed, start with first slide
const totalSlides = 5;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Setup login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Setup carousel tracking
    setupCarouselTracking();
    
    // Initialize confetti animation on final page
    createConfetti();
    
    // Load best score from localStorage
    loadBestScore();
}

function setupCarouselTracking() {
    const carousel = document.getElementById('memoryCarousel');
    if (carousel) {
        carousel.addEventListener('slid.bs.carousel', function(event) {
            const slideIndex = parseInt(event.to);
            viewedSlides.add(slideIndex);
            updateGalleryProgress();
        });
    }
}

function updateGalleryProgress() {
    const progressBar = document.getElementById('galleryProgress');
    const viewedCount = document.getElementById('viewedCount');
    const continueBtn = document.getElementById('continueBtn');
    
    if (progressBar && viewedCount && continueBtn) {
        const progress = (viewedSlides.size / totalSlides) * 100;
        progressBar.style.width = progress + '%';
        viewedCount.textContent = viewedSlides.size;
        
        // Enable continue button only when all slides are viewed
        if (viewedSlides.size === totalSlides) {
            continueBtn.disabled = false;
            continueBtn.classList.remove('btn-secondary');
            continueBtn.classList.add('btn-pink');
            continueBtn.innerHTML = '<i class="fas fa-heart me-2"></i>Tous les souvenirs vus ! Continuer';
            continueBtn.style.animation = 'pulse 1s infinite';
        }
    }
}

function handleLogin(e) {
    e.preventDefault();
    const birthdateInput = document.getElementById('birthdateInput');
    const errorMessage = document.getElementById('errorMessage');
    
    if (birthdateInput.value === CORRECT_BIRTHDAY) {
        // Correct birthday - proceed to next page
        errorMessage.style.display = 'none';
        nextPage();
    } else {
        // Wrong birthday - show error message
        errorMessage.style.display = 'block';
        birthdateInput.value = '';
        
        // Add shake animation to the form
        const card = document.querySelector('.login-container .card');
        card.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            card.style.animation = '';
        }, 500);
    }
}

function nextPage() {
    const currentPageElement = document.getElementById(`page${currentPage}`);
    currentPage++;
    const nextPageElement = document.getElementById(`page${currentPage}`);
    
    if (currentPageElement && nextPageElement) {
        // Fade out current page
        currentPageElement.style.opacity = '0';
        currentPageElement.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            currentPageElement.classList.remove('active');
            nextPageElement.classList.add('active');
            
            // Reset and fade in next page
            nextPageElement.style.opacity = '0';
            nextPageElement.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                nextPageElement.style.opacity = '1';
                nextPageElement.style.transform = 'translateY(0)';
                
                // Special animations for specific pages
                if (currentPage === 2) {
                    animateWelcomePage();
                } else if (currentPage === 5) {
                    startFinalAnimation();
                }
            }, 100);
        }, 300);
    }
}

function animateWelcomePage() {
    const textElements = document.querySelectorAll('#page2 .fade-in-text');
    textElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 500);
    });
}

function revealMessage(cardElement) {
    const icon = cardElement.querySelector('i');
    const title = cardElement.querySelector('h5');
    const hiddenMessage = cardElement.querySelector('.hidden-message');
    
    if (hiddenMessage.style.display === 'none') {
        // Reveal the message
        icon.style.display = 'none';
        title.style.display = 'none';
        hiddenMessage.style.display = 'block';
        
        // Add reveal animation
        hiddenMessage.style.animation = 'revealMessage 0.5s ease-out';
        
        // Change card background
        cardElement.querySelector('.card').style.background = 'linear-gradient(135deg, #ffe0f0 0%, #ffd6eb 100%)';
        
        revealedMessages++;
        
        // If all messages are revealed, show continue button with animation
        if (revealedMessages === 4) {
            setTimeout(() => {
                const continueBtn = document.querySelector('#page4 .btn-pink');
                continueBtn.style.animation = 'pulse 1s infinite';
                continueBtn.innerHTML = '<i class="fas fa-gift me-2"></i>Tous les messages découverts ! Surprise finale';
            }, 1000);
        }
    }
}

function startFinalAnimation() {
    // Start confetti animation
    createConfetti();
    
    // Animate the celebration text
    const celebrationText = document.querySelector('.celebration-text');
    celebrationText.style.animation = 'celebrate 2s ease-in-out infinite';
    
    // Animate floating elements
    const floatingElements = document.querySelectorAll('.floating-heart, .floating-star');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Play success sound (if available)
    playSuccessSound();
}

function createConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
    if (!confettiContainer) return;
    
    // Clear existing confetti
    confettiContainer.innerHTML = '';
    
    // Create multiple confetti pieces
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${getRandomColor()};
            left: ${Math.random() * 100}%;
            animation: confetti ${3 + Math.random() * 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
        `;
        confettiContainer.appendChild(confetti);
    }
}

function getRandomColor() {
    const colors = ['#ff6b9d', '#ffd700', '#ff69b4', '#87ceeb', '#98fb98', '#dda0dd'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function playSuccessSound() {
    // Create a simple success sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Audio not supported');
    }
}

function restartJourney() {
    currentPage = 1;
    revealedMessages = 0;
    viewedSlides = new Set([0]); // Reset viewed slides
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show first page
    document.getElementById('page1').classList.add('active');
    
    // Reset form
    document.getElementById('birthdateInput').value = '';
    document.getElementById('errorMessage').style.display = 'none';
    
    // Reset gallery progress
    const progressBar = document.getElementById('galleryProgress');
    const viewedCount = document.getElementById('viewedCount');
    const continueBtn = document.getElementById('continueBtn');
    
    if (progressBar && viewedCount && continueBtn) {
        progressBar.style.width = '20%';
        viewedCount.textContent = '1';
        continueBtn.disabled = true;
        continueBtn.classList.remove('btn-pink');
        continueBtn.classList.add('btn-secondary');
        continueBtn.innerHTML = '<i class="fas fa-heart me-2"></i>Continuer';
        continueBtn.style.animation = '';
    }
    
    // Reset message cards
    document.querySelectorAll('.message-card').forEach(card => {
        const icon = card.querySelector('i');
        const title = card.querySelector('h5');
        const hiddenMessage = card.querySelector('.hidden-message');
        
        icon.style.display = 'block';
        title.style.display = 'block';
        hiddenMessage.style.display = 'none';
        card.querySelector('.card').style.background = 'linear-gradient(135deg, #fff 0%, #ffeef8 100%)';
    });
    
    // Reset continue button on page 4
    const page4ContinueBtn = document.querySelector('#page4 .btn-pink');
    if (page4ContinueBtn) {
        page4ContinueBtn.style.animation = '';
        page4ContinueBtn.innerHTML = '<i class="fas fa-heart me-2"></i>Continuer';
    }
}

function loadBestScore() {
    // This function is kept for compatibility but not used in the birthday app
    const bestScore = localStorage.getItem('bestScore') || 0;
    const bestScoreElement = document.getElementById('best-score');
    if (bestScoreElement) {
        bestScoreElement.textContent = bestScore;
    }
}

// Add CSS for shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .confetti-piece {
        border-radius: 50%;
    }
    
    @keyframes confetti {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

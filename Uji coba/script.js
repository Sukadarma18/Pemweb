// ===== STATE VARIABLES =====
let currentMeatFreq = 'jarang';
let chatMessages = [
    { id: 1, text: "Halo! Saya Asisten Energi. Ada yang bisa saya bantu terkait jejak karbon hari ini?", sender: 'bot' }
];

// ===== NAVBAR FUNCTIONALITY =====
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
document.getElementById('mobileToggle').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    
    mobileMenu.classList.toggle('hidden');
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
});

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    
    mobileMenu.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
}

// ===== SCROLL FUNCTIONS =====
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== CALCULATOR FUNCTIONALITY =====
function selectMeatFreq(value) {
    currentMeatFreq = value;
    
    // Update button states
    const buttons = document.querySelectorAll('.btn-option');
    buttons.forEach(btn => {
        if (btn.dataset.value === value) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update hint text
    const hint = document.getElementById('meatFreqHint');
    const hints = {
        'jarang': '1-2 kali/minggu',
        'sedang': '3-4 kali/minggu',
        'sering': 'Hampir setiap hari'
    };
    hint.textContent = hints[value];
}

document.getElementById('carbonForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Show loading state
    submitText.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');
    submitBtn.disabled = true;
    
    // Get form values
    const transportType = document.getElementById('transportType').value;
    const distance = parseFloat(document.getElementById('distance').value) || 0;
    const electricity = parseFloat(document.getElementById('electricity').value) || 0;
    
    // Simulate calculation delay
    setTimeout(() => {
        calculateCarbonFootprint(transportType, distance, electricity, currentMeatFreq);
        
        // Reset button state
        submitText.classList.remove('hidden');
        loadingSpinner.classList.add('hidden');
        submitBtn.disabled = false;
    }, 800);
});

function calculateCarbonFootprint(transportType, distance, electricity, meatFreq) {
    // Emission factors (dummy values for demo)
    const transportFactor = transportType === 'mobil' ? 0.2 : transportType === 'motor' ? 0.1 : 0.05;
    const meatFactor = meatFreq === 'sering' ? 3.3 : meatFreq === 'sedang' ? 2.5 : 1.5;
    
    const transportScore = distance * transportFactor;
    const electricityScore = (electricity / 30) * 0.85; // assumption per day
    const totalScore = transportScore + electricityScore + meatFactor;
    
    let category = 'Rendah';
    let categoryClass = 'low';
    let tips = ["Pertahankan kebiasaan baik Anda!", "Coba tanam satu pohon di halaman rumah."];
    
    if (totalScore > 10 && totalScore <= 20) {
        category = 'Sedang';
        categoryClass = 'medium';
        tips = ["Kurangi penggunaan AC di malam hari.", "Coba gunakan transportasi umum 2x seminggu."];
    } else if (totalScore > 20) {
        category = 'Tinggi';
        categoryClass = 'high';
        tips = [
            "Pertimbangkan untuk mengurangi konsumsi daging merah.",
            "Ganti lampu rumah dengan LED hemat energi.",
            "Cabut colokan listrik yang tidak terpakai."
        ];
    }
    
    displayResult(totalScore.toFixed(2), category, categoryClass, tips);
}

function displayResult(score, category, categoryClass, tips) {
    const placeholder = document.getElementById('resultPlaceholder');
    const resultCard = document.getElementById('resultCard');
    const resultHeader = document.getElementById('resultHeader');
    const resultScore = document.getElementById('resultScore');
    const resultCategory = document.getElementById('resultCategory');
    const resultTips = document.getElementById('resultTips');
    
    // Hide placeholder, show result
    placeholder.classList.add('hidden');
    resultCard.classList.remove('hidden');
    
    // Update result content
    resultHeader.className = `result-header ${categoryClass}`;
    resultScore.textContent = score;
    resultCategory.textContent = `Kategori: ${category}`;
    
    // Clear and populate tips
    resultTips.innerHTML = '';
    tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        resultTips.appendChild(li);
    });
}

function resetCalculator() {
    const placeholder = document.getElementById('resultPlaceholder');
    const resultCard = document.getElementById('resultCard');
    
    placeholder.classList.remove('hidden');
    resultCard.classList.add('hidden');
    
    document.getElementById('carbonForm').reset();
    selectMeatFreq('jarang');
}

// ===== CHATBOT FUNCTIONALITY =====
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    const chatIcon = document.getElementById('chatIcon');
    const chatCloseIcon = document.getElementById('chatCloseIcon');
    
    chatWindow.classList.toggle('hidden');
    chatIcon.classList.toggle('hidden');
    chatCloseIcon.classList.toggle('hidden');
    
    // Scroll to bottom when opening
    if (!chatWindow.classList.contains('hidden')) {
        setTimeout(() => {
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }
}

document.getElementById('chatForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    chatInput.value = '';
    
    // Disable send button temporarily
    chatSendBtn.disabled = true;
    
    // Simulate bot response
    setTimeout(() => {
        const botResponse = "Terima kasih atas pertanyaannya! Sebagai model AI sederhana, saya menyarankan Anda untuk memulai dengan mengurangi penggunaan plastik sekali pakai.";
        addChatMessage(botResponse, 'bot');
        chatSendBtn.disabled = false;
    }, 1000);
});

function addChatMessage(text, sender) {
    const chatMessagesContainer = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.textContent = text;
    
    messageDiv.appendChild(bubbleDiv);
    chatMessagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Initialize meat frequency
    selectMeatFreq('jarang');
});
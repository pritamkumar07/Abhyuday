// Mess Pass Scanner & Result Screen JS
document.addEventListener('DOMContentLoaded', () => {
    // Parse URL parameter for meal name
    const urlParams = new URLSearchParams(window.location.search);
    let meal = urlParams.get('meal') || 'BreakFast';
    
    // Capitalize first letter properly (e.g. BreakFast, Lunch, Dinner)
    if (meal.toLowerCase() === 'breakfast') meal = 'BreakFast';
    if (meal.toLowerCase() === 'lunch') meal = 'Lunch';
    if (meal.toLowerCase() === 'dinner') meal = 'Dinner';

    // UI Elements
    const viewfinderWrapper = document.getElementById('viewfinder-wrapper');
    const messPassResult = document.getElementById('mess-pass-result');
    const passMealTitle = document.getElementById('pass-meal-title');
    const passDate = document.getElementById('pass-date');
    const passTime = document.getElementById('pass-time');
    const countdownBadge = document.getElementById('countdown-badge');
    const qrContainer = document.getElementById('qr-container');

    const scanStatusText = document.getElementById('scan-status-text');
    const scanLine = document.getElementById('scan-line');
    const qrIcon = document.getElementById('qr-target-icon');
    const videoFeed = document.getElementById('camera-feed');
    const cameraSimulation = document.getElementById('camera-simulation');

    const cornerTL = document.getElementById('c-tl');
    const cornerTR = document.getElementById('c-tr');
    const cornerBL = document.getElementById('c-bl');
    const cornerBR = document.getElementById('c-br');

    // Update Meal Text
    if (passMealTitle) passMealTitle.textContent = meal;

    // Format Current Date & Time (e.g., Jul 26, 2026   11:43 AM)
    const now = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthStr = monthNames[now.getMonth()];
    const dayStr = String(now.getDate()).padStart(2, '0');
    const yearStr = now.getFullYear();
    
    if (passDate) passDate.textContent = `${monthStr} ${dayStr}, ${yearStr}`;

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // hour 0 is 12
    const timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    
    if (passTime) passTime.textContent = timeStr;

    // Render Exact High-Density Vector QR Code SVG
    if (qrContainer) {
        qrContainer.innerHTML = generateExactQRCodeSVG();
    }

    // Camera WebRTC Stream (Mobile phones)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: "environment" } }
        }).then(stream => {
            if (videoFeed) {
                videoFeed.srcObject = stream;
                videoFeed.style.display = 'block';
                if (cameraSimulation) cameraSimulation.style.display = 'none';
                if (qrIcon) qrIcon.style.display = 'none';
            }
        }).catch(err => {
            console.log("Camera simulation mode active:", err);
        });
    }

    // Scanning Sequence Timing (Takes 3 to 4 seconds before showing next page)
    // 0.0s -> Scanning QR Code...
    // 1.5s -> Verifying Pass & Student Credentials...
    // 3.0s -> Lock Corners Green & Verified!
    // 3.8s -> Show Mess Pass Result Card Page!
    
    setTimeout(() => {
        if (scanStatusText) scanStatusText.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Verifying Pass & Student Credentials...`;
        if (qrIcon) qrIcon.style.color = '#3b82f6';
    }, 2000);

    setTimeout(() => {
        if (scanLine) scanLine.style.display = 'none';
        if (qrIcon) qrIcon.style.color = '#22c55e';
        [cornerTL, cornerTR, cornerBL, cornerBR].forEach(c => { if (c) c.style.borderColor = '#22c55e'; });
        if (scanStatusText) scanStatusText.innerHTML = `<i class="fas fa-check-circle" style="color: #22c55e;"></i> QR Verified Successfully!`;
    }, 2800);

    setTimeout(() => {
        // Hide Viewfinder, Show Mess Pass Result Card Screen after scanning
        if (viewfinderWrapper) viewfinderWrapper.style.display = 'none';
        if (messPassResult) messPassResult.classList.add('active');

        // Stop camera stream if active
        if (videoFeed && videoFeed.srcObject) {
            videoFeed.srcObject.getTracks().forEach(track => track.stop());
        }

        // Start Countdown Timer
        startCountdown(30);
    }, 3800);

    // Countdown Badge Timer Logic
    function startCountdown(seconds) {
        let count = seconds;
        if (countdownBadge) countdownBadge.textContent = count;
        
        const timer = setInterval(() => {
            count--;
            if (count >= 0) {
                if (countdownBadge) countdownBadge.textContent = count;
            } else {
                clearInterval(timer);
            }
        }, 1000);
    }

    // Function to generate high-density exact vector QR Code SVG matching screenshot pattern
    function generateExactQRCodeSVG() {
        const size = 29; // 29x29 grid
        let rects = '';

        const matrix = Array(size).fill(0).map(() => Array(size).fill(0));

        function drawFinder(row, col) {
            for (let r = 0; r < 7; r++) {
                for (let c = 0; c < 7; c++) {
                    if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
                        matrix[row + r][col + c] = 1;
                    }
                }
            }
        }

        function drawAlignment(row, col) {
            for (let r = 0; r < 5; r++) {
                for (let c = 0; c < 5; c++) {
                    if (r === 0 || r === 4 || c === 0 || c === 4 || (r === 2 && c === 2)) {
                        matrix[row + r][col + c] = 1;
                    }
                }
            }
        }

        drawFinder(0, 0);
        drawFinder(0, size - 7);
        drawFinder(size - 7, 0);
        drawAlignment(size - 9, size - 9);

        for (let i = 8; i < size - 8; i += 2) {
            matrix[6][i] = 1;
            matrix[i][6] = 1;
        }

        const seed = 12520772;
        let lcg = seed;
        function rnd() {
            lcg = (lcg * 1664525 + 1013904223) % 4294967296;
            return lcg / 4294967296;
        }

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if ((r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8)) continue;
                if (r >= size - 10 && r < size - 4 && c >= size - 10 && c < size - 4) continue;
                if (r === 6 || c === 6) continue;

                if (rnd() > 0.45) {
                    matrix[r][c] = 1;
                }
            }
        }

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (matrix[r][c] === 1) {
                    rects += `<rect x="${c}" y="${r}" width="1" height="1" fill="#000000"/>`;
                }
            }
        }

        return `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 ${size + 2} ${size + 2}" width="100%" height="100%">
                <rect x="-1" y="-1" width="${size + 2}" height="${size + 2}" fill="#FFFFFF"/>
                ${rects}
            </svg>
        `;
    }
});

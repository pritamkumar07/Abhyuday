// Mess Coupon Interactive Features
document.addEventListener('DOMContentLoaded', () => {
    // Navigation Elements
    const mealHistoryTabBtn = document.getElementById('meal-history-btn');
    const backBtn = document.getElementById('back-btn');
    
    // View Containers
    const messCouponView = document.getElementById('mess-coupon-view');
    const mealHistoryView = document.getElementById('meal-history-view');
    const navTitle = document.getElementById('nav-title');

    // Controls
    const editBtn = document.getElementById('edit-details-btn');
    const frameToggleBtn = document.getElementById('frame-toggle-btn');
    const deviceContainer = document.querySelector('.device-container');
    const editModal = document.getElementById('edit-modal');
    const closeModal = document.getElementById('close-modal');
    const studentForm = document.getElementById('student-form');
    const toast = document.getElementById('toast');

    // QR Modal Elements
    const qrModal = document.getElementById('qr-modal');
    const qrCloseBtn = document.getElementById('qr-close-btn');
    const qrMealTitle = document.getElementById('qr-meal-title');
    const qrTokenId = document.getElementById('qr-token-id');
    const mealCards = document.querySelectorAll('.meal-coupon-card');

    // Handle Meal Coupon QR Popup
    mealCards.forEach(card => {
        card.addEventListener('click', () => {
            const mealName = card.getAttribute('data-meal');
            const randomToken = Math.floor(10000 + Math.random() * 90000);
            qrMealTitle.textContent = `${mealName} Coupon`;
            qrTokenId.textContent = `TOKEN #MC-${randomToken}`;
            qrModal.classList.add('open');
            showToast(`Opening ${mealName} Coupon`);
        });
    });

    if (qrCloseBtn) {
        qrCloseBtn.addEventListener('click', () => {
            qrModal.classList.remove('open');
        });
    }

    if (qrModal) {
        qrModal.addEventListener('click', (e) => {
            if (e.target === qrModal) {
                qrModal.classList.remove('open');
            }
        });
    }

    // Tab Switching: Meal History
    function showMealHistory() {
        messCouponView.style.display = 'none';
        mealHistoryView.classList.add('active');
        navTitle.textContent = 'Meal History';
        showToast('Viewing Meal History');
    }

    // Tab Switching: Mess Coupon
    function showMessCoupon() {
        mealHistoryView.classList.remove('active');
        messCouponView.style.display = 'block';
        navTitle.textContent = 'Mess Coupon';
        showToast('Viewing Mess Coupon');
    }

    if (mealHistoryTabBtn) {
        mealHistoryTabBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showMealHistory();
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showMessCoupon();
        });
    }

    // Toggle Device Frame (iPhone mockup vs full width)
    if (frameToggleBtn) {
        frameToggleBtn.addEventListener('click', () => {
            deviceContainer.classList.toggle('full-width');
            const isFull = deviceContainer.classList.contains('full-width');
            frameToggleBtn.classList.toggle('active', isFull);
            showToast(isFull ? 'Expanded View' : 'iPhone Mockup View');
        });
    }

    // Open & Close Edit Modal
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            editModal.classList.add('open');
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            editModal.classList.remove('open');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            editModal.classList.remove('open');
        }
    });

    // Handle Form Submit to Update Fields in Real-Time
    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('inp-name').value;
            const regId = document.getElementById('inp-regid').value;
            const father = document.getElementById('inp-father').value;
            const mother = document.getElementById('inp-mother').value;
            const program = document.getElementById('inp-program').value;
            const hostel = document.getElementById('inp-hostel').value;

            document.getElementById('val-name-id').textContent = `${name} ${regId}`;
            document.getElementById('val-father').textContent = father;
            document.getElementById('val-mother').textContent = mother;
            document.getElementById('val-program').textContent = program;
            document.getElementById('val-hostel').textContent = hostel;

            editModal.classList.remove('open');
            showToast('Student Details Updated Successfully');
        });
    }

    // Helper: Toast Message
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    }
});

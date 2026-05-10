document.addEventListener("DOMContentLoaded", () => {
    // Mobile and tablet sidebar
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');

    function setSidebarOpen(isOpen) {
        document.body.classList.toggle('sidebar-open', isOpen);
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            const icon = menuToggle.querySelector('i');
            if (icon) icon.className = isOpen ? 'ph ph-x' : 'ph ph-list';
        }
    }

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            setSidebarOpen(!document.body.classList.contains('sidebar-open'));
        });

        sidebar.querySelectorAll('.nav-item').forEach((item) => {
            item.addEventListener('click', () => {
                if (window.matchMedia('(max-width: 1024px)').matches) {
                    setSidebarOpen(false);
                }
            });
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => setSidebarOpen(false));
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', () => setSidebarOpen(false));
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setSidebarOpen(false);
        }
    });

    window.addEventListener('resize', () => {
        if (!window.matchMedia('(max-width: 1024px)').matches) {
            setSidebarOpen(false);
        }
    });

    // Theme Toggling
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = document.body.classList.contains('dark') ? 'ph ph-sun' : 'ph ph-moon';
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('dark')) {
                icon.className = 'ph ph-sun';
            } else {
                icon.className = 'ph ph-moon';
            }
            // Add a small delay for CSS custom properties to update
            setTimeout(updateCharts, 50);
        });
    }

    // Right Panel Toggling
    const profileToggle = document.getElementById('profile-toggle');
    const profileClose = document.getElementById('profile-close');
    const rightPanel = document.querySelector('.right-panel');

    if (profileToggle && rightPanel) {
        profileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            rightPanel.classList.toggle('active');
            profileToggle.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (rightPanel.classList.contains('active') && !rightPanel.contains(e.target) && e.target !== profileToggle) {
                rightPanel.classList.remove('active');
                profileToggle.classList.remove('active');
            }
        });
    }

    if (profileClose && rightPanel) {
        profileClose.addEventListener('click', () => {
            rightPanel.classList.remove('active');
            if (profileToggle) profileToggle.classList.remove('active');
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && rightPanel) {
            rightPanel.classList.remove('active');
            if (profileToggle) profileToggle.classList.remove('active');
        }
    });

    function getCSSVar(name) {
        const val = getComputedStyle(document.body).getPropertyValue(name).trim();
        return val;
    }

    let activityChart, monthlyChart;

    function initCharts() {
        if (!window.Chart) return;

        const primary = getCSSVar('--primary') || '#D4E046';
        const warning = getCSSVar('--warning') || '#C85A42';
        const success = getCSSVar('--success') || '#A3B335';
        const gray = getCSSVar('--gray') || '#8B8E98';
        const gridColor = getCSSVar('--border-color') || '#4A4D57';
        const textColor = getCSSVar('--text-color') || '#E2E4E9';
        
        window.Chart.defaults.color = textColor;
        window.Chart.defaults.font.family = "'Inter', sans-serif";

        const actCtx = document.getElementById('activityChart');
        if (actCtx) {
            activityChart = new window.Chart(actCtx, {
                type: 'line',
                data: {
                    labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                    datasets: [{
                        label: 'Activity',
                        data: [1000, 2500, 1200, 3800, 3000],
                        borderColor: primary,
                        backgroundColor: primary + '20',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: primary,
                        pointBorderColor: document.body.classList.contains('dark') ? '#14151A' : '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { grid: { color: gridColor }, ticks: { color: gray } },
                        x: { grid: { display: false }, ticks: { color: gray } }
                    }
                }
            });
        }

        const monthCtx = document.getElementById('monthlyChart');
        if (monthCtx) {
            monthlyChart = new window.Chart(monthCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Income', 'Expense', 'Invested', 'Unexpected'],
                    datasets: [{
                        data: [36, 27, 20, 17],
                        backgroundColor: [success, warning, primary, gray],
                        borderWidth: 0,
                        cutout: '80%',
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }
    }

    function updateCharts() {
        if (activityChart) activityChart.destroy();
        if (monthlyChart) monthlyChart.destroy();
        initCharts();
    }

    setTimeout(initCharts, 200);
});

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('dark-mode-toggle');
    const toggleCheckbox = document.getElementById('dark-mode-checkbox');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (toggleCheckbox) toggleCheckbox.checked = true;
    } else if (!savedTheme && systemPrefersDark) {
        body.classList.add('dark-mode');
        if (toggleCheckbox) toggleCheckbox.checked = true;
    }

    updateIcon();

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateIcon();
        });
    }

    if (toggleCheckbox) {
        toggleCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
            updateIcon();
        });
    }

    function updateIcon() {
        if (!toggleButton) return;
        const isDark = body.classList.contains('dark-mode');
        if (isDark) {
            toggleButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            toggleButton.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    }
});
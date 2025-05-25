document.addEventListener('DOMContentLoaded', () => {
    const socketStatusSpan = document.getElementById('socketStatus');
    const powerToggle = document.getElementById('powerToggle');
    const powerStatusText = document.getElementById('powerStatusText');

    let isSocketOnline = true; 
    let isSocketPowered = true;

    function updateSocketStatusDisplay() {
        if (isSocketOnline) {
            socketStatusSpan.textContent = 'Онлайн';
            socketStatusSpan.classList.remove('status-offline');
            socketStatusSpan.classList.add('status-online');
        } else {
            socketStatusSpan.textContent = 'Офлайн';
            socketStatusSpan.classList.remove('status-online');
            socketStatusSpan.classList.add('status-offline');
        }
    }

    function updatePowerToggleDisplay() {
        powerToggle.checked = isSocketPowered;
        powerStatusText.textContent = isSocketPowered ? 'Увімкнено' : 'Вимкнено';
    }

    function loadInitialState() {
        isSocketOnline = true;
        isSocketPowered = true;
        updateSocketStatusDisplay();
        updatePowerToggleDisplay();

        const savedSchedules = JSON.parse(localStorage.getItem('socketSchedules')) || [];
        savedSchedules.forEach(schedule => addScheduleToDOM(schedule.startTime, schedule.endTime, schedule.days));
    }

    powerToggle.addEventListener('change', () => {
        if (!isSocketOnline) {
            alert('Розетка офлайн. Неможливо керувати живленням.');
            powerToggle.checked = !powerToggle.checked;
            return;
        }

        isSocketPowered = powerToggle.checked;
        updatePowerToggleDisplay();

        console.log(`Відправка команди: розетка ${isSocketPowered ? 'Увімкнено' : 'Вимкнено'}`);
    });

    function simulateApiCall(action, data) {
        console.log(`Імітація API: ${action} з даними:`, data);
        return new Promise(resolve => setTimeout(() => {
            console.log(`Імітація API: ${action} виконано.`);
            resolve();
        }, 500));
    }

    window.setSocketOnline = () => {
        isSocketOnline = true;
        updateSocketStatusDisplay();
        console.log("Розетка переведена в режим ОНЛАЙН (імітація).");
    };

    window.setSocketOffline = () => {
        isSocketOnline = false;
        updateSocketStatusDisplay();
        console.log("Розетка переведена в режим ОФЛАЙН (імітація).");
    };

    loadInitialState();
});
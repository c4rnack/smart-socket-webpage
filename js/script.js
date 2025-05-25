document.addEventListener('DOMContentLoaded', async () => {
    const socketStatusSpan = document.getElementById('socketStatus');
    const powerToggle = document.getElementById('powerToggle');
    const powerStatusText = document.getElementById('powerStatusText');

    const socketId = 1;

    let isSocketOnline = false;
    let isSocketPowered = false;

    async function getSocketInfo(socketId) {
        try {
            const response = await fetch(`https://smart-socket-api.onrender.com/info/${socketId}`);

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                return null;
            }

            const data = await response.json();
            console.log(data);
            return data;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }

    async function updateSocketInfo(socketId, isSocketPowered) {
        try {
            const response = await fetch('https://smart-socket-api.onrender.com/info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id: socketId, is_on: isSocketPowered}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                return null;
            }

            const data = await response.json();
            return data;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }

    function getIsSocketOnline(lastSeenString, thresholdMinutes = 1) {
        if (!lastSeenString) {
            return false;
        }
        try {
            const lastSeenDate = new Date(lastSeenString);
            const now = new Date();

            const differenceMs = now.getTime() - lastSeenDate.getTime();

            const thresholdMs = thresholdMinutes * 60 * 1000;

            return differenceMs <= thresholdMs;
        }
        catch (err) {
            console.log(err);
            return false
        }
    }

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
        updateSocketStatusDisplay();
        updatePowerToggleDisplay();
    }

    powerToggle.addEventListener('change', async () => {
        if (!isSocketOnline) {
            alert('Розетка офлайн. Неможливо керувати живленням.');
            powerToggle.checked = !powerToggle.checked;
            return;
        }

        isPowerToggleChecked = powerToggle.checked;
        const result = await updateSocketInfo(socketId, isPowerToggleChecked);

        if (result !== null) {
            isSocketPowered = isPowerToggleChecked;
        }
        else {
            powerToggle.checked = isSocketPowered;
        }
        updatePowerToggleDisplay();

        console.log(`Відправка команди: розетка ${isSocketPowered ? 'Увімкнено' : 'Вимкнено'}`);
    });

//------------------------------------------------------------------------------------------
    smartSocketInfo = await getSocketInfo(socketId);
    if (smartSocketInfo !== null) {
        isSocketPowered = smartSocketInfo.is_on;
        isSocketOnline = getIsSocketOnline(smartSocketInfo.last_seen);
    }

    loadInitialState();
});
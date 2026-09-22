// ==========================================
// LASER SECURITY SYSTEM - DASHBOARD
// ==========================================

// ---------- ELEMENTS ----------

const mainStatusBox = document.getElementById("mainStatusBox");
const mainStatus = document.getElementById("mainStatus");
const statusMessage = document.getElementById("statusMessage");

const laserStatus = document.getElementById("laserStatus");
const sensorStatus = document.getElementById("sensorStatus");
const buzzerStatus = document.getElementById("buzzerStatus");
const systemStatus = document.getElementById("systemStatus");

const eventNumber = document.getElementById("eventNumber");

const recentTitle = document.getElementById("recentTitle");
const recentDescription = document.getElementById("recentDescription");
const recentTime = document.getElementById("recentTime");
const recentEvent = document.getElementById("recentEvent");

const historyList = document.getElementById("historyList");


// ==========================================
// EVENT COUNTER
// ==========================================

let eventCount = 0;


// ==========================================
// GET CURRENT TIME
// ==========================================

function getTime() {

    const now = new Date();

    return now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}


// ==========================================
// ADD EVENT TO HISTORY
// ==========================================

function addHistory(message, status, isAlert = false) {

    eventCount++;

    // Update event number
    if (eventNumber) {
        eventNumber.textContent = eventCount;
    }

    const event = document.createElement("div");

    event.className = "history-item";

    if (isAlert) {
        event.classList.add("alert");
    }

    event.innerHTML = `
        <div class="history-number">
            #${eventCount}
        </div>

        <div class="history-content">
            <strong>${message}</strong>
            <span>${status}</span>
        </div>

        <div class="history-time">
            ${getTime()}
        </div>
    `;

    if (historyList) {

        // Newest event on top
        historyList.prepend(event);

        // Keep only latest 20 events
        while (historyList.children.length > 20) {
            historyList.removeChild(historyList.lastChild);
        }
    }
}


// ==========================================
// UPDATE RECENT EVENT
// ==========================================

function updateRecent(title, description, alert = false) {

    if (recentTitle) {
        recentTitle.textContent = title;
    }

    if (recentDescription) {
        recentDescription.textContent = description;
    }

    if (recentTime) {
        recentTime.textContent = getTime();
    }

    if (recentEvent) {

        if (alert) {
            recentEvent.classList.add("alert");
        } else {
            recentEvent.classList.remove("alert");
        }
    }
}


// ==========================================
// SECURE MODE
// ==========================================

function safeMode() {

    // Main status
    if (mainStatus) {
        mainStatus.textContent = "SYSTEM SECURE";
    }

    if (statusMessage) {
        statusMessage.textContent = "Laser beam detected. Area is secure.";
    }

    // Main box
    if (mainStatusBox) {
        mainStatusBox.classList.remove("danger");
        mainStatusBox.classList.add("secure");
    }

    // Status cards
    if (laserStatus) {
        laserStatus.textContent = "ACTIVE";
    }

    if (sensorStatus) {
        sensorStatus.textContent = "CLEAR";
    }

    if (buzzerStatus) {
        buzzerStatus.textContent = "OFF";
    }

    if (systemStatus) {
        systemStatus.textContent = "ONLINE";
    }

    // Recent event
    updateRecent(
        "SYSTEM SECURE",
        "Laser beam is active. No intrusion detected.",
        false
    );

    // History
    addHistory(
        "System Secure",
        "Laser beam detected",
        false
    );
}


// ==========================================
// INTRUSION MODE
// ==========================================

function intrusionMode() {

    // Main status
    if (mainStatus) {
        mainStatus.textContent = "INTRUSION DETECTED";
    }

    if (statusMessage) {
        statusMessage.textContent = "Laser beam interrupted! Security alert activated.";
    }

    // Main box
    if (mainStatusBox) {
        mainStatusBox.classList.remove("secure");
        mainStatusBox.classList.add("danger");
    }

    // Status cards
    if (laserStatus) {
        laserStatus.textContent = "INTERRUPTED";
    }

    if (sensorStatus) {
        sensorStatus.textContent = "ALERT";
    }

    if (buzzerStatus) {
        buzzerStatus.textContent = "ON";
    }

    if (systemStatus) {
        systemStatus.textContent = "ALERT";
    }

    // Recent event
    updateRecent(
        "INTRUSION DETECTED",
        "Laser beam interrupted. Security alarm activated.",
        true
    );

    // History
    addHistory(
        "Intrusion Detected",
        "Laser beam interrupted",
        true
    );
}


// ==========================================
// ADAFRUIT IO INTEGRATION
// ==========================================

const AIO_USERNAME = "PRAVEEN2704";

const FEED_URL =
    `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/laser-status/data?limit=1`;


// Last processed Adafruit IO event
let lastDataId = null;


// ==========================================
// READ ADAFRUIT IO
// ==========================================

async function readAdafruitStatus() {

    try {

        const response = await fetch(FEED_URL, {
            cache: "no-store"
        });

        if (!response.ok) {

            throw new Error(
                "HTTP Error: " + response.status
            );

        }

        const data = await response.json();

        // No data
        if (!data || data.length === 0) {
            console.log("No Adafruit IO data found.");
            return;
        }


        // Latest feed entry
        const latest = data[0];


        // Prevent duplicate event
        if (String(latest.id) === String(lastDataId)) {
            return;
        }


        // Save event ID
        lastDataId = latest.id;


        // Read value
        const status = String(latest.value)
            .trim()
            .toUpperCase();


        console.log(
            "Adafruit IO Status:",
            status
        );


        // ==================================
        // STATUS CHECK
        // ==================================

        if (status === "INTRUSION") {

            intrusionMode();

        }

        else if (status === "SECURE") {

            safeMode();

        }

        else {

            console.log(
                "Unknown status:",
                status
            );

        }


    }

    catch (error) {

        console.error(
            "Adafruit IO Error:",
            error
        );

    }
}


// ==========================================
// START ADAFRUIT IO MONITORING
// ==========================================

// Read immediately
readAdafruitStatus();


// Check every 3 seconds
setInterval(
    readAdafruitStatus,
    3000
);


// ==========================================
// INITIAL SYSTEM STATUS
// ==========================================

if (systemStatus) {
    systemStatus.textContent = "CONNECTING";
}

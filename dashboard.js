/* ================= ELEMENTS ================= */

const mainStatusBox =
    document.getElementById("mainStatusBox");

const mainStatus =
    document.getElementById("mainStatus");

const statusMessage =
    document.getElementById("statusMessage");

const laserStatus =
    document.getElementById("laserStatus");

const sensorStatus =
    document.getElementById("sensorStatus");

const buzzerStatus =
    document.getElementById("buzzerStatus");

const eventNumber =
    document.getElementById("eventNumber");

const recentTitle =
    document.getElementById("recentTitle");

const recentDescription =
    document.getElementById("recentDescription");

const recentTime =
    document.getElementById("recentTime");

const recentEvent =
    document.getElementById("recentEvent");

const historyList =
    document.getElementById("historyList");


/* ================= EVENT COUNTER ================= */

let eventCount = 0;


/* ================= TIME ================= */

function getTime() {

    const now = new Date();

    return now.toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit",

        second: "2-digit"

    });

}


/* ================= ADD HISTORY ================= */

function addHistory(message, status, isAlert = false) {

    eventCount++;

    eventNumber.textContent = eventCount;


    const row =
        document.createElement("div");

    row.className = "history-row";


    row.innerHTML = `

        <span class="history-number">
            #${eventCount}
        </span>

        <span class="history-time">
            ${getTime()}
        </span>

        <span class="history-message">
            ${message}
        </span>

        <span class="history-status ${isAlert ? "alert" : ""}">
            ${status}
        </span>

    `;


    historyList.prepend(row);


    /*
       Keep only latest 15 events
       so page doesn't become too heavy.
    */

    if (historyList.children.length > 15) {

        historyList.removeChild(
            historyList.lastElementChild
        );

    }

}


/* ================= UPDATE RECENT EVENT ================= */

function updateRecent(title, description, alert = false) {

    recentTitle.textContent = title;

    recentDescription.textContent = description;

    recentTime.textContent = getTime();


    recentEvent.classList.remove("new-event");

    void recentEvent.offsetWidth;

    recentEvent.classList.add("new-event");


    const dot =
        document.querySelector(".event-status-dot");


    if (alert) {

        dot.style.background = "#ff416c";

        dot.style.boxShadow =
            "0 0 10px #ff416c, 0 0 25px #ff416c";

        recentEvent.style.borderLeftColor =
            "#ff416c";

    } else {

        dot.style.background = "#00ffae";

        dot.style.boxShadow =
            "0 0 10px #00ffae, 0 0 25px #00ffae";

        recentEvent.style.borderLeftColor =
            "#00ffae";

    }

}


/* ================= SAFE MODE ================= */

function safeMode() {

    mainStatusBox.classList.remove("danger");

    mainStatusBox.classList.add("safe");


    mainStatus.textContent =
        "SYSTEM SECURE";


    statusMessage.textContent =
        "No intrusion detected";


    laserStatus.textContent =
        "ACTIVE";

    laserStatus.style.color =
        "#00ffae";


    sensorStatus.textContent =
        "NORMAL";

    sensorStatus.style.color =
        "#00ffae";


    buzzerStatus.textContent =
        "OFF";

    buzzerStatus.style.color =
        "#ffffff";


    updateRecent(
        "System secure",
        "Laser beam and sensors operating normally",
        false
    );


    addHistory(
        "Security system normal",
        "✓ SAFE",
        false
    );

}


/* ================= INTRUSION MODE ================= */

function intrusionMode() {

    mainStatusBox.classList.remove("safe");

    mainStatusBox.classList.add("danger");


    mainStatus.textContent =
        "INTRUSION DETECTED";


    statusMessage.textContent =
        "Laser beam interruption detected";


    laserStatus.textContent =
        "INTERRUPTED";

    laserStatus.style.color =
        "#ff416c";


    sensorStatus.textContent =
        "ALERT";

    sensorStatus.style.color =
        "#ff416c";


    buzzerStatus.textContent =
        "ON";

    buzzerStatus.style.color =
        "#ff416c";


    updateRecent(
        "⚠ Intrusion detected",
        "Laser beam interruption detected",
        true
    );


    addHistory(
        "Laser beam interrupted",
        "⚠ ALERT",
        true
    );

}


/* ================= INITIAL EVENT ================= */

setTimeout(() => {

    addHistory(
        "Security system initialized",
        "✓ ONLINE",
        false
    );

}, 500);


/* ================= AUTOMATIC EVENT SYSTEM ================= */

/*
    DEMO MODE

    Every 5 seconds a new event occurs.

    Event #1
    Event #2
    Event #3
    Event #4
    ...

    Every 4th event is an intrusion
    for demonstration.
*/

let demoEvent = 0;


setInterval(() => {

    demoEvent++;


    if (demoEvent % 4 === 0) {

        intrusionMode();

    }

    else {

        safeMode();

    }

}, 5000);
document.addEventListener("DOMContentLoaded", async function () {
    await fetchFlightData();  // โหลดข้อมูลจาก Google Sheet
    initMap();  // แสดงแผนที่
    setupAircraftListToggle(); // ตั้งค่าปุ่มแสดง/ซ่อนลิสต์
    const toggleListBtn = document.getElementById("toggleListBtn");
    const aircraftList = document.getElementById("aircraftList");

    toggleListBtn.addEventListener("click", () => {
        if (aircraftList.style.display === "none") {
            aircraftList.style.display = "block";  // แสดงรายการ
            toggleListBtn.textContent = "▲ ปิดรายการเครื่องบิน";  // เปลี่ยนข้อความปุ่ม
        } else {
            aircraftList.style.display = "none";  // ซ่อนรายการ
            toggleListBtn.textContent = "▼ เปิดรายการเครื่องบิน";  // เปลี่ยนข้อความปุ่ม
        }
    });
});

const provinceCoordinates = {
    "เชียงใหม่": [18.7883, 98.9853],
    "กรุงเทพ": [13.7367, 100.5231],
    "ขอนแก่น": [16.4322, 102.8236],
    "ภูเก็ต": [7.8804, 98.3923],
    "อุบลราชธานี": [15.2442, 104.8473],
    "อำนาจเจริญ": [15.8692, 104.6513],
    "อุดรธานี": [17.4138, 102.7914],
    "กาญจนบุรี": [14.0039, 99.5501],
    "นครสวรรค์": [15.7112, 100.1153],
    "กระบี่": [8.0857, 98.9063],
    "นครนายก": [14.0859, 101.2311],
    "นครปฐม": [13.8198, 100.0401],
    "นครราชสีมา": [14.9700, 102.0951],
    "นนทบุรี": [13.9074, 100.5211],
    "นราธิวาส": [6.4281, 101.8214],
    "น่าน": [18.7734, 100.7754],
    "บึงกาฬ": [18.4462, 103.0605],
    "บุรีรัมย์": [14.5381, 103.0964],
    
    "คลองหลวง": [14.119651846368596, 100.62024770985914], 
    "ปทุมธานี": [14.0011, 100.5159],
    "ประจวบคีรีขันธ์": [11.8010, 99.7961],
    "ปราจีนบุรี": [13.9385, 101.4190],
    "พะเยา": [19.1510, 99.9175],
    "พังงา": [8.4225, 98.4878],
    "พัทลุง": [7.6164, 100.0772],
    "พิษณุโลก": [16.8265, 100.2642],
    "เพชรบูรณ์": [16.4537, 101.1859],
    "แพร่": [18.1513, 100.1695],
    "ภาคใต้": [7.3162, 99.9000],
    "มหาสารคาม": [15.3836, 103.2956],
    "มุกดาหาร": [16.5400, 104.7107],
    "แม่ฮ่องสอน": [19.3033, 97.9825],
    "ลำพูน": [18.5785, 98.5314],
    "ลำปาง": [18.2923, 99.5082],
    "เลย": [17.4865, 101.7353],
    "ศรีสะเกษ": [15.1228, 104.3245],
    "สกลนคร": [17.1597, 104.1454],
    "สงขลา": [7.1735, 100.5960],
    "สมุทรปราการ": [13.6043, 100.6010],
    "สมุทรสาคร": [13.5659, 100.2833],
    "สระแก้ว": [13.8251, 102.0691],
    "สระบุรี": [14.5313, 100.8839],
    "สุโขทัย": [17.0003, 99.8190],
    "สุพรรณบุรี": [14.4696, 100.1135],
    "สุราษฎร์ธานี": [9.1406, 99.3258],
    "สุรินทร์": [14.8666, 103.4899],
    "หนองคาย": [17.8707, 102.7415],
    "หนองบัวลำภู": [17.2137, 102.4067],
    "เชียงราย": [19.9124, 99.8223],
    "เพชรบุรี": [12.9687, 99.9573],
    "ระนอง": [9.9385, 98.6293],
    "ราชบุรี": [13.5427, 99.8151],
    "ลพบุรี": [14.8027, 100.6116],
    "สตูล": [7.6014, 99.9786],
    "สมุทรสงคราม": [13.4149, 99.9803]
};

const aircraftImages = {
    "SKA-350": "https://www.royalrain.go.th/royalrain/IMG/content/archive/1_SuperKingAir350(SKA350).jpg",
    "CN-235": "https://www.royalrain.go.th/royalrain/IMG/content/archive/2_CN_235-220.jpg",
    "NC 212I": "https://www.royalrain.go.th/royalrain/IMG/content/archive/3_Casa_C212_NC212i.jpg",
    "CASA-400": "https://www.royalrain.go.th/royalrain/IMG/content/archive/3_Casa_C212_NC212i.jpg",
    "CASA-300": "https://www.royalrain.go.th/royalrain/IMG/content/archive/3_Casa_C212_NC212i.jpg",
    "CASA-200": "https://www.royalrain.go.th/royalrain/IMG/content/archive/3_Casa_C212_NC212i.jpg",
    "CARAVAN": "https://www.royalrain.go.th/royalrain/IMG/content/archive/4_Grand_Caravan_Caravan_Cessna_C%E0%B9%92%E0%B9%90%E0%B9%98B.jpg",
    "BELL 412EP": "https://www.royalrain.go.th/royalrain/IMG/content/archive/5_BELL_412EP.jpg",
    "BELL 407GXP": "https://www.royalrain.go.th/royalrain/IMG/content/archive/6_BELL_%E0%B9%94%E0%B9%90%E0%B9%97.jpg",
    "BELL 407": "https://www.royalrain.go.th/royalrain/IMG/content/archive/6_BELL_%E0%B9%94%E0%B9%90%E0%B9%97.jpg",
    "AS350B2": "https://www.royalrain.go.th/royalrain/IMG/content/archive/7_AS%20350_B2_ECUREUIL%20.jpg",
    "BELL 206B": "https://www.royalrain.go.th/royalrain/IMG/content/archive/8_BELL_%E0%B9%92%E0%B9%90%E0%B9%96B.jpg",
    "H130T2": "https://it.royalrain.go.th/aircraft_services/uploads/aircraft/60a15b7d97a3c9e82ff3b1fb89bc49e5.png"
};


// ฟังก์ชันที่ใช้ตัด :00 ออกจากข้อมูล
function formatTime(timeString) {
    if (timeString && timeString.includes(":00")) {
        return timeString.slice(0, -3);
    }
    return timeString;
}

function generateAircraftList() {
    const listContainer = document.getElementById('aircraftList');
    listContainer.innerHTML = ""; // ล้างข้อมูลเก่า

    flightData.forEach(flight => {
        const listItem = document.createElement('li');
        listItem.classList.add("aircraft-item");

        // กำหนด emoji และสีตามสถานะของเครื่องบิน
        const statusIcon = flight.status === "yes" ? "✔" : "✖";
        const statusColor = flight.status === "yes" ? "green" : "red";

        // ใส่ emoji ข้างหน้าและชื่อเครื่องบิน
        listItem.innerHTML = `
            <span class="status-icon ${statusColor}">${statusIcon}</span>
            ${flight.name} (${flight.aircraftNumber})
        `;

        // เพิ่มเหตุการณ์คลิกเพื่ออัปเดตข้อมูลและแสดงแผนที่
        listItem.addEventListener("click", () => {
            updateSidebar(flight);
            map.setView([flight.latitude, flight.longitude], 8);
        });

        // เพิ่มรายการเครื่องบินในลิสต์
        listContainer.appendChild(listItem);
    });
}



async function fetchFlightData() {
    const sheetID = "1_M74Pe_4uul0fkcEea8AMxQIMcPznNZ9ttCqvbeQgBs";
    const aircraftSheetGID = "0";
    const helicopterSheetGID = "1621250589";
    
    const aircraftURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&gid=${aircraftSheetGID}`;
    const helicopterURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&gid=${helicopterSheetGID}`;

    try {
        console.log("📡 กำลังโหลดข้อมูลเครื่องบิน...");
        const aircraftResponse = await fetch(aircraftURL);
        const aircraftText = await aircraftResponse.text();
        const aircraftJson = JSON.parse(aircraftText.substring(47, aircraftText.length - 2));
        
        console.log("📡 กำลังโหลดข้อมูลเฮลิคอปเตอร์...");
        const helicopterResponse = await fetch(helicopterURL);
        const helicopterText = await helicopterResponse.text();
        const helicopterJson = JSON.parse(helicopterText.substring(47, helicopterText.length - 2));

        flightData.length = 0;

        function processSheetData(rows, type) {
            rows.forEach(row => {
                let missionBase = (type === "helicopter" ? (row.c[10]?.v || "").toString() : (row.c[9]?.v || "").toString());
                let maintenanceManager = (type === "helicopter" ? (row.c[11]?.v || "").toString() : (row.c[10]?.v || "").toString());
                let note = (type === "helicopter" ? (row.c[12]?.v || "").toString() : (row.c[11]?.v || "").toString());

                let province = extractProvince(missionBase);
                let coordinates = provinceCoordinates[province] || [13.7367, 100.5231];
                let jitteredCoordinates = addJitter(coordinates);

                let status = (row.c[3]?.v || "").toString();  // ใช้คอลัมน์ D สำหรับสถานะ

                // ตรวจสอบสถานะไม่ใช่ "วันนี้" และประเภทเป็น "aircraft" หรือ "helicopter"
                if (status !== "วันนี้") {
                    let remainingHours = formatTime(row.c[4]?.v || ""); // ชั่วโมงบินคงเหลือ
                    let engineLH = (type === "helicopter" ? formatTime(row.c[5]?.v || "") : formatTime(row.c[7]?.v || ""));
                    let engineRH = (type === "helicopter" ? formatTime(row.c[6]?.v || "") : formatTime(row.c[8]?.v || ""));

                    let aCheck = type === "helicopter" ? getValidACheck(row) : formatTime(row.c[6]?.v || ""); // สำหรับเฮลิคอปเตอร์จะดูคอลัมน์ H, I, J

                    // สร้างข้อมูลสำหรับการแสดงผล
                    let flight = {
                        id: (row.c[2]?.v || "").toString(),
                        name: (row.c[1]?.v || "").toString(),
                        aircraftNumber: (row.c[2]?.v || "").toString(),
                        status: status,
                        remainingHours: remainingHours,
                        engineLH: engineLH,
                        engineRH: engineRH,
                        missionBase: missionBase,
                        maintenanceManager: maintenanceManager,
                        note: note,
                        aCheck: aCheck, // แสดงครบซ่อม A Check
                        latitude: jitteredCoordinates[0],
                        longitude: jitteredCoordinates[1],
                        type: type  // แยกประเภทเครื่องบินและเฮลิคอปเตอร์
                    };

                    flightData.push(flight);
                }
            });
        }

        // ฟังก์ชันสำหรับการตรวจสอบค่าที่มีความหมายจากคอลัมน์ H, I, J (เฉพาะเฮลิคอปเตอร์)
        function getValidACheck(row) {
            // ค้นหาค่าที่เป็นตัวเลขจากคอลัมน์ H (7), I (8), J (9)
            for (let col = 7; col <= 9; col++) {
                let value = row.c[col]?.v;
                // ตรวจสอบว่า value เป็นตัวเลขและไม่ใช่ "-" หรือ "_"
                if (value && !isNaN(parseFloat(value)) && value !== '-' && value !== '_') {
                    // แปลงค่าที่ได้เป็นชั่วโมง:นาที เช่น 100 -> "100:00"
                    return convertToTimeFormat(value);
                }
            }
            return 'N/A'; // ถ้าไม่พบค่าที่เป็นตัวเลข
        }

        // ฟังก์ชันแปลงค่าที่ได้รับเป็นฟอร์แมต "xx:xx" โดยไม่คำนวณ
        function convertToTimeFormat(value) {
            // แปลงตัวเลขเป็นชั่วโมง:นาที
            let timeValue = value.toString();
            if (timeValue.includes(':')) {
                // ถ้ามีการใช้ ":", จะตัดแค่ส่วนที่เป็นชั่วโมงและนาที
                return timeValue.split(':').slice(0, 2).join(':');
            }
            return timeValue; // ถ้าไม่มี ":", แสดงค่าเดิม
        }

        processSheetData(aircraftJson.table.rows, "aircraft");
        processSheetData(helicopterJson.table.rows, "helicopter");

        console.log("✅ ข้อมูลอัปเดตแล้ว:", flightData);
        generateAircraftList();
    } catch (error) {
        console.error("❌ โหลดข้อมูลไม่สำเร็จ:", error);
    }
}



function formatHours(value) {
    if (!value) return "N/A";
    return value.replace(/:00$/, "");
}

function extractProvince(text) {
    for (let province in provinceCoordinates) {
        if (text.includes(province)) {
            return province;
        }
    }
    return "นครสวรรค์";
}

function addJitter([lat, lng]) {
    let jitterLat = (Math.random() - 0.5) * 0.01;
    let jitterLng = (Math.random() - 0.5) * 0.01;
    return [lat + jitterLat, lng + jitterLng];
}

let map;
function initMap() {
    map = L.map('map').setView([13.7367, 100.5231], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    flightData.forEach(flight => {
        // ตรวจสอบว่าเป็นเฮลิคอปเตอร์หรือไม่ (ใช้ flight.type ที่ตั้งจากฟังก์ชัน fetchFlightData)
        const isHelicopter = flight.type === "helicopter"; // แก้เป็น flight.type

        // ตั้งค่า drop-shadow ตามสถานะ
        const shadowColor = flight.status.toUpperCase() === "YES" 
            ? "rgb(4, 172, 54)"  // เขียว
            : "rgba(255, 0, 0, 1)";  // แดง

        // เลือกไอคอนตามประเภทของยานพาหนะ
        const iconUrl = isHelicopter
            ? "helicopter.svg" // เฮลิคอปเตอร์
            : "airplane.svg"; // เครื่องบิน

        const vehicleIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: isHelicopter ? [34, 34] : [34, 34], // ปรับขนาดเฮลิคอปเตอร์ให้ใหญ่ขึ้นนิดหน่อย
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        var marker = L.marker([flight.latitude, flight.longitude], { icon: vehicleIcon })
            .addTo(map)
            .bindTooltip(`${flight.aircraftNumber}`, { permanent: false, direction: "top" })
            .on('click', function () {
                updateSidebar(flight);
            });

        // ปรับเอฟเฟกต์เงา
        marker._icon.style.filter = `brightness(1) drop-shadow(0 0 0.5px ${shadowColor}) drop-shadow(0 0 0.5px ${shadowColor})`;
    });
}







async function updateSidebar(flight) {
    const aircraftKey = flight.name.trim().toUpperCase();
    const aircraftImage = aircraftImages[aircraftKey] || "https://via.placeholder.com/320x180?text=No+Image";

    let maxHours = 150;  // ค่าพื้นฐานสำหรับเครื่องบินทั่วไป
    if (flight.name.toUpperCase() === "CARAVAN" ) {
        maxHours = 100;  // สำหรับ CARAVAN และ SKA350 ใช้ 100 ชั่วโมง
    }
    if (flight.name.toUpperCase() === "CN-235" || flight.name.toUpperCase() === "SKA350") {
        maxHours = 200;  // สำหรับ CN-235 ใช้ 200 ชั่วโมง
    }

    // เช็คหากเป็นเฮลิคอปเตอร์และปรับ maxHours
    if (flight.type === 'helicopter') {
        // ใช้ฟังก์ชัน getValidACheck เพื่อคำนวณ maxHours สำหรับเฮลิคอปเตอร์
        let column = await HgetValidACheck(flight.aircraftNumber);  // ใช้ฟังก์ชันนี้เพื่อตรวจสอบค่าในคอลัมน์ H, I, J
        console.log("✅ maxHours from Google Sheets:", column);

        // ตรวจสอบค่าที่ได้จากคอลัมน์และกำหนด maxHours ตามลำดับ
        if (column === 7) {  // ถ้าเจอคอลัมน์ H (7)
            maxHours = 100;   // กำหนดให้ maxHours = 100
        } else if (column === 8) {  // ถ้าเจอคอลัมน์ I (8)
            maxHours = 150;   // กำหนดให้ maxHours = 150
        } else if (column === 9) {  // ถ้าเจอคอลัมน์ J (9)
            maxHours = 300;   // กำหนดให้ maxHours = 300
        }
    }
    console.log("✅ maxHours:", maxHours);
    const remainingAcheck = parseFloat(flight.aCheck) || 0;
    let aCheckPercentage = ((maxHours - remainingAcheck) / maxHours) * 100; // คำนวณเปอร์เซ็นต์

    // ถ้าเปอร์เซ็นต์ติดลบ ให้ตั้งเป็น 0%
    if (aCheckPercentage < 0) {
        aCheckPercentage = 0;
    }

    // ตรวจสอบไม่ให้เปอร์เซ็นต์เกิน 100
    if (aCheckPercentage > 100) {
        aCheckPercentage = 100;
    }

    // ปรับขนาดหลอดให้เหมาะสม
    const barWidth = 100; // กำหนดความยาวหลอดให้พอดี

    // กำหนดสีของหลอดตามเปอร์เซ็นต์
    let barColor = '#28a745';  // สีเขียว (ดี)
    if (aCheckPercentage > 70) {
        barColor = '#dc3545';  // สีแดง (แย่)
    }

    document.getElementById('sidebar-content').innerHTML = `
        <button class="close-btn" onclick="closeSidebar()">✖</button>
        <div class="status-bar" style="background: ${flight.status.toLowerCase() === "yes" ? "#28a745" : "#dc3545"};">
            <span class="status-text">${flight.status.toLowerCase() === "yes" ? "ใช้งานได้" : "ไม่สามารถใช้งาน"}</span>
        </div>


        <h2 class="popup-title">${flight.name} (${flight.aircraftNumber})</h2>
        <img src="${aircraftImage}" alt="${flight.name}" class="airplane-image">
        
        <p><strong>ชั่วโมงบิน:</strong> ${flight.remainingHours} ชม.</p>

        <h3>⚙ เครื่องยนต์</h3>
        <p><strong>No.1 / LH:</strong> ${flight.engineLH} ชม.</p>
        <p><strong>No.2 / RH:</strong> ${flight.engineRH} ชม.</p>

        <h3>🔧 ข้อมูลซ่อมบำรุง</h3>
        <p><strong>ครบซ่อม:</strong> ${flight.aCheck} ชม. / ${maxHours} ชม. (${aCheckPercentage.toFixed(1)}%)</p>
        <div style="width: ${barWidth}%; background-color: #e0e0e0; border-radius: 5px; height: 10px; margin-top: 5px;">
            <div style="width: ${aCheckPercentage}%; background-color: ${barColor}; height: 100%; border-radius: 5px;"></div>
        </div>

        <h3>📍 สถานที่</h3>
        <p><strong>ภารกิจ/ฐานที่ตั้ง:</strong> ${flight.missionBase}</p>

        <h3>🛠 ผู้ควบคุมงานช่าง</h3>
        <p>${flight.maintenanceManager}</p>

        ${flight.note ? `<h3>📝 หมายเหตุ</h3><p>${flight.note}</p>` : ""}` 
    ;

    document.getElementById('sidebar').style.display = 'block';
}

async function HgetValidACheck(aircraftNumber) {
    const sheetID = "1_M74Pe_4uul0fkcEea8AMxQIMcPznNZ9ttCqvbeQgBs";  // ID ของชีตคุณ
    const helicopterSheetGID = "1621250589";  // GID ของแผ่นที่คุณต้องการดึงข้อมูล
    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&gid=${helicopterSheetGID}`;
    try {
        const response = await fetch(url);
        const text = await response.text();
        const json = JSON.parse(text.substring(47, text.length - 2));

    //console.log("Data from Google Sheets:", json.table.rows);  // ดูข้อมูลที่ได้รับจาก Google Sheets
        
        // ลูปค้นหาข้อมูลที่ตรงกับหมายเลขเครื่องบิน
        for (let row of json.table.rows) {
            const aircraft = row.c[2]?.v;  // สมมติว่าหมายเลขเครื่องบินอยู่ในคอลัมน์แรก

            console.log(`Checking row for aircraft: ${aircraft}`);  // log ค่าหมายเลขเครื่องบินในแถวที่กำลังตรวจสอบ

            if (aircraft && aircraft.toString().trim() === aircraftNumber.toString().trim()) {
                // ค้นหาคอลัมน์ H, I, J เพื่อนำ maxHours มาใช้
                for (let col = 7; col <= 9; col++) {
                    let value = row.c[col]?.v;
                    console.log(`Found maxHours in column ${col}: ${value}`);  // log ค่า maxHours ที่พบ    
                    if (value && value !== '-' && value !== '_') {
                        console.log(`Found maxHours in column ${col}: ${value}`);  // log ค่า maxHours ที่พบ
                        return col;  // คืนค่าที่พบในคอลัมน์ที่มีข้อมูล
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error fetching data from Google Sheets:", error);
    }
    
    return 150;  // หากไม่พบค่ากำหนดเป็นค่าเริ่มต้น
}













function getStatusGradient(status) {
    if (status === "yes") {
        return 'linear-gradient(135deg, #28a745, #218838)';
    } else if (status === "no") {
        return 'linear-gradient(135deg, #dc3545, #c82333)';
    }
    return 'linear-gradient(135deg, #dc3545, #c82333)';
}

function closeSidebar() {
    document.getElementById('sidebar').style.display = 'none';
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeSidebar();
    }
});

document.getElementById('searchBtn').addEventListener('click', function () {
    const searchValue = document.getElementById('searchBox').value.trim().toUpperCase();

    const flight = flightData.find(flight => flight.aircraftNumber.toUpperCase() === searchValue);

    if (flight) {
        updateSidebar(flight);
        map.setView([flight.latitude, flight.longitude], 8);
    } else {
        alert('ไม่พบเครื่องบินที่มีหมายเลขนี้');
    }
});


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('searchBtn').addEventListener('click', function () {
        const searchBox = document.getElementById('searchBox');
        if (searchBox) {
            const searchValue = searchBox.value.trim().toUpperCase();

            const flight = flightData.find(flight => flight.aircraftNumber.toUpperCase() === searchValue);

            if (flight) {
                updateSidebar(flight);
                map.setView([flight.latitude, flight.longitude], 8);
            } else {
                alert('ไม่พบเครื่องบินที่มีหมายเลขนี้');
            }
        } else {
            console.error('ไม่พบ input ที่มี id="searchBox"');
        }
    });
});


function setupAircraftListToggle() {
    const toggleListButton = document.getElementById("toggleList");
    const listContainer = document.getElementById("aircraftListContainer");

    if (toggleListButton && listContainer) {
        toggleListButton.addEventListener("click", function () {
            listContainer.style.display = (listContainer.style.display === "none" || listContainer.style.display === "") ? "block" : "none";
        });
   
    }
}

function generateAircraftList() {
    const listContainer = document.getElementById('aircraftList');
    listContainer.innerHTML = ""; // ล้างข้อมูลเก่า

    let availableCount = 0;
    let unavailableCount = 0;

    flightData.forEach(flight => {
        const listItem = document.createElement('li');
        listItem.classList.add("aircraft-item");

        // กำหนดสัญลักษณ์สถานะ (สีเขียว/แดง)
        const statusIcon = document.createElement('span');
        statusIcon.style.width = '10px';
        statusIcon.style.height = '10px';
        statusIcon.style.borderRadius = '50%';
        statusIcon.style.marginRight = '10px'; // เว้นระยะขอบ

        if (flight.status.toLowerCase() === "yes") {
            statusIcon.style.backgroundColor = 'green'; // ใช้ได้
            availableCount++;
        } else {
            statusIcon.style.backgroundColor = 'red'; // ใช้ไม่ได้
            unavailableCount++;
        }

        listItem.textContent = `${flight.name} (${flight.aircraftNumber})`;
        listItem.insertBefore(statusIcon, listItem.firstChild); // ใส่สัญลักษณ์ที่หน้าลิสต์

        listItem.addEventListener("click", () => {
            updateSidebar(flight);
            map.setView([flight.latitude, flight.longitude], 8);
        });

        listContainer.appendChild(listItem);
    });

    // แสดงจำนวนเครื่องบินที่ใช้งานได้และไม่ได้
    const statusSummary = document.getElementById('statusSummary');
    statusSummary.innerHTML = `
        <p>✔️ใช้งานได้: ${availableCount} </p>
        <p>❌ใช้งานไม่ได้: ${unavailableCount} </p>
    `;
}

const toggleListBtn = document.getElementById("toggleListBtn");
const aircraftList = document.getElementById("aircraftList");

toggleListBtn.addEventListener("click", () => {
    // เช็คสถานะของรายการ (เปิด/ปิด)
    if (aircraftList.style.display === "none") {
        aircraftList.style.display = "block";  // แสดงรายการ
        toggleListBtn.textContent = "▲ ปิดรายการเครื่องบิน";  // เปลี่ยนข้อความปุ่ม
    } else {
        aircraftList.style.display = "none";  // ซ่อนรายการ
        toggleListBtn.textContent = "▼ เปิดรายการเครื่องบิน";  // เปลี่ยนข้อความปุ่ม
    }
});



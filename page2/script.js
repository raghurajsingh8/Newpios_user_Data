// Add this at top of script.js or in <script> tag
document.addEventListener("DOMContentLoaded", () => {
  gsap.from(".container", {
    duration: 1.5,
    y: 30,
    opacity: 0,
    ease: "power3.out",
  });

  gsap.from("h1", {
    duration: 1,
    delay: 0.5,
    opacity: 0,
    y: -20,
  });

  gsap.from("select, input, button, label, h2, .go-back", {
    duration: 0.8,
    delay: 0.7,
    opacity: 0,
    y: 20,
    stagger: 0.1,
  });
});

let appliances = [];

// Automatically fill power input when an appliance is selected
function handleApplianceChange() {
    const applianceTypeElement = document.getElementById("appliance-type");
    const selectedOption = applianceTypeElement.options[applianceTypeElement.selectedIndex];

    // Show custom name input if "Other" is selected
    if (selectedOption.value === "Other") {
        document.getElementById("custom-appliance").style.display = "block";
        document.getElementById("power").value = "";
    } else {
        document.getElementById("custom-appliance").style.display = "none";
        document.getElementById("custom-appliance-name").value = "";
        document.getElementById("power").value = selectedOption.dataset.watt;
    }
}

function addAppliance() {
    const applianceTypeElement = document.getElementById("appliance-type");
    const selectedOption = applianceTypeElement.options[applianceTypeElement.selectedIndex];
    const applianceName = selectedOption.value === "Other" ? document.getElementById("custom-appliance-name").value : selectedOption.value;
    const power = parseFloat(document.getElementById("power").value);
    const quantity = parseInt(document.getElementById("quantity").value);
    const usage = parseFloat(document.getElementById("usage").value);
        const puc = parseInt(document.getElementById("puc").value);



    if (applianceName && power && quantity > 0 && usage >= 0) {
        appliances.push({ applianceName, power, quantity, usage });
        
        // Reset fields
        document.getElementById("quantity").value = "1";
        document.getElementById("usage").value = "";
        document.getElementById("custom-appliance-name").value = "";
        document.getElementById("power").value = "";

        displayAppliances();
    } else {
        alert("Please enter valid details for all fields.");
    }

    calculateBill();
}

function displayAppliances() {
    const applianceList = document.getElementById("appliance-list");
    applianceList.innerHTML = ""; // Clear the existing list before displaying updated list

    appliances.forEach((appliance, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${appliance.quantity} x ${appliance.applianceName} - ${appliance.power}W, ${appliance.usage} hrs/day 
                        <span class="delete" onclick="deleteAppliance(${index})">❌</span>`;
        applianceList.appendChild(li);
    });

}
function deleteAppliance(index) {
    // Remove the appliance from the array
    appliances.splice(index, 1);

    // Re-display the appliances
    displayAppliances();

    // Recalculate the bill after deleting the appliance
    calculateBill();
}


// function calculateBill() {
//      const ratePerKWh = parseFloat(document.getElementById("puc").value);  // Correctly retrieve the rate per kWh from the input field
//     if (isNaN(ratePerKWh) || ratePerKWh <= 0) {
//         alert("Please enter a valid Per Unit Cost.");
//         return;
//     }
//     // const ratePerKWh = puc;  // Rate per kWh in ₹
//     let totalDailyConsumption = 0;

//     appliances.forEach(appliance => {
//         const dailyConsumption = (appliance.power / 1000) * appliance.usage * appliance.quantity;
//         totalDailyConsumption += dailyConsumption;
//     });

//     const totalMonthlyConsumption = totalDailyConsumption * 30;
//     const monthlyBill = totalMonthlyConsumption * ratePerKWh;

//     document.getElementById("daily-consumption").innerText = `Total Daily Consumption: ${totalDailyConsumption.toFixed(2)} kWh`;
//     document.getElementById("monthly-consumption").innerText = `Total Monthly Consumption: ${totalMonthlyConsumption.toFixed(2)} kWh`;
//     document.getElementById("monthly-bill").innerText = `Approximate Monthly Bill: ₹${monthlyBill.toFixed(2)}`;
// }

function calculateSanctionedLoad(appliances, diversityFactor = 0.8, safetyMargin = 0.2) {
    let totalPower = 0;

    // Calculate the total connected load
    appliances.forEach(appliance => {
        totalPower += appliance.power * appliance.quantity; // Total power in watts
    });

    // Apply diversity factor
    let effectiveLoad = totalPower * diversityFactor;

    // Add safety margin
    let sanctionedLoad = effectiveLoad * (1 + safetyMargin);

    // Convert to kilowatts and return
    return sanctionedLoad / 1000; // Convert watts to kW
}

function calculateBill() {
    const ratePerKWh = parseFloat(document.getElementById("puc").value);

    if (isNaN(ratePerKWh) || ratePerKWh <= 0) {
        alert("Please enter a valid Per Unit Cost.");
        return;
    }

    let totalDailyConsumption = 0;

    // Calculate total daily consumption
    appliances.forEach(appliance => {
        const dailyConsumption = (appliance.power / 1000) * appliance.usage * appliance.quantity;
        totalDailyConsumption += dailyConsumption;
    });

    const totalMonthlyConsumption = totalDailyConsumption * 30; // 30 days in a month
    const monthlyBill = totalMonthlyConsumption * ratePerKWh;

    // Calculate sanctioned load
    const sanctionedLoad = calculateSanctionedLoad(appliances);

    // Display results
    document.getElementById("daily-consumption").innerText = `Total Daily Consumption: ${totalDailyConsumption.toFixed(2)} kWh`;
    document.getElementById("monthly-consumption").innerText = `Total Monthly Consumption: ${totalMonthlyConsumption.toFixed(2)} kWh`;
    document.getElementById("monthly-bill").innerText = `Approximate Monthly Bill: ₹${monthlyBill.toFixed(2)}`;
    document.getElementById("sanctioned-load").innerText = `Recommended Sanctioned Load: ${sanctionedLoad.toFixed(2)} kW`;
}
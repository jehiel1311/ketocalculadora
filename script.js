// -----------------------INDEX


function calcularMacros() {
    try {
        console.log("Calculando Macros...");
        const age = parseFloat(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const activityLevelSelect = document.getElementById('activity-level');
        const goalSelect = document.getElementById('goal');

        // Realizar cálculos según tus necesidades
        const tmb = 10 * weight + 6.25 * height - 5 * age + 5;
        const caloriesMin = tmb * parseFloat(activityLevelSelect.value);
        const caloriesMax = caloriesMin * 1.2; // Ajusta según tus preferencias
        let proteinMin = 1.6 * weight;  // Ajusta según tus preferencias
        let proteinMax = 2.2 * weight;  // Ajusta según tus preferencias
        let fatMin = (caloriesMin * 0.7) / 9;
        let fatMax = (caloriesMax * 0.75) / 9;

        // Rango sugerido para carbohidratos (ajustable según tus preferencias)
        const carbsMin = 20;  // Mínimo recomendado
        const carbsMax = 50;  // Máximo recomendado

        // Ajustar cantidades según el objetivo
        switch (goalSelect.value) {
            case 'lose':
                proteinMin -= 0.2 * weight;
                proteinMax -= 0.2 * weight;
                fatMin -= 0.2 * weight;
                fatMax -= 0.2 * weight;
                break;
            case 'gain':
                proteinMin += 0.2 * weight;
                proteinMax += 0.2 * weight;
                fatMin += 0.2 * weight;
                fatMax += 0.2 * weight;
                break;
            // case 'maintain':
            //   Puedes agregar ajustes específicos para 'maintain' si es necesario
            //   break;
            default:
                break;
        }

        // Determinar la descripción del nivel de actividad
        let activityDescription = "";
        switch (parseFloat(activityLevelSelect.value)) {
            case 1.2:
                activityDescription = "Sedentario (sin ejercicio)";
                break;
            case 1.375:
                activityDescription = "Ligero (1-3 horas de ejercicio por semana)";
                break;
            case 1.55:
                activityDescription = "Moderado (3-7 horas de ejercicio por semana)";
                break;
            case 1.725:
                activityDescription = "Elevado (más de 7 horas de ejercicio por semana)";
                break;
            default:
                activityDescription = "Nivel de actividad no especificado";
                break;
        }

        // Almacenar resultados en cookies
        document.cookie = `caloriesMin=${caloriesMin}`;
        document.cookie = `caloriesMax=${caloriesMax}`;
        document.cookie = `proteinMin=${proteinMin}`;
        document.cookie = `proteinMax=${proteinMax}`;
        document.cookie = `fatMin=${fatMin}`;
        document.cookie = `fatMax=${fatMax}`;
        document.cookie = `carbsMin=${carbsMin}`;
        document.cookie = `carbsMax=${carbsMax}`;
        document.cookie = `activityLevel=${activityLevelSelect.value}`;
        document.cookie = `goal=${goalSelect.value}`;
        document.cookie = `protein=${(proteinMin + proteinMax) / 2}`; // Almacena el promedio de proteínas como valor por defecto
        document.cookie = `carbs=${(carbsMin + carbsMax) / 2}`; // Almacena el promedio de carbohidratos como valor por defecto

        // Almacenar resultados en localStorage
        localStorage.setItem('caloriesMin', caloriesMin.toFixed(2));
        localStorage.setItem('caloriesMax', caloriesMax.toFixed(2));
        localStorage.setItem('proteinMin', proteinMin.toFixed(2));
        localStorage.setItem('proteinMax', proteinMax.toFixed(2));
        localStorage.setItem('fatMin', fatMin.toFixed(2));
        localStorage.setItem('fatMax', fatMax.toFixed(2));
        localStorage.setItem('carbsMin', carbsMin);
        localStorage.setItem('carbsMax', carbsMax);
        localStorage.setItem('activityLevel', activityLevelSelect.value);
        localStorage.setItem('goal', goalSelect.value);
        localStorage.setItem('protein', ((proteinMin + proteinMax) / 2).toFixed(2));
        localStorage.setItem('carbs', ((carbsMin + carbsMax) / 2).toFixed(2));

        // Mostrar los resultados en la sección de resultados
        const resultadosDiv = document.getElementById('resultados');

        // Función para manejar el valor NaN y asignar 0 en su lugar
        const handleNaN = (value) => (isNaN(value) ? 0 : value);

        resultadosDiv.innerHTML = `
            <h2>Resultados:</h2>
            <p><strong>Calorías diarias:</strong> ${handleNaN(caloriesMin.toFixed(2))} - ${handleNaN(caloriesMax.toFixed(2))} kcal</p>
            <p><strong>Proteínas (rango):</strong> ${handleNaN(proteinMin.toFixed(2))} - ${handleNaN(proteinMax.toFixed(2))} g</p>
            <p><strong>Grasas (rango):</strong> ${handleNaN(fatMin.toFixed(2))} - ${handleNaN(fatMax.toFixed(2))} g</p>
            <p><strong>Carbohidratos (rango):</strong> ${handleNaN(carbsMin)} - ${handleNaN(carbsMax)} g</p>
            <p><strong>Nivel de actividad:</strong> ${handleNaN(activityLevelSelect.value)} - ${activityDescription}</p>
            <p><strong>Objetivo:</strong> ${goalSelect.value}</p>
        `;

    } catch (error) {
        console.error("Error al calcular los resultados:", error);
    }
}




// Redirigir a index.html con los objetivos
function redirigirAIndex() {
    window.location.href = "calculo.html";
}





// -------------------------CALCULO-----------------------------------------




function establecerObjetivos() {
    const inputs = document.querySelectorAll('.editable-input');
    inputs.forEach(input => {
        input.setAttribute('readonly', true);
        input.style.border = 'none';
    });
}

function calculateFatPercentage(fats, calories) {
    return ((fats * 9) / calories) * 100; // Se asume que las grasas contribuyen con 9 calorías por gramo
}

function updateTotals(quantity, proteins, calories, carbs, fats) {
    const totalsElement = document.getElementById('totals');
    const goalMessageElement = document.getElementById('goal-message');

    const currentTotals = totalsElement.textContent.split(', ');
    const currentQuantity = parseFloat(currentTotals[0].split(' ')[1]);
    const currentProteins = parseFloat(currentTotals[1].split(' ')[0]);
    const currentCalories = parseFloat(currentTotals[2].split(' ')[0]);
    const currentCarbs = parseFloat(currentTotals[3].split(' ')[0]);
    const currentFats = parseFloat(currentTotals[4].split(' ')[0]);

    const newQuantity = currentQuantity + quantity;
    const newProteins = currentProteins + proteins;
    const newCalories = currentCalories + calories;
    const newCarbs = currentCarbs + carbs;
    const newFats = currentFats + fats;

    totalsElement.textContent = `Totales: ${newQuantity.toFixed(2)}g/ml de Cantidad, ${newProteins.toFixed(2)}g de Proteínas, ${newCalories.toFixed(2)} Calorías, ${newCarbs.toFixed(2)}g de Carbohidratos, ${newFats.toFixed(2)}g de Grasas`;

    updateRemainingGoals(quantity, proteins, calories, carbs, fats);
}

function addToSelected(button) {
    const row = button.parentNode.parentNode;
    const name = row.cells[0].textContent;
    const quantity = parseFloat(row.dataset.quantity);
    const proteins = parseFloat(row.dataset.proteins);
    const calories = parseFloat(row.dataset.calories);
    const carbs = parseFloat(row.dataset.carbs);
    const fats = parseFloat(row.dataset.fats);

    const selectedList = document.getElementById('selected-list');
    const existingItem = Array.from(selectedList.children).find(item => item.dataset.name === name);

    if (existingItem) {
        // Si el producto ya está en la lista, incrementamos la cantidad
        const currentQuantity = parseFloat(existingItem.dataset.quantity);
        existingItem.dataset.quantity = currentQuantity + quantity;
        existingItem.innerHTML = `${name} - ${existingItem.dataset.quantity}g/ml <button onclick="removeFromSelected(this, '${name}', ${existingItem.dataset.quantity}, ${proteins}, ${calories}, ${carbs}, ${fats})">X</button>`;
    } else {
        // Si el producto no está en la lista, lo agregamos como un nuevo elemento
        const newItem = document.createElement('li');
        newItem.dataset.name = name;
        newItem.dataset.quantity = quantity;
        newItem.dataset.proteins = proteins;
        newItem.dataset.calories = calories;
        newItem.dataset.carbs = carbs;
        newItem.dataset.fats = fats;
        newItem.innerHTML = `${name} - ${quantity}g/ml <button onclick="removeFromSelected(this, '${name}', ${quantity}, ${proteins}, ${calories}, ${carbs}, ${fats})">X</button>`;
        selectedList.appendChild(newItem);
    }

    updateTotals(quantity, proteins, calories, carbs, fats);
}

function removeFromSelected(button, name, quantity, proteins, calories, carbs, fats) {
    const listItem = button.parentNode;
    const selectedList = document.getElementById('selected-list');

    listItem.remove();
    updateTotals(-quantity, -proteins, -calories, -carbs, -fats);
}

function updateRemainingGoals(quantity, proteins, calories, carbs, fats) {
    const goalProteinsInput = document.getElementById('goal-proteins');
    const goalCaloriesInput = document.getElementById('goal-calories');
    const goalCarbsInput = document.getElementById('goal-carbs');
    const goalMessageElement = document.getElementById('goal-message');

    const currentProteins = parseFloat(goalProteinsInput.value) || 0;
    const currentCalories = parseFloat(goalCaloriesInput.value) || 0;
    const currentCarbs = parseFloat(goalCarbsInput.value) || 0;

    const remainingProteins = Math.max(currentProteins - proteins, 0);
    const remainingCalories = Math.max(currentCalories - calories, 0);
    const remainingCarbs = Math.max(currentCarbs - carbs, 0);

    goalProteinsInput.value = remainingProteins.toFixed(2);
    goalCaloriesInput.value = remainingCalories.toFixed(2);
    goalCarbsInput.value = remainingCarbs.toFixed(2);

    const fatPercentage = calculateFatPercentage(fats, calories);
    const nonFatPercentage = 100 - fatPercentage;

    goalMessageElement.textContent = `Objetivos restantes - Proteínas: ${remainingProteins.toFixed(2)}g, Calorías: ${remainingCalories.toFixed(2)}, Carbohidratos: ${remainingCarbs.toFixed(2)}g, Porcentaje de calorías de grasas: ${fatPercentage.toFixed(2)}%, Porcentaje de calorías del resto: ${nonFatPercentage.toFixed(2)}%`;
}

document.addEventListener('DOMContentLoaded', function () {
    const goalProteinsInput = document.getElementById('goal-proteins');
    const goalCaloriesInput = document.getElementById('goal-calories');
    const goalCarbsInput = document.getElementById('goal-carbs');

    // Leer cookies y actualizar objetivos en index.html
    const protein = parseFloat(getCookie('protein')) || 0;
    const caloriesMax = parseFloat(getCookie('caloriesMax')) || 0;
    const carbsMax = parseFloat(getCookie('carbsMax')) || 0;

    // Tomar el menor valor del rango como objetivo
    goalProteinsInput.value = protein;
    goalCaloriesInput.value = caloriesMax;
    goalCarbsInput.value = carbsMax;

    // Llamada a la función para calcular y mostrar los objetivos iniciales
    setGoals();
});

function setGoals() {
    const goalProteinsInput = document.getElementById('goal-proteins');
    const goalCaloriesInput = document.getElementById('goal-calories');
    const goalCarbsInput = document.getElementById('goal-carbs');
    const goalMessageElement = document.getElementById('goal-message');

    const goalProteins = parseFloat(goalProteinsInput.value) || 0;
    const goalCalories = parseFloat(goalCaloriesInput.value) || 0;
    const goalCarbs = parseFloat(goalCarbsInput.value) || 0;

    const currentGoals = goalMessageElement.textContent.match(/- Proteínas: (.*), Calorías: (.*), Carbohidratos: (.*)/);

    const remainingProteins = parseFloat(currentGoals[1]) || 0;
    const remainingCalories = parseFloat(currentGoals[2]) || 0;
    const remainingCarbs = parseFloat(currentGoals[3]) || 0;

    const currentTotals = getCurrentTotals();
    const fatPercentage = calculateFatPercentage(currentTotals.fats, currentTotals.calories);
    const nonFatPercentage = 100 - fatPercentage;

    goalMessageElement.textContent = `Objetivos restantes - Proteínas: ${remainingProteins.toFixed(2)}g, Calorías: ${remainingCalories.toFixed(2)}, Carbohidratos: ${remainingCarbs.toFixed(2)}g, Porcentaje de calorías de grasas: ${fatPercentage.toFixed(2)}%, Porcentaje de calorías del resto: ${nonFatPercentage.toFixed(2)}%`;
}

function getCurrentTotals() {
    const totalsElement = document.getElementById('totals');
    const currentTotals = totalsElement.textContent.match(/Cantidad, (.*), Proteínas, (.*), Calorías, (.*), Carbohidratos, (.*), Grasas, (.*)/);

    return {
        quantity: parseFloat(currentTotals[1]) || 0,
        proteins: parseFloat(currentTotals[2]) || 0,
        calories: parseFloat(currentTotals[3]) || 0,
        carbs: parseFloat(currentTotals[4]) || 0,
        fats: parseFloat(currentTotals[5]) || 0,
    };
}

// HABILITA BOTON EDITAR
function habilitarEdicion() {
    const inputs = document.querySelectorAll('.editable-input');
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.style.border = '1px solid #ccc';
    });
}

function resetCalculator() {
    const goalProteinsInput = document.getElementById('goal-proteins');
    const goalCaloriesInput = document.getElementById('goal-calories');
    const goalCarbsInput = document.getElementById('goal-carbs');
    const goalMessageElement = document.getElementById('goal-message');
    const totalsElement = document.getElementById('totals');
    const selectedList = document.getElementById('selected-list');

    // Restablecer valores de objetivos
    goalProteinsInput.value = 0;
    goalCaloriesInput.value = 0;
    goalCarbsInput.value = 0;

    // Restablecer mensaje de objetivos
    const fatPercentage = calculateFatPercentage(0, 0); // Pasar 0 grasas y calorías
    const nonFatPercentage = 100 - fatPercentage;
    goalMessageElement.textContent = `Objetivos restantes - Proteínas: 0g, Calorías: 0, Carbohidratos: 0g, Porcentaje de calorías de grasas: 0%, Porcentaje de calorías del resto: ${nonFatPercentage.toFixed(2)}%`;

    // Restablecer totales
    totalsElement.textContent = "Totales: 0g/ml de Cantidad, 0g de Proteínas, 0 Calorías, 0g de Carbohidratos, 0g de Grasas";

    // Limpiar lista de productos seleccionados
    selectedList.innerHTML = "";

    // Limpiar cookies relacionadas con la calculadora
    const calculatorCookies = ['caloriesMin', 'caloriesMax', 'proteinMin', 'proteinMax', 'fatMin', 'fatMax', 'carbsMin', 'carbsMax', 'activityLevel', 'goal', 'protein', 'carbs'];
    calculatorCookies.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    });

    // Limpiar datos en localStorage
    localStorage.removeItem('caloriesMin');
    localStorage.removeItem('caloriesMax');
    localStorage.removeItem('proteinMin');
    localStorage.removeItem('proteinMax');
    localStorage.removeItem('fatMin');
    localStorage.removeItem('fatMax');
    localStorage.removeItem('carbsMin');
    localStorage.removeItem('carbsMax');
    localStorage.removeItem('activityLevel');
    localStorage.removeItem('goal');
    localStorage.removeItem('protein');
    localStorage.removeItem('carbs');
}


function searchProduct() {
    const input = document.getElementById('search').value.toLowerCase();
    const rows = document.querySelectorAll('#product-table tbody tr');

    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        if (name.includes(input)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });

    const visibleRows = document.querySelectorAll('#product-table tbody tr[style=""]');
    if (visibleRows.length === 0) {
        console.log("No se encontraron productos con el nombre ingresado.");
    }
}

// Función para leer el valor de una cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        thead.classList.add("fixed");
      } else {
        thead.classList.remove("fixed");
      }
    });
  });
  
  observer.observe(table);
  

  

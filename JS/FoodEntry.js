let nutritionData = {
    restaurant: "",
    food: "",
    description: "",
    unitType: "",
    baseAmount: 1,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sugar: 0
};

let baseNutritionData = null;

async function saveFoodToGoogle(entry){

    try{

        const response = await fetch(
            API,
            {
                method: "POST",
                body: JSON.stringify(entry)
            }
        );

        const result = await response.json();

        alert(
            "Save Result: " +
            JSON.stringify(result)
        );

        return result;

    } catch(error){

        alert(
            "Sync Failed: " +
            error
        );

        return null;
    }
}

async function analyzeFood() {

    console.log("Analyze Started");

    const food =
        document.getElementById("foodName").value.trim();

    const quantity =
        Number(document.getElementById("quantity").value) || 1;

    if (food === "") {
        alert("Enter a food name first.");
        return;
    }

const foodMaster = await getFoodMaster();

const match = foodMaster.find(item =>
    item.Food &&
    item.Food.toLowerCase() === food.toLowerCase()
);

if (match) {

    const baseAmount =
        Number(match.BaseAmount) || 1;

    const multiplier =
        quantity / baseAmount;

    nutritionData = {
        restaurant: match.Restaurant,
        food: match.Food,
        description: match.Description,
        unitType: match.UnitType || "",
        baseAmount: baseAmount,
        calories: Number(match.Calories) * multiplier,
        protein: Number(match.Protein) * multiplier,
        carbs: Number(match.Carbs) * multiplier,
        fat: Number(match.Fat) * multiplier,
        sugar: Number(match.Sugar) * multiplier
    };

    document.getElementById("aiRestaurant").innerHTML =
        nutritionData.restaurant;

    document.getElementById("aiFood").innerHTML =
        nutritionData.food;

    document.getElementById("aiDescription").innerHTML =
        nutritionData.description;

    document.getElementById("aiCalories").innerHTML =
        nutritionData.calories;

    document.getElementById("aiProtein").innerHTML =
        nutritionData.protein + "g";

    document.getElementById("aiCarbs").innerHTML =
        nutritionData.carbs + "g";

    document.getElementById("aiFat").innerHTML =
        nutritionData.fat + "g";

    document.getElementById("aiSugar").innerHTML =
        nutritionData.sugar + "g";

    document.getElementById("saveBtn").disabled = false;

    console.log("FoodMaster Match Found");

    return;
}

try {

        const response = await fetch(
            NUTRITION_API,
            {
                method: "POST",

                body: JSON.stringify({
                    food: food,
                    quantity: quantity
                })
            }
        );

        console.log("Response Received");

        const responseText = await response.text();

        console.log("RAW RESPONSE");
        console.log(responseText);

        const nutrition = JSON.parse(responseText);

        if (nutrition.success === false) {
            throw new Error(nutrition.error);
        }

nutritionData = {

    restaurant:
        nutrition.restaurant || "",
    food:
        nutrition.food || "",
    description:
        nutrition.description || "",
    calories:
        Number(nutrition.calories) || 0,
    protein:
        Number(nutrition.protein) || 0,
    carbs:
        Number(nutrition.carbs) || 0,
    fat:
        Number(nutrition.fat) || 0,
    sugar:
        Number(nutrition.sugar) || 0
};

document.getElementById("aiRestaurant").innerHTML =
    nutritionData.restaurant;

document.getElementById("aiFood").innerHTML =
    nutritionData.food;

document.getElementById("aiDescription").innerHTML =
    nutritionData.description;

        document.getElementById("aiCalories").innerHTML =
            nutritionData.calories;

        document.getElementById("aiProtein").innerHTML =
            nutritionData.protein + "g";

        document.getElementById("aiCarbs").innerHTML =
            nutritionData.carbs + "g";

        document.getElementById("aiFat").innerHTML =
            nutritionData.fat + "g";

        document.getElementById("aiSugar").innerHTML =
            nutritionData.sugar + "g";

        console.log("Nutrition Analysis Complete", nutritionData);

	document.getElementById("saveBtn").disabled = false;

    } catch (error) {

        console.error("Nutrition Analysis Failed:", error);

        alert(
            "Nutrition analysis failed. Please try again."
        );
    }
}

async function saveFood() {

    const foodName =
        document.getElementById("foodName").value.trim();

    const quantity =
        document.getElementById("quantity").value;

    const mealType =
        document.getElementById("mealType").value;



    if(foodName === "")
    {
        alert("Please enter a food name.");
        return;
    }

const entry = {
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    meal: mealType,
    restaurant: nutritionData.restaurant,
    food: nutritionData.food,
    description: nutritionData.description,
    quantity: quantity,
    calories: nutritionData.calories,
    protein: nutritionData.protein,
    carbs: nutritionData.carbs,
    fat: nutritionData.fat,
    sugar: nutritionData.sugar,
};

const result =
    await saveFoodToGoogle(entry);

if (
    result &&
    result.success === true
) {

    document.getElementById("saveMessage").innerHTML =
        "✅ Entry Saved Successfully";

} else {

    document.getElementById("saveMessage").innerHTML =
        "❌ Save Failed";

    return;
}

    document.getElementById("saveBtn").disabled = true;

    document.getElementById("foodName").value = "";

    document.getElementById("quantity").value = "1";

nutritionData = {
    restaurant: "",
    food: "",
    description: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sugar: 0
};
document.getElementById("aiCalories").innerHTML = "0";
document.getElementById("aiProtein").innerHTML = "0g";
document.getElementById("aiCarbs").innerHTML = "0g";
document.getElementById("aiFat").innerHTML = "0g";
document.getElementById("aiSugar").innerHTML = "0g";
document.getElementById("aiRestaurant").innerHTML = "-";
document.getElementById("aiFood").innerHTML = "-";
document.getElementById("aiDescription").innerHTML = "-";
}

window.onload = function () {

    document.getElementById("navigation").innerHTML =
        buildNavigation("add");

    document
        .getElementById("foodName")
        .addEventListener(
            "input",
            searchFoodSuggestions
        );
    document
        .getElementById("quantity")
        .addEventListener(
            "input",
            recalculateNutrition
        );
};

async function searchFoodSuggestions() {

    const searchText =
        document.getElementById("foodName")
            .value
            .trim()
            .toLowerCase();

    const suggestions =
        document.getElementById(
            "foodSuggestions"
        );

   // suggestions.innerHTML = "";

    if (searchText.length < 2) {
        return;
    }

    const foodMaster =
        await getFoodMaster();

const terms = searchText
    .split(" ")
    .filter(term => term);

const matches =
    foodMaster.filter(item => {

        const searchable =
            `${item.Restaurant} ${item.Food}`
                .toLowerCase();

        return terms.every(term =>
            searchable.includes(term)
        );

    });

console.log(
    matches.map(x => x.Food)
);

suggestions.innerHTML = "";
    matches
        .slice(0, 10)
        .forEach(item => {

            const div =
                document.createElement("div");

div.className =
    "suggestion-item";

div.innerHTML =
    `${item.Restaurant} - ${item.Food}`;

            div.onclick = function () {

                selectFood(item);

            };

            suggestions.appendChild(div);

        });
}


function selectFood(item) {

    document.getElementById("foodName").value =
        item.Food;

    document.getElementById("foodSuggestions").innerHTML =
        "";

const baseAmount =
    Number(item["Base Amount"]) || 1;

document.getElementById("quantity").value =
    baseAmount;


    nutritionData = {
        restaurant: item.Restaurant,
        food: item.Food,
        description: item.Description,
        unitType: item["Unit Type"] || "",
        baseAmount: baseAmount,
        calories: Number(item.Calories),
        protein: Number(item.Protein),
        carbs: Number(item.Carbs),
        fat: Number(item.Fat),
        sugar: Number(item.Sugar)
    };

document.getElementById("quantityUnit").innerHTML =
    nutritionData.unitType || "-";

    baseNutritionData = {
        calories: Number(item.Calories),
        protein: Number(item.Protein),
        carbs: Number(item.Carbs),
        fat: Number(item.Fat),
        sugar: Number(item.Sugar),
        baseAmount: baseAmount
    };

    document.getElementById("aiRestaurant").innerHTML =
        nutritionData.restaurant;

    document.getElementById("aiFood").innerHTML =
        nutritionData.food;

    document.getElementById("aiDescription").innerHTML =
        nutritionData.description;

    document.getElementById("aiCalories").innerHTML =
        nutritionData.calories;

    document.getElementById("aiProtein").innerHTML =
        nutritionData.protein + "g";

    document.getElementById("aiCarbs").innerHTML =
        nutritionData.carbs + "g";

    document.getElementById("aiFat").innerHTML =
        nutritionData.fat + "g";

    document.getElementById("aiSugar").innerHTML =
        nutritionData.sugar + "g";

    document.getElementById("saveBtn").disabled =
        false;
}


function recalculateNutrition() {

    console.log(
        "RECALCULATE FIRED",
        baseNutritionData
    );

    if (!baseNutritionData) {
        return;
    }

    const quantity =
        Number(
            document.getElementById("quantity").value
        ) || 1;

    const multiplier =
        quantity / baseNutritionData.baseAmount;

    nutritionData.calories =
        Math.round(
            baseNutritionData.calories *
            multiplier * 10
        ) / 10;

    nutritionData.protein =
        Math.round(
            baseNutritionData.protein *
            multiplier * 10
        ) / 10;

    nutritionData.carbs =
        Math.round(
            baseNutritionData.carbs *
            multiplier * 10
        ) / 10;

    nutritionData.fat =
        Math.round(
            baseNutritionData.fat *
            multiplier * 10
        ) / 10;

    nutritionData.sugar =
        Math.round(
            baseNutritionData.sugar *
            multiplier * 10
        ) / 10;

    document.getElementById("aiCalories").innerHTML =
        nutritionData.calories;

    document.getElementById("aiProtein").innerHTML =
        nutritionData.protein + "g";

    document.getElementById("aiCarbs").innerHTML =
        nutritionData.carbs + "g";

    document.getElementById("aiFat").innerHTML =
        nutritionData.fat + "g";

    document.getElementById("aiSugar").innerHTML =
        nutritionData.sugar + "g";
}
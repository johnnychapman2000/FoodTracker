let nutritionData = {
    restaurant: "",
    food: "",
    description: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sugar: 0
};

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

    nutritionData = {
        restaurant: match.Restaurant,
        food: match.Food,
        description: match.Description,
        calories: Number(match.Calories) * quantity,
        protein: Number(match.Protein) * quantity,
        carbs: Number(match.Carbs) * quantity,
        fat: Number(match.Fat) * quantity,
        sugar: Number(match.Sugar) * quantity
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

    const notes =
        document.getElementById("notes").value.trim();

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
    notes: notes
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

    document.getElementById("notes").value = "";

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

    const matches =
        foodMaster.filter(item =>
            item.Food &&
            item.Food
                .toLowerCase()
                .includes(searchText)
        );

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
                item.Food;

            div.onclick = function () {

                selectFood(item);

            };

            suggestions.appendChild(div);

        });
}
function selectFood(item) {

    document.getElementById(
        "foodName"
    ).value =
        item.Food;

    document.getElementById(
        "foodSuggestions"
    ).innerHTML = "";

    nutritionData = {

        restaurant:
            item.Restaurant,

        food:
            item.Food,

        description:
            item.Description,

        calories:
            Number(item.Calories),

        protein:
            Number(item.Protein),

        carbs:
            Number(item.Carbs),

        fat:
            Number(item.Fat),

        sugar:
            Number(item.Sugar)

    };

    document.getElementById(
        "aiRestaurant"
    ).innerHTML =
        nutritionData.restaurant;

    document.getElementById(
        "aiFood"
    ).innerHTML =
        nutritionData.food;

    document.getElementById(
        "aiDescription"
    ).innerHTML =
        nutritionData.description;

    document.getElementById(
        "aiCalories"
    ).innerHTML =
        nutritionData.calories;

    document.getElementById(
        "aiProtein"
    ).innerHTML =
        nutritionData.protein + "g";

    document.getElementById(
        "aiCarbs"
    ).innerHTML =
        nutritionData.carbs + "g";

    document.getElementById(
        "aiFat"
    ).innerHTML =
        nutritionData.fat + "g";

    document.getElementById(
        "aiSugar"
    ).innerHTML =
        nutritionData.sugar + "g";

    document.getElementById(
        "saveBtn"
    ).disabled = false;
}

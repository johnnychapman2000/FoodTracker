function buildFoodMaster() {

    const foodLog =
        JSON.parse(localStorage.getItem("foodEntries")) || [];

    let foodMaster =
        JSON.parse(localStorage.getItem("foodMaster")) || [];

    foodLog.forEach(entry => {

        const existingFood = foodMaster.find(item =>
            item.restaurant === entry.restaurant &&
            item.food === entry.food
        );

        if (existingFood) {

            existingFood.timesUsed =
                Number(existingFood.timesUsed || 0) + 1;

            existingFood.lastUsed =
                entry.date;

        } else {

            foodMaster.push({

                foodID:
                    foodMaster.length + 1,

                restaurant:
                    entry.restaurant,

                food:
                    entry.food,

                description:
                    entry.description,

                calories:
                    entry.calories,

                protein:
                    entry.protein,

                carbs:
                    entry.carbs,

                fat:
                    entry.fat,

                sugar:
                    entry.sugar,

                timesUsed: 1,

                lastUsed:
                    entry.date,

                dateAdded:
                    entry.date

            });
        }
    });

    localStorage.setItem(
        "foodMaster",
        JSON.stringify(foodMaster)
    );

    console.log(
        "FoodMaster Built",
        foodMaster
    );
}

function testFoodMaster() {

    console.log("FoodMaster Test Started");

    const entries =
        JSON.parse(localStorage.getItem("foodEntries")) || [];

    console.log(entries);
}

function migrateToPendingSync() {

    const foodEntries =
        JSON.parse(localStorage.getItem("foodEntries")) || [];

    localStorage.setItem(
        "pendingSync",
        JSON.stringify(foodEntries)
    );

    alert(
        "Pending Sync Count: " +
        foodEntries.length
    );

    console.log(
        "Pending Sync Count:",
        foodEntries.length
    );
}

async function syncPendingEntries() {

    let pendingSync =
        JSON.parse(
            localStorage.getItem("pendingSync")
        ) || [];

    if (pendingSync.length === 0) {

        alert("No pending entries.");

        return;
    }

    let successCount = 0;
    let failedEntries = [];

    for (const entry of pendingSync) {

        try {

            const result =
                await saveFoodToGoogle(entry);

            if (
                result &&
                result.success === true
            ) {

                successCount++;

            } else {

                failedEntries.push(entry);
            }

        } catch (error) {

            console.error(
                "Sync Failed",
                error
            );

            failedEntries.push(entry);
        }
    }

    localStorage.setItem(
        "pendingSync",
        JSON.stringify(failedEntries)
    );

    alert(
        successCount +
        " entries synced. " +
        failedEntries.length +
        " remaining."
    );
}
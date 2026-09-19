



const FOODMASTER_API = 'https://script.google.com/macros/s/AKfycbwQIfqodxAXwenUiBuGOOrZQpn0Lj1VQCYszDNjkFV9h8SBvOAsR0mtUF1SBzPj-IrVzA/exec';


async function testFoodMasterAPI() {

    const response = await fetch(FOODMASTER_API);

    const data = await response.json();

    console.log(data);

}

async function getFoodMaster() {

    const response = await fetch(FOODMASTER_API);

    return await response.json();

}


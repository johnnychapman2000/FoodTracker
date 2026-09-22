








// Food Tracker API.js

const API = 'https://script.google.com/macros/s/AKfycbyl3775K9XNrHxy5hifJ3nPMB4SFsdAXlj05q0sl8n1fTLHI8YM5q6mnqlLUzHui5KtqA/exec';

async function getFoodLog() {

    const response =
        await fetch(
            API +
            '?action=getFoodLog'
        );

    const text =
        await response.text();

    return JSON.parse(text);

}



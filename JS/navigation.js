function buildNavigation(activePage){

    const isHome =
        window.location.pathname.includes("index.html");

    const homeLink = isHome
        ? "index.html"
        : "../index.html";

    const historyLink = isHome
        ? "HTML/History.html"
        : "History.html";

    const addLink = isHome
        ? "HTML/FoodEntry.html"
        : "FoodEntry.html";

    const statsLink = isHome
        ? "HTML/Stats.html"
        : "Stats.html";

return `
<div class="navwrap">
    <div class="nav">

        <a href="${homeLink}" ${activePage === "home" ? 'class="active"' : ''}>
	🏠<br>Home
	</a>

	<a href="${historyLink}"
	   ${activePage === "history" ? 'class="active"' : ''}>
	    📜<br>History
	</a>

	<a href="${addLink}"
           ${activePage === "add" ? 'class="active"' : ''}>
            ➕<br>Add
        </a>

	<a href="${statsLink}"
	   ${activePage === "stats" ? 'class="active"' : ''}>
	    📊<br>Stats
	</a>

   </div>`;
}
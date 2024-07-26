const searchForm = document.getElementById("searchForm");
const searchBar = document.getElementById("searchBar");
const info = document.getElementById("weatherInfo");

async function getWeatherInfo(location) {
    const url =
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=RUKSR6KHVPVYWBSNVXND9QMPA `;

    try {
      const init_response = await fetch(url, { mode: "cors" });
      console.log(init_response);
      console.log(init_response.url);

      const actual_response = await fetch(init_response.url, {mode: "cors"});
      const json = await actual_response.json();
      console.log(json);

      let day_info = json.days[0];

      info.innerHTML = `
      <h4>Date: ${day_info.datetime}</h4>
      <h4>Temperature: ${day_info.temp}</h4>
      <h4>Now: ${day_info.preciptype}</h4>
      <h4>Condition: ${day_info.conditions}</h4>
      <h4>UV Index: ${day_info.uvindex}</h4>
      `;

      console.log(info.innerHTML);

      //fahr temp
      console.log(json.days[0].temp);
    } catch (error) {
      console.error(error.message);
    }
  }


function convert_toCelcius(temp_fahr){

}



searchForm.addEventListener("submit", () => {
    event.preventDefault();
    getWeatherInfo(searchBar.value);
    console.log(searchBar.value);
    searchBar.value = "";
})
var url = "https://api-v3.mbta.com/vehicles?filter[route]=1"
async function getVehiclesInfo () {
	const response = await fetch(url);
	const json = await response.json();
	return json.data;
}
mapboxgl.accessToken = "pk.eyJ1Ijoieml1ciIsImEiOiJja3RweTRscnEwZjFvMndsYW03NTJyZHVoIn0.bgYwUs_3ZysQbXxk-fuDQA";
let map = new mapboxgl.Map({container: "map",
							style: "mapbox://styles/mapbox/streets-v11",
							center: [-71.104081, 42.365554],
							zoom: 12,});
let counter = 0;
var markersList = [];
var routeInfoList = [];
var routeInfoContainer = document.getElementById('route-info-container');
var colorAsigment =  new Map();
async function createMarkers() {
	let data = await getVehiclesInfo();
	data.forEach(vehicle => {
		let marker = new mapboxgl.Marker().setLngLat([vehicle.attributes.longitude, vehicle.attributes.latitude]).addTo(map);
		markersList.push(marker);
		routeInfo = {};
		routeInfo.label = vehicle.attributes.label;
		routeInfo.ocupancy = vehicle.attributes.occupancy_status;
		routeInfo.status = vehicle.attributes.current_status;
		createDOMElement(routeInfo);
	});
}
function updateInfo() {
	routeInfoContainer.innerHTML = '';
	if(markersList.length > 0){
		markersList.forEach(marker => {
			marker.remove();
		});
	}
	markersList = [];
	createMarkers();
	setTimeout(updateInfo, 10000);
}
function createDOMElement(info) {
	let div = document.createElement("div");
	div.classList.add('card', 'route-info');
	div.innerHTML = '<div class="card-body">' +
						'<h5 class="card-title">Vehicle Number: ' +  info.label + '</h5>' +
						'<p class="card-text">Status: ' +  info.status + '</p>' +
						'<p class="card-text">Occupacy Status: ' + info.ocupancy + '</p>' +
					'</div>';
	routeInfoContainer.appendChild(div);
}
window.onload = updateInfo();
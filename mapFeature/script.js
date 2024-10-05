let map;
let service;
let infowindow;
let markers = [];

function initMap() {
    // Set a default location (example: Mountain View, CA)
    const center = { lat: 37.4221, lng: -122.0841 };

    // Initialize map
    map = new google.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 13
    });

    // Create a PlacesService instance
    service = new google.maps.places.PlacesService(map);

    infowindow = new google.maps.InfoWindow();
}

function searchPlaces() {
    const searchQuery = document.getElementById("search-input").value;

    if (!searchQuery) {
        alert("Please enter a search term");
        return;
    }

    const request = {
        query: searchQuery,
        fields: ['name', 'geometry'],
    };

    // Perform a text search
    service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            // Clear previous markers
            clearMarkers();

            results.forEach(place => {
                // Create a marker for each place
                const marker = new google.maps.Marker({
                    map,
                    position: place.geometry.location,
                    title: place.name
                });

                // Show info window on marker click
                marker.addListener('click', () => {
                    infowindow.setContent(place.name);
                    infowindow.open(map, marker);
                });

                markers.push(marker);

                // Adjust map bounds to include the place location
                map.panTo(place.geometry.location);
                map.setZoom(14);
            });
        } else {
            alert("No results found.");
        }
    });
}

// Function to clear all markers
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

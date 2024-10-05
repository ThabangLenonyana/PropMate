let map;
let service;
let infowindow;
let markers = [];

function initMap() {
    // Set default center (Example: Mountain View, CA)
    const center = { lat: 37.4221, lng: -122.0841 };

    // Initialize map
    map = new google.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 13,
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

            // Get the first result (main place)
            const place = results[0];
            if (place.geometry && place.geometry.location) {
                const location = place.geometry.location;

                // Add a marker for the main place
                const marker = new google.maps.Marker({
                    map,
                    position: location,
                    title: place.name,
                });

                markers.push(marker);
                map.panTo(location);
                map.setZoom(14);

                // Search for nearby places
                findNearbyPlaces(location);
            }
        } else {
            alert("No results found.");
        }
    });
}

function findNearbyPlaces(location) {
    // Added new place types: shopping mall, train, taxi, and bus stations
    const placeTypes = ['hospital', 'school', 'police', 'shopping_mall', 'train_station', 'bus_station', 'taxi_stand'];

    placeTypes.forEach((type) => {
        const request = {
            location: location,
            radius: 5000, // 5 km radius
            type: [type],
        };

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                results.forEach((place) => {
                    const marker = new google.maps.Marker({
                        map,
                        position: place.geometry.location,
                        title: place.name,
                        icon: getIconForType(type), // Set a custom icon based on place type
                    });

                    markers.push(marker);

                    // Show info window on marker click
                    marker.addListener('click', () => {
                        infowindow.setContent(`${place.name} (${type})`);
                        infowindow.open(map, marker);
                    });
                });
            }
        });
    });
}

// Function to return a custom icon based on place type
function getIconForType(type) {
    const icons = {
        hospital: 'https://maps.google.com/mapfiles/kml/shapes/hospitals.png',
        school: 'https://maps.google.com/mapfiles/kml/shapes/schools_maps.png',
        police: 'https://maps.google.com/mapfiles/kml/shapes/police.png',
        shopping_mall: 'https://maps.google.com/mapfiles/kml/shapes/shopping.png',
        train_station: 'https://maps.google.com/mapfiles/kml/shapes/rail.png',
        bus_station: 'https://maps.google.com/mapfiles/kml/shapes/bus.png',
        taxi_stand: 'https://maps.google.com/mapfiles/kml/shapes/taxi.png',
    };
    return icons[type] || null;
}

// Function to clear all markers
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

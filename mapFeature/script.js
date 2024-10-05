let map;
let service;
let infowindow;
let markers = [];

function initMap() {
    // Set default center (Example: Mountain View, CA)
    const center = { lat: 37.4221, lng: -122.0841 };

    // Initialize the map, but keep it hidden until a valid search
    map = new google.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 13,
    });

    // Create a PlacesService instance
    service = new google.maps.places.PlacesService(map);
    infowindow = new google.maps.InfoWindow();

    // Initially hide the map container
    document.getElementById("map").style.display = "none";
}

function searchPlaces() {
    const searchQuery = document.getElementById("search-input").value.trim();

    if (!searchQuery) {
        alert("Please enter a valid search term.");
        return;
    }

    const request = {
        query: searchQuery,
        fields: ['name', 'geometry'],
    };

    // Perform a text search
    service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            // Clear previous markers
            clearMarkers();

            // Get the first result (main place)
            const place = results[0];
            if (place.geometry && place.geometry.location) {
                const location = place.geometry.location;

                // Show the map container now that we have valid input
                document.getElementById("map").style.display = "block"; // Ensure the map is shown
                
                // Recenter and update the map
                map.setCenter(location); // Center the map on the search result location
                map.setZoom(14); // Adjust zoom level for better visibility

                // Add a marker for the main place
                const marker = new google.maps.Marker({
                    map,
                    position: location,
                    title: place.name,
                });

                markers.push(marker);

                // Search for nearby places
                findNearbyPlaces(location);
            }
        } else {
            alert("No results found.");
            // Hide the map if no results are found
            document.getElementById("map").style.display = "none";
        }
    });
}

function findNearbyPlaces(location) {
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
                        icon: getIconForType(type),
                    });

                    markers.push(marker);

                    marker.addListener('click', () => {
                        infowindow.setContent(`${place.name} (${type})`);
                        infowindow.open(map, marker);
                    });
                });
            }
        });
    });
}

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

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

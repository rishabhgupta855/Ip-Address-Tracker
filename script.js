// script.js

// Map initialization (already present in your code)
// It's good practice to declare variables at the top or within their scope
var map = L.map('map').setView([21.7679, 78.0421], 5); // Initial view for the map
var googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
googleStreets.addTo(map);

var myIcon = L.icon({
    iconUrl: 'images/icon-location.svg',
    iconSize: [40, 40],
    iconAnchor: [22, 94],
});
var marker = L.marker([21.7679, 78.0421], {
    icon: myIcon
}).addTo(map);

// DOM Elements
const searchButton = document.querySelector(".arrow-img");
const userInputField = document.querySelector(".input-container input");
const ipResultP = document.querySelector(".ip-result p");
const locationResultP = document.querySelector(".location-result p");
const timezoneResultP = document.querySelector(".timezone-result p");
const ispResultP = document.querySelector(".isp-result p");
const resultContainer = document.querySelector(".result");

// --- Function to fetch geolocation using XMLHttpRequest (AJAX) ---
function getGeolocation(userInput, flag) {
    // Using ipify.org API as per your original code
    const API_KEY = 'at_c3zWdo8XEpWfpd8RtlQqKM1MQC3SM'; // Your API key
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&${flag}=${userInput}`;

    const xhr = new XMLHttpRequest(); // Create a new XMLHttpRequest object

    xhr.open('GET', url, true); // Configure the request: GET method, URL, asynchronous (true)

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            // Request was successful
            try {
                const data = JSON.parse(xhr.responseText);
                console.log(data);

                // Update results display
                ipResultP.textContent = data.ip;
                locationResultP.textContent = `${data.location.city}, ${data.location.region}, ${data.location.country} ${data.location.postalCode}`;
                ispResultP.textContent = data.isp;
                timezoneResultP.textContent = `UTC ${data.location.timezone}`;

                const latitude = data.location.lat;
                const longitude = data.location.lng;

                resultContainer.style.display = "flex"; // Show the result container

                // Update the map view to the new location
                map.setView([latitude, longitude], 13); // Set new map center and zoom level

                // Update marker position
                marker.setLatLng([latitude, longitude]);

            } catch (e) {
                console.error("Error parsing JSON response:", e);
                alert("Error processing IP data. Please try again. " + e.message);
                // Clear existing results or display error message
                ipResultP.textContent = 'Error';
                locationResultP.textContent = 'Error';
                timezoneResultP.textContent = 'Error';
                ispResultP.textContent = 'Error';
                // Reset map or show error
                map.setView([21.7679, 78.0421], 5); // Default view
                marker.setLatLng([21.7679, 78.0421]); // Default marker
            }
        } else {
            // Request failed with an HTTP error
            console.error(`Request failed. Status: ${xhr.status}, Response: ${xhr.responseText}`);
            alert(`Could not retrieve IP information. Server responded with status: ${xhr.status}.`);
            // Clear existing results or display error message
            ipResultP.textContent = 'Failed to load';
            locationResultP.textContent = 'Failed to load';
            timezoneResultP.textContent = 'Failed to load';
            ispResultP.textContent = 'Failed to load';
            // Reset map or show error
            map.setView([21.7679, 78.0421], 5); // Default view
            marker.setLatLng([21.7679, 78.0421]); // Default marker
        }
    };

    xhr.onerror = function() {
        // Network errors (e.g., no internet connection)
        console.error("Network error occurred during XMLHttpRequest.");
        alert("Network error occurred. Please check your internet connection.");
        // Clear existing results or display error message
        ipResultP.textContent = 'Network Error';
        locationResultP.textContent = 'Network Error';
        timezoneResultP.textContent = 'Network Error';
        ispResultP.textContent = 'Network Error';
        // Reset map or show error
        map.setView([21.7679, 78.0421], 5); // Default view
        marker.setLatLng([21.7679, 78.0421]); // Default marker
    };

    xhr.send(); // Send the request
}

// --- Event Listener for Search Button ---
searchButton.addEventListener("click", function(e) {
    const userInput = userInputField.value.trim();

    if (!userInput) {
        alert("Please enter a valid IP address or domain name.");
        return;
    }

    // Regular expressions for validation
    const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Pattern = /(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:))|(([0-9a-fA-F]{1,4}:){6}(:[0-9a-fA-F]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-fA-F]{1,4}:){5}(((:[0-9a-fA-F]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-fA-F]{1,4}:){4}(((:[0-9a-fA-F]{1,4}){1,3})|((:[0-9a-fA-F]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-fA-F]{1,4}:){3}(((:[0-9a-fA-F]{1,4}){1,4})|((:[0-9a-fA-F]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-fA-F]{1,4}:){2}(((:[0-9a-fA-F]{1,4}){1,5})|((:[0-9a-fA-F]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-fA-F]{1,4}:){1}(((:[0-9a-fA-F]{1,4}){1,6})|((:[0-9a-fA-F]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-fA-F]{1,4}){1,7})|((:[0-9a-fA-F]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))$/;
    const domainValid = /^(?!:\/\/)([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}$/; // Improved domain regex

    // Check if the input is an IPv4 or IPv6 address
    if (ipv4Pattern.test(userInput) || ipv6Pattern.test(userInput)) {
        getGeolocation(userInput, "ipAddress");
    } else if (domainValid.test(userInput)) {
        getGeolocation(userInput, "domain");
    } else {
        alert("Please enter a valid IP address or domain name.");
    }
});

// Allow searching on Enter key press
userInputField.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchButton.click(); // Simulate a click on the arrow
    }
});

// Initial load: Get user's IP info when the page loads
document.addEventListener('DOMContentLoaded', () => {
    getGeolocation('', 'ipAddress'); // No input means it will get the current user's IP
});
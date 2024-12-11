document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    document.getElementById('upload').addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Form submitted');

        // Extract the values from input fields
        const stress = document.getElementById('stress').value;
        const diastolic = document.getElementById('diastolic').value;
        const heartRate = document.getElementById('heart_rate').value;

        // Log the collected input data
        console.log('Collected data:', { stress, diastolic, heartRate });

        // Create a payload (JSON) for the API
        const payload = {
            stress: stress,
            diastolic: diastolic,
            heart_rate: heartRate
        };

        // Send the data to Flask backend
        fetch('http://127.0.0.1:59719/predict', {  // Ensure the backend endpoint is correct
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)  // Send the data as JSON
        })
        .then(response => response.json())
        .then(result => {
            console.log('Result from backend:', result);
            displayResult(result);  // Display the result from Flask
            generateScatterPlot(stress, diastolic, heartRate);  // Generate the scatter plot
            generateBarChart(stress, diastolic, heartRate);     // Generate the bar chart
        })
        .catch(error => {
            console.error('Error during prediction:', error);
            document.getElementById('result').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        });
    });
});

// Function to display the result in the frontend
function displayResult(result) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';  // Clear previous result

    if (result.error) {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${result.error}</p>`;
    } else {
        resultDiv.innerHTML = `<p>Predicted Activity Level: ${result.prediction}</p>`;
        // Update the color of the result box based on activity level
        if (result.prediction.includes("Low")) {
            resultDiv.className = "result-box low";
        } else if (result.prediction.includes("Good")) {
            resultDiv.className = "result-box good";
        } else if (result.prediction.includes("High")) {
            resultDiv.className = "result-box high";
        }
    }
}

// Global variables to track chart instances
let scatterChart;
let barChart;

// Function to generate scatter plot with the input values
function generateScatterPlot(stress, diastolic, heartRate) {
    const ctx = document.getElementById('scatterPlot').getContext('2d');

    // Destroy the previous chart instance if it exists
    if (scatterChart) {
        scatterChart.destroy();
    }

    // Create a new scatter chart
    scatterChart = new Chart(ctx, {
        type: 'bubble', // Bubble chart for scatter
        data: {
            datasets: [{
                label: 'Input Parameters',
                data: [
                    { x: 1, y: stress, r: 10 },  // Stress Level
                    { x: 2, y: diastolic, r: 10 }, // Diastolic BP
                    { x: 3, y: heartRate, r: 10 } // Heart Rate
                ],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    min: 0,
                    max: 4,
                    ticks: { stepSize: 1 },
                    title: { display: true, text: 'Parameter Type' }
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Value' }
                }
            }
        }
    });
}

// Function to generate bar chart with the input values
function generateBarChart(stress, diastolic, heartRate) {
    const ctx = document.getElementById('barChart').getContext('2d');

    // Destroy the previous chart instance if it exists
    if (barChart) {
        barChart.destroy();
    }

    // Create a new bar chart
    barChart = new Chart(ctx, {
        type: 'bar', // Bar chart
        data: {
            labels: ['Stress Level', 'Diastolic BP', 'Heart Rate'],
            datasets: [{
                label: 'Input Parameters',
                data: [stress, diastolic, heartRate],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Value' }
                }
            }
        }
    });
}
let chart; // Define chart variable at the top-level scope

document.getElementById('skillForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const skillLabels = [];
    const skillData = [];
    
    document.querySelectorAll('.skill-group').forEach(skillGroup => {
        const label = skillGroup.querySelector('label').textContent;
        const selectedButton = skillGroup.querySelector('.skill-point.active');
        if (selectedButton) {
            skillLabels.push(label);
            skillData.push(parseInt(selectedButton.getAttribute('data-value')));
        }
    });

    displayRadarChart(skillLabels, skillData);
});

function displayRadarChart(skillLabels, skillData) {
    const radarChartDiv = document.getElementById('radarChart');
    const canvas = radarChartDiv.querySelector('canvas');

    if (chart) {
        chart.destroy();
    }

    const pointColors = getPointColors(); // Get an array of point colors

    const averageColor = calculateAverageColor(pointColors, 0.5); // Calculate the average color with 50% alpha

    chart = new Chart(canvas, {
        type: 'radar',
        data: {
            labels: skillLabels,
            datasets: [{
                label: 'Skill Level',
                data: skillData,
                backgroundColor: averageColor, // Set the average color as the background color
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 3,
                pointBackgroundColor: pointColors, // Set point colors
            }]
        },
        options: {
            scale: {
                ticks: {
                    min: 0, // Set the minimum value to 0
                    max: 5,
                    stepSize: 1,
                    fontFamily: 'Arial',
                    fontSize: 82
                },
                //beginAtZero: true // Start the scale at 0
            }
        }
    });
}




function calculateAverageColor(colors, alpha) {
    const totalColors = colors.length;
    let totalRed = 0;
    let totalGreen = 0;
    let totalBlue = 0;

    colors.forEach(color => {
        const rgb = color.match(/\d+/g); // Extract RGB values from the color string
        totalRed += parseInt(rgb[0]);
        totalGreen += parseInt(rgb[1]);
        totalBlue += parseInt(rgb[2]);
    });

    const averageRed = Math.round(totalRed / totalColors);
    const averageGreen = Math.round(totalGreen / totalColors);
    const averageBlue = Math.round(totalBlue / totalColors);

    return `rgba(${averageRed}, ${averageGreen}, ${averageBlue}, ${alpha})`;
}


document.querySelectorAll('.skill-point').forEach(button => {
    button.addEventListener('click', function() {
        const skillGroup = this.closest('.skill-group');
        skillGroup.querySelectorAll('.skill-point').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        updateChartColors(); // Update point colors for the chart
    });
});

function updateChartColors() {
    if (chart) {
        chart.data.datasets[0].backgroundColor = getPointColors(); // Get colors for each point
        chart.data.datasets[0].borderColor = getPointColors();
        chart.update();
    }
}

function getPointColors() {
    const pointColors = [];
    
    document.querySelectorAll('.skill-group').forEach(skillGroup => {
        const selectedButton = skillGroup.querySelector('.skill-point.active');
        if (selectedButton) {
            pointColors.push(window.getComputedStyle(selectedButton).backgroundColor);
        }
    });
    
    return pointColors;
}



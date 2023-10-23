 var counter = 0;
        var sum = 0;
        var myArray = [];
        var audio = new Audio('beep.wav');
        var originalVolume = audio.volume;

        document.getElementById("beepButton1").addEventListener("click", function() {
            audio.volume = originalVolume;
            audio.src = 'beep_250_.wav';
            audio.play();
        });

        document.getElementById("beepButton2").addEventListener("click", function() {
            audio.volume = originalVolume;
            audio.src = 'beep_500_.wav';
            audio.play();
        });

        document.getElementById("beepButton3").addEventListener("click", function() {
            audio.volume = originalVolume;
            audio.src = 'beep_800_.wav';
            audio.play();
        });

        document.getElementById("beepButton4").addEventListener("click", function() {
            audio.volume = originalVolume;
            audio.src = 'beep.wav';
            audio.play();
        });

        document.getElementById("beepButton5").addEventListener("click", function() {
            audio.volume = originalVolume;
            audio.src = 'beep_2000_.wav';
            audio.play();
        });

        document.getElementById("decreaseButton").addEventListener("click", function() {
            if (audio.volume > 0.1) {
                audio.volume = Math.max(0, audio.volume - 0.1);
                counter++;
                audio.play();
            }
        });

        document.getElementById("increaseButton").addEventListener("click", function() {
            if (audio.volume < 1.0) {
                audio.volume = Math.min(1.0, audio.volume + 0.1);
                audio.play();
            }
        });

        document.getElementById("barelyAudible").addEventListener("click", function() {
            sum = 120 - ( counter*10);
            myArray.push(sum);
            console.log(myArray);
            counter = 0;
        });

        var ctx = document.getElementById('myLineChart').getContext('2d');
        var myLineChart;

        // Function to create the line chart
        function createLineChart() {
            var data = {
                labels: ['250', '500', '800', '1000', '2000'],
                datasets: [{
                    label: 'Sample Data',
                    data: myArray,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'red',
                    borderWidth: 2
                }]
            };

            var options = {
                responsive: true,
                maintainAspectRatio: false,
                 scales: {
            y: {
                beginAtZero: true,
                suggestedMin: 0, // Minimum value
                suggestedMax: 20, // Maximum value
            }
        }
            };

            myLineChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: options
<!--                {-->
<!--            legend: { display: false },-->
<!--            scales: {-->
<!--              yAxes: [{ ticks: { min: 0, max: 20} }],-->
<!--            },-->
<!--          },-->
            });
        }

        var generateGraphButton = document.getElementById('generateGraph');
        generateGraphButton.addEventListener('click', function() {
            createLineChart();
        });

        // Calculate the sum of the elements in myArray
var sum = myArray.reduce(function (a, b) {
    return a + b;
}, 0);

// Calculate the average
var average = sum / myArray.length;

         function displayResult() {
            var resultElement = document.getElementById("result");
          var threshold = 80;
            if (average <=20) {
                resultElement.textContent = "SLIGHT";
                 resultElement.style.color = "green";
            } else if (average >20 && average <= 50) {
                resultElement.textContent = "MILD";
                 resultElement.style.color = "green";
            } else if (average >50 && average <= 80) {
            resultElement.classList.remove("green");
                resultElement.style.color = "green";
            } else {
                resultElement.textContent = "PROFOUND";
                resultElement.style.color = "red";
            }
        }


        var calculateButton = document.getElementById("calculateButton");
        calculateButton.addEventListener("click", displayResult);


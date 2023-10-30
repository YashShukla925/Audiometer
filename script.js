let leftArray = [];
let rightArray = [];

function plotChart() {
  plotblankChart(leftArray, rightArray);
}

let myChart = null;

function plotblankChart(leftArray, rightArray) {
  const ctx = document.getElementById("myChart");
  const data = {
    labels: ["250", "500", "800", "1000", "2000"],
    datasets: [
      {
        label: "Left Ear",
        //   data: [10, 35, 50, 90, 80],
        data: leftArray,
        borderWidth: 3,
      },
      {
        label: "Right Ear",
        //   data: [20, 60, 30, 70, 100],
        data: rightArray,

        borderWidth: 3,
      },
    ],
  };

  const canvasBackgroundColor = {
    id: "canvasBackgroundColor",
    beforeDraw(chart) {
      const { ctx, scales, chartArea } = chart;
      const xScale = scales.x;
      const yScale = scales.y;
      // Define 10 different background colors
      const segmentColors = [
        "rgba(3, 252, 15, 0.2)",
        "rgba(123, 252, 3, 0.2)",
        "rgba(3, 127, 252, 0.2)",
        "rgba(252, 78, 3, 0.2)",
        "rgba(252, 3, 3, 0.2)",
      ];

      const segmentHeight = yScale.max / segmentColors.length;

      segmentColors.forEach((color, index) => {
        const startY = index * segmentHeight;
        const endY = (index + 1) * segmentHeight;
        ctx.fillStyle = color;
        ctx.fillRect(
          0,
          yScale.getPixelForValue(startY),
          ctx.canvas.clientWidth,
          yScale.getPixelForValue(endY) - yScale.getPixelForValue(startY)
        );
      });
    },
  };

  const config = {
    type: "line",
    data: data,
    options: {
      plugins: [canvasBackgroundColor],
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "FREQUENCY(Hz)", // Title for the X-axis
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "DECIBEL LEVEL", // Title for the Y-axis
          },
        },
      },
    },
    plugins: [canvasBackgroundColor],
  };
  if (myChart != null) {
    myChart.destroy();
  }
  myChart = new Chart(ctx, config);
}

let freqArray = ["250", "500", "800", "1000", "2000"];
let dbArray = [
  "0.8",
  "0.25",
  "0.125",
  "0.0625",
  "0.031",
  "0.015",
  "0.0078",
  "0.004",
  "0.0019",
  "0.0009",
];

let changefreq = document.getElementsByClassName("count")[0];
let changedb = document.getElementsByClassName("count")[1];
let changeear = document.getElementsByClassName("count")[2];
let i = 0;
let j = 1;
let currentdb = 80;

function audible() {
  currentdb -= 10;
  j++;
  changedb.innerHTML = currentdb;
  start();
}
function notaudible() {
  currentdb += 10;
  j--;
  changedb.innerHTML = currentdb;
  start();
}
let turn = false;
function barelyaudible() {
  if (turn) {
    rightArray.push(currentdb);
  } else {
    leftArray.push(currentdb);
  }
  if (i == 4 && turn == false) {
    turn = true;
    changeear.innerHTML = "Right";
    i = -1;
  }
  i++;
  j = 1;
  if (i <= 4) {
    changefreq.innerHTML = freqArray[i];
    changedb.innerHTML = "80";
  }
  // plotChart();
  // myChart.update();
  if (i == 5 && turn) {
    changefreq.innerHTML = "2000";
    result();
  }
  currentdb = 80;
  plotChart();
  start();
}

function start() {
  let frequency = parseInt(freqArray[i]);
  let volume = parseFloat(dbArray[j]);
  generateAndPlay(frequency, volume, turn);
}

function generateAndPlay(frequency, volume, turn) {
  // let frequency = parseInt(document.getElementById("frequency").value);

  let audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let oscillator = audioContext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  let panNodeLeft = audioContext.createStereoPanner();
  let panNodeRight = audioContext.createStereoPanner();

  panNodeLeft.pan.value = -1;
  panNodeRight.pan.value = 1;

  oscillator.connect(panNodeLeft);
  oscillator.connect(panNodeRight);

  let destinationLeft = audioContext.createMediaStreamDestination();
  let destinationRight = audioContext.createMediaStreamDestination();

  panNodeLeft.connect(destinationLeft);
  panNodeRight.connect(destinationRight);

  let leftChannelStream = destinationLeft.stream;
  console.log(destinationLeft.stream);
  let rightChannelStream = destinationRight.stream;

  let leftChannelAudio = document.getElementById("leftChannel");
  console.log(leftChannelAudio);
  let rightChannelAudio = document.getElementById("rightChannel");

  leftChannelAudio.srcObject = leftChannelStream;
  rightChannelAudio.srcObject = rightChannelStream;

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 4); // Play for 2 seconds
  // oscillator.stop(); // Play for 2 seconds

  if (turn) {
    rightChannelAudio.volume = volume;
    rightChannelAudio.play();
  } else {
    leftChannelAudio.volume = volume;
    leftChannelAudio.play();
  }
}

function result() {
  let leftsum = 0;
  let rightsum = 0;
  for (let i = 0; i < 5; i++) {
    leftsum += leftArray[i];
    rightsum += rightArray[i];
  }
  let leftAvg = leftsum / 5;
  let rightAvg = rightsum / 5;

  let leftproblemname = condition(leftAvg);
  let rightproblemname = condition(rightAvg);

  document.getElementById("leftavg").innerHTML = leftAvg;
  document.getElementById("leftproblem").innerHTML = leftproblemname;
  document.getElementById("rightavg").innerHTML = rightAvg;
  document.getElementById("rightproblem").innerHTML = rightproblemname;

  document.getElementsByClassName("changetores")[0].style.display = "none";
  document.getElementsByClassName("chnagetocontrol")[0].style.display = "block";
}

function condition(leftAvg) {
  if (leftAvg <= 25) return "Normal";
  else if (leftAvg > 25 && leftAvg <= 40) return "Mild";
  else if (leftAvg > 40 && leftAvg <= 55) return "Moderate";
  else if (leftAvg > 55 && leftAvg <= 70) return "Moderately Severe";
  else if (leftAvg > 70 && leftAvg <= 90) return "Severe";
  else return "Profound";
}

function change() {
  document.getElementsByClassName("changetores")[0].style.display = "block";
  document.getElementsByClassName("chnagetocontrol")[0].style.display = "none";
  if (myChart != null) {
    myChart.destroy();
  }
  i = 0;
  j = 1;
  leftArray = [];
  rightArray = [];
  currentdb = 80;
  turn = false;

  changefreq.innerHTML = freqArray[i];
  changedb.innerHTML = "80";
  changeear.innerHTML = "Left";
}

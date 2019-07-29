  window.chartColors = {
  	red: 'rgb(89, 155, 179)',
	  yellow: 'rgb(113, 89, 179)',
	  blue: 'rgb(178, 89, 155)',
	  color1: 'rgb(121, 36, 96)',
    color3: 'rgb(199, 0, 57)',
    color4: 'rgb(255, 87, 51)'
  };
  
    const selectDeviceBtn = document.querySelector('#select_device');
    const output = document.querySelector('#output'); 
    let gdxDevice = "";
    let globalMax = 0;
    const students = [];
    let curStudent = "";
    let curDataset = "";
    
    class Student {
        constructor(name) {
          this.studentName = name;
          this.sensorValues = [];
          this.max = 0; 
          
        }
      }
    
    const selectDevice = async () => {
      try {
        gdxDevice = await godirect.selectDevice();
        output.textContent += `\n Connected to `+gdxDevice.name;
        output.textContent += `\n Press 'Add Student' to add a new student \n Then press 'Start Collection'to begin testing \n Press 'Stop Collection to stop collecting data `;
        output.textContent += `\n Once stopped, you may add a new student or Disconnect to end the competition and see the final results`;
      } catch (err) {
        console.error(err);
      }
    };
     
    
    let lastValue = 0;
    const startCollection = async () => {
       
      gdxDevice.start(500);
      let localMax = 0;
      const sensor =  gdxDevice.getSensor(1);

      let count = 21;
      
      
      sensor.on('value-changed', (sensor) => {
       
        if (sensor.value !== lastValue){
          curStudent.sensorValues.push(sensor.value);	
          lastValue = sensor.value;
     	    if (curDataset.data.length >= count) {
				    config.data.labels.push(count++);
          }
          
          curDataset.data.push(curStudent.sensorValues.pop());
				  window.myLine.update();
        }    
       
        reading.textContent = `${curStudent.studentName}'s value: ${sensor.value} ${sensor.unit}`;
       
        console.log(`student name: ${curStudent.studentName} value: ${sensor.value} units: ${sensor.unit}`);
      
      
        if (sensor.value > globalMax){
           globalMax = sensor.value;
           maxReading.textContent = `High Score = ` + globalMax + `( ` + curStudent.studentName + ` )`;
        }
       
        if(sensor.value > curStudent.max){
          curStudent.max = sensor.value;
          localMaxReading.textContent = curStudent.studentName + `'s max = ` + curStudent.max;
        }
      });
       
     } 
  const stopCollection = async () => {
        gdxDevice.stop();
      }
  const disconnectDevice = async () => {
    
       gdxDevice.close();
        
         gdxDevice.on('device-closed', () => {
          output.textContent += `\n\n Disconnected from `+gdxDevice.name+`\n`;
        }); 
    
       students.forEach(function (student) {
        output.textContent += `\n \n student name: ${student.studentName} max: ${student.max}`; 
        
      }); 
                      

  }
  
  var colorNames = Object.keys(window.chartColors);  
 
  const addStudent = async () => {
     let name = prompt('enter student name');
     curStudent = new Student(name);
     students.push(curStudent);
    
    var colorName = colorNames[config.data.datasets.length % colorNames.length];
			var newColor = window.chartColors[colorName];
			var newDataset = {
				label: curStudent.studentName,
				backgroundColor: newColor,
				borderColor: newColor,
				data: [],
				fill: false
			};


      curDataset = newDataset;
			config.data.datasets.push(newDataset);
			window.myLine.update();

     } 
  var config = {
			type: 'line',
			data: {
				labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 
				datasets: [ ]
			},
			options: {
				responsive: true,
				title: {
					display: true,
					text: 'Bridge Competition'
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Time'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Force'
						}
					}]
				}
			}
		};
    	window.onload = function() {
			var ctx = document.getElementById('canvas').getContext('2d');
			window.myLine = new Chart(ctx, config);
		};

  
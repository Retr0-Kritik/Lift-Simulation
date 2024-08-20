const submitButton = document.querySelector('.submit');
const backButton = document.querySelector('.back');
const inputSection = document.getElementById('input-section');
const simulationSection = document.getElementById('simulation');
const upButton = document.querySelector('.up');
const downButton = document.querySelector('.down');
let floorNos = document.getElementById('floors');
let liftNos = document.getElementById('lifts');
const noOfLifts = document.querySelector('.sim-lifts');
const lift = document.querySelector('.lift');
const noOfFloors = document.querySelector('.sim-floors');
const floor = document.querySelector('.floor');

submitButton.addEventListener('click', () => {
  let errorMessage = '';
  let n = floorNos.value;
  let m = liftNos.value;
  let i = 0;
  

  if (n < 2 || n > 10) {
    errorMessage += 'Floor number must be between 2 and 10.\n';
  }
  if (m < 2 || m > 10) {
    errorMessage += 'Lift number must be between 2 and 10.\n';
  }

  if (errorMessage) {
    alert(errorMessage);
  } else {
    inputSection.style.display = 'none';
    simulationSection.style.display = 'flex';
    backButton.style.display = 'block';
  }

});

backButton.addEventListener('click', () => {
  simulationSection.style.display = 'none';
  inputSection.style.display = 'flex';
  backButton.style.display = 'none';
});
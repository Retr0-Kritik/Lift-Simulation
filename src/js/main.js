const submitButton = document.querySelector('.submit');
const backButton = document.querySelector('.back');
const inputSection = document.getElementById('input-section');
const simulationSection = document.getElementById('simulation');
let floorNos = document.getElementById('floors');
let liftNos = document.getElementById('lifts');

function clearContent() {
    while (simulationSection.firstChild) {
        simulationSection.removeChild(simulationSection.firstChild);
    }
}

submitButton.addEventListener('click', () => {
    let errorMessage = '';
    let n = parseInt(floorNos.value);
    let m = parseInt(liftNos.value);

    if (n < 1) {
        errorMessage += 'Invalid Floor Input.\n';
    }
    if (m < 1) {
        errorMessage += 'Invalid Lift Input.\n';
    }

    if (errorMessage) {
        alert(errorMessage);
    } else {
        const newSimLiftsContainer = document.createElement('div');
        newSimLiftsContainer.id = 'sim-lifts';


        for (let i = 0; i < n; i++) {
            const floorDiv = document.createElement('div');
            floorDiv.classList.add('sim-floors');

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');

            const upButton = document.createElement('button');
            upButton.classList.add('up');
            upButton.textContent = 'Up';
            const downButton = document.createElement('button');
            downButton.classList.add('down');
            downButton.textContent = 'Down';

            if (i === n - 1) upButton.style.display = 'none';
            if (i === 0) downButton.style.display = 'none';

            buttonContainer.appendChild(upButton);
            buttonContainer.appendChild(downButton);

            const floorContainer = document.createElement('div');
            floorContainer.classList.add('floor-container');

            const line = document.createElement('div');
            line.classList.add('line');

            const floorNo = document.createElement('div');
            floorNo.classList.add('floor-no');
            floorNo.textContent = `Floor ${i + 1}`; 

            floorContainer.appendChild(line);
            floorContainer.appendChild(floorNo);

            floorDiv.appendChild(buttonContainer);
            floorDiv.appendChild(floorContainer);

            simulationSection.appendChild(floorDiv);

        
            if (i === 0) {
                for (let j = 0; j < m; j++) {
                    const liftDiv = document.createElement('div');
                    liftDiv.classList.add('lift');

                    const liftDoorLeft = document.createElement('div');
                    liftDoorLeft.classList.add('lift-door-left');

                    const liftDoorRight = document.createElement('div');
                    liftDoorRight.classList.add('lift-door-right');

                    liftDiv.appendChild(liftDoorLeft);
                    liftDiv.appendChild(liftDoorRight);

                    newSimLiftsContainer.appendChild(liftDiv);
                }

                floorDiv.appendChild(newSimLiftsContainer);
            }
        }
        newSimLiftsContainer.scrollLeft = newSimLiftsContainer.scrollWidth;
        inputSection.style.display = 'none';
        simulationSection.style.display = 'flex';
        backButton.style.display = 'block';

        newSimLiftsContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        newSimLiftsContainer.scrollLeft += e.deltaY;
        
        });
    }
});

backButton.addEventListener('click', () => {
    clearContent();
    simulationSection.style.display = 'none';
    inputSection.style.display = 'flex';
    backButton.style.display = 'none';
});

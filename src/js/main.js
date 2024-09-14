const submitButton = document.querySelector('.submit');
const backButton = document.querySelector('.back');
const inputSection = document.getElementById('input-section');
const simulationSection = document.getElementById('simulation');
let floorNos = document.getElementById('floors');
let liftNos = document.getElementById('lifts');

let liftMovingOrder = [];
let lifts = [];

function clearContent() {
    while (simulationSection.firstChild) {
        simulationSection.removeChild(simulationSection.firstChild);
    }
}

function storeLiftRequest(floorNumber) {
    liftMovingOrder.push(floorNumber);
}

function moveLiftInOrder(floorNumber) {
    let stationaryLift = lifts.find(lift => lift.dataset.status === "free");
    if (stationaryLift) {
        if (parseInt(stationaryLift.dataset.current) === floorNumber) {
            doorsMovement(stationaryLift, floorNumber);
        } else {
            liftMovement(stationaryLift, floorNumber);
        }
    } else {
        storeLiftRequest(floorNumber);
    }
}

function doorsMovement(lift, floorNumber) {
    lift.dataset.status = "busy";
    const leftDoor = lift.querySelector('.lift-door-left');
    const rightDoor = lift.querySelector('.lift-door-right');

    leftDoor.style.animation = 'ldoor 2.5s';
    rightDoor.style.animation = 'rdoor 2.5s';

    setTimeout(() => {
        leftDoor.style.animation = '';
        rightDoor.style.animation = '';
        lift.dataset.status = "free";
        lift.dataset.current = floorNumber;
        checkQueue();
    }, 2500);
}

function liftMovement(lift, floorNumber) {
    lift.dataset.status = "busy";
    const currentFloor = parseInt(lift.dataset.current);
    const distance = Math.abs(currentFloor - floorNumber);
    const moveTime = distance * 2;
    const newBottom = (floorNumber - 1) * 200;

    lift.style.transition = `bottom ${moveTime}s linear`;
    lift.style.bottom = `${newBottom}px`;

    setTimeout(() => {
        lift.style.transition = ''; 
        lift.dataset.current = floorNumber;
        doorsMovement(lift, floorNumber);
    }, moveTime * 1000);
}

function checkQueue() {
    if (liftMovingOrder.length > 0) {
        const nextFloor = liftMovingOrder.shift();
        moveLiftInOrder(nextFloor);
    }
}

submitButton.addEventListener('click', () => {
    let errorMessage = '';
    let n = parseInt(floorNos.value);
    let m = parseInt(liftNos.value);

    if (isNaN(n) || n < 1) {
        errorMessage += 'Invalid Floor Input.\n';
    }
    if (isNaN(m) || m < 1) {
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
            upButton.addEventListener('click', () => moveLiftInOrder(i + 1));

            const downButton = document.createElement('button');
            downButton.classList.add('down');
            downButton.textContent = 'Down';
            downButton.addEventListener('click', () => moveLiftInOrder(i + 1));

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
                    const lift = document.createElement('div');
                    lift.classList.add('lift');
                    lift.dataset.status = "free";
                    lift.dataset.current = "1";
                    lift.style.position = 'absolute';
                    lift.style.bottom = '0';
                    lift.style.left = `${j * 70}px`; 

                    const liftDoorLeft = document.createElement('div');
                    liftDoorLeft.classList.add('lift-door-left');

                    const liftDoorRight = document.createElement('div');
                    liftDoorRight.classList.add('lift-door-right');

                    lift.appendChild(liftDoorLeft);
                    lift.appendChild(liftDoorRight);

                    newSimLiftsContainer.appendChild(lift);
                    lifts.push(lift);
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
    liftMovingOrder = [];
    lifts = [];
});
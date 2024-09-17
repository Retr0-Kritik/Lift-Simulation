const submitButton = document.querySelector('.submit');
const backButton = document.querySelector('.back');
const inputSection = document.getElementById('input-section');
const simulationSection = document.getElementById('simulation');
let floorNos = document.getElementById('floors');
let liftNos = document.getElementById('lifts');

let liftMovingOrder = [];
let lifts = [];
let floorOccupancy = {};
let liftsEnRoute = {};
let busyUpFloors = new Set();
let busyDownFloors = new Set();

function clearContent() {
    while (simulationSection.firstChild) {
        simulationSection.removeChild(simulationSection.firstChild);
    }
}

function storeLiftRequest(floorNumber, direction) {
    const request = { floor: floorNumber, direction: direction };
    if (!liftMovingOrder.some(r => r.floor === floorNumber && r.direction === direction)) {
        liftMovingOrder.push(request);
    }
}

function findClosestLift(floorNumber) {
    let closestLift = null;
    let minDistance = Infinity;

    for (let lift of lifts) {
        if (lift.dataset.status === "free") {
            const distance = Math.abs(parseInt(lift.dataset.current) - floorNumber);
            if (distance < minDistance) {
                minDistance = distance;
                closestLift = lift;
            }
        }
    }

    return closestLift;
}

function moveLiftInOrder(floorNumber, direction) {
    const busySet = direction === 'up' ? busyUpFloors : busyDownFloors;
    if (busySet.has(floorNumber)) {
        console.log(`Floor ${floorNumber} ${direction} is busy. Request queued.`);
        storeLiftRequest(floorNumber, direction);
        return;
    }

    let stationaryLift = lifts.find(lift => lift.dataset.status === "free" && parseInt(lift.dataset.current) === floorNumber);
    if (stationaryLift) {
        doorsMovement(stationaryLift, floorNumber, direction);
        return;
    }

    let closestLift = findClosestLift(floorNumber);
    if (closestLift) {
        liftMovement(closestLift, floorNumber, direction);
        liftsEnRoute[floorNumber] = (liftsEnRoute[floorNumber] || 0) + 1;
        busySet.add(floorNumber);
        updateFloorButton(floorNumber, direction, true);
    } else {
        storeLiftRequest(floorNumber, direction);
    }
}

function doorsMovement(lift, floorNumber, direction) {
    if (lift.dataset.doorStatus === "busy") return;

    lift.dataset.doorStatus = "busy";
    lift.dataset.status = "busy"; 

    const leftDoor = lift.querySelector('.lift-door-left');
    const rightDoor = lift.querySelector('.lift-door-right');

    leftDoor.style.animation = 'none';
    rightDoor.style.animation = 'none';
    void leftDoor.offsetHeight;

    leftDoor.style.animation = 'ldoor 5s';
    rightDoor.style.animation = 'rdoor 5s';

    setTimeout(() => {
        leftDoor.style.animation = '';
        rightDoor.style.animation = '';
        lift.dataset.doorStatus = "free";
        lift.dataset.status = "free";
        const busySet = direction === 'up' ? busyUpFloors : busyDownFloors;
        busySet.delete(parseInt(lift.dataset.current));
        updateFloorButton(parseInt(lift.dataset.current), direction, false);
        checkQueue();
    }, 5000);
}

function liftMovement(lift, floorNumber, direction) {
    lift.dataset.status = "busy";
    const currentFloor = parseInt(lift.dataset.current);
    floorOccupancy[currentFloor] = (floorOccupancy[currentFloor] || 1) - 1;
    const distance = Math.abs(currentFloor - floorNumber);
    const moveTime = distance * 2;
    const newBottom = (floorNumber - 1) * 200;

    lift.style.transition = `bottom ${moveTime}s linear`;
    lift.style.bottom = `${newBottom}px`;

    setTimeout(() => {
        lift.style.transition = ''; 
        lift.dataset.current = floorNumber;
        floorOccupancy[floorNumber] = (floorOccupancy[floorNumber] || 0) + 1;
        liftsEnRoute[floorNumber]--;
        doorsMovement(lift, floorNumber, direction);
    }, moveTime * 1000);
}

function checkQueue() {
    if (liftMovingOrder.length > 0) {
        const nextRequest = liftMovingOrder[0];
        const busySet = nextRequest.direction === 'up' ? busyUpFloors : busyDownFloors;
        if (!busySet.has(nextRequest.floor)) {
            liftMovingOrder.shift();
            moveLiftInOrder(nextRequest.floor, nextRequest.direction);
        }
    }
}

function updateFloorButton(floorNumber, direction, isBusy) {
    const floorDiv = document.querySelector(`.sim-floors:nth-child(${floorNumber})`);
    const button = floorDiv.querySelector(`.${direction}`);
    if (isBusy) {
        button.disabled = true;
        button.style.backgroundColor = 'red';
    } else {
        button.disabled = false;
        button.style.backgroundColor = ''; // Reset to default color
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
    if (isNaN(n) || n === 1) {
        errorMessage += 'No Lifts required for One Floor.\n';
    }

    if (errorMessage) {
        alert(errorMessage);
    } else {
        const newSimLiftsContainer = document.createElement('div');
        newSimLiftsContainer.id = 'sim-lifts';

        for (let i = 1; i <= n; i++) {
            floorOccupancy[i] = 0;
            liftsEnRoute[i] = 0;
        }

        for (let i = 0; i < n; i++) {
            const floorDiv = document.createElement('div');
            floorDiv.classList.add('sim-floors');

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');

            const upButton = document.createElement('button');
            upButton.classList.add('up');
            upButton.textContent = 'Up';
            upButton.addEventListener('click', (e) => {
                if (!e.target.disabled) {
                    moveLiftInOrder(i + 1, 'up');
                }
            });

            const downButton = document.createElement('button');
            downButton.classList.add('down');
            downButton.textContent = 'Down';
            downButton.addEventListener('click', (e) => {
                if (!e.target.disabled) {
                    moveLiftInOrder(i + 1, 'down');
                }
            });

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
                floorOccupancy[1] = m;
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
    floorOccupancy = {};
    liftsEnRoute = {};
    busyUpFloors.clear();
    busyDownFloors.clear();
});
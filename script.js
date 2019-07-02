const lots = document.querySelector(".fields");
const calculateBtn = document.querySelector("#calculate-btn");
const calculatedLots = document.querySelector("#calculatedLots");
let calculating = 0;
let flock;
let sheepNameList = [];
let numberOfSheep;
let dayNumber = 1;
let eatenLots = [];

// event listeners?
calculateBtn.addEventListener("click", lotCalculator);
document.getElementById("lotsToClick").style.display = "none";
document.getElementById("number-of-sheep").style.display = "none";
document.getElementById("nameSheepForm").style.display = "none";
document.getElementById("noMoreLots").style.display = "none";
document.getElementById("add-name").addEventListener("click", storeSheepName);

useExistingFlock();

// check local storage for existing flock
function useExistingFlock() {
  if (localStorage.getItem("sheepNameList") === null) {
    console.log("no flock, buddy");
    document.getElementById("number-of-sheep").style.display = "block";
  } else {
    //get sheepNameList from local storage and pop it into the variable
    console.log("we gotta flock here, chief");
    sheepNameList = JSON.parse(localStorage.getItem("sheepNameList"));
    dayNumber = JSON.parse(localStorage.getItem('dayNumber'));
    eatenLots = JSON.parse(localStorage.getItem('eatenLots'));
    lotCalculator();
    checkLotStatus();
  }
}

// figure out how many lots you can click on
function lotCalculator(e) {
  if (e) {
    e.preventDefault();
  }
  if (sheepNameList.length > 0) {
    numberOfSheep = sheepNameList.length;
    document.getElementById("lotsToClick").style.display = "block";
    document.querySelector(".fields").addEventListener("click", changeLotColor);
  } else {
    numberOfSheep = Number(document.querySelector("#sheep-number").value);
    document.getElementById("nameSheepForm").style.display = "block";
    nameSheepForm(numberOfSheep);
  }

  for (let i = 0; i < numberOfSheep; i++) {
    if (i % 2 === 0) {
      calculating++;
    }
  }
  calculatedLots.textContent = calculating;
  console.log(
    "caulculating/the number of lots we can click on is " + calculating
  );
}

// check lot status - see if any need to be yellow while they regrow
function checkLotStatus(){
    console.log(eatenLots);
    let lots = document.querySelectorAll('.lot');
    eatenLots.forEach(function(lotNumber, index){
        console.log(lots);
        for(let i =0; i < lots.length; i++){
            if (lots[i].classList.contains(lotNumber)){
                lots[i].style.backgroundColor = 'yellow';
                lots[i].classList.add('eaten');
                console.log(eatenLots[index]);
            }
        }
    })
    eatenLots = [];
}

// click on the lots, change the color
function changeLotColor(e) {
  if (e.target.classList.contains("lot") && !e.target.classList.contains('eaten')) {
    e.target.style.backgroundColor = "red";
    assignLotResidents(e.target);
    eatenLots.push(e.target.classList[0]);
    localStorage.setItem('eatenLots', JSON.stringify(eatenLots));
    maxLotsClicked();
  } 
}

// prevent additional clicking
function maxLotsClicked() {
  calculating--;
  calculatedLots.textContent = calculating;
  if (calculating === 0) {
    lots.removeEventListener("click", changeLotColor);
    document.getElementById("lotsToClick").style.display = "none";
    document.getElementById("noMoreLots").style.display = "block";
    document
      .getElementById("newDay")
      .addEventListener("mousedown", startNewDay);
    document
      .getElementById("newFlock")
      .addEventListener("mousedown", startNewFlock);
  }
}

// assigning the names from the array into the lots
function assignLotResidents(lot) {
  if (!sheepNameList[1] || !sheepNameList.length) {
    lot.textContent = `Sheep: ${sheepNameList[0]}`;
  } else {
    lot.textContent = `Sheep: ${sheepNameList[0]} + ${sheepNameList[1]}`;
  }
  sheepNameList.splice(0, 2);
}

// form for naming the sheep based on the number of sheep we have
function nameSheepForm(numberOfSheep) {
  document.getElementById("number-of-sheep").style.display = "none";
  document.getElementById("nameSheepForm").style.display = "block";

  for (let i = 0; i < numberOfSheep; i++) {
    const newFormLabel = document.createElement("label");
    const newFormInput = document.createElement("input");
    newFormLabel.textContent = "Name";
    newFormInput.setAttribute("placeholder", "Lamb Chop");
    newFormInput.classList.add(`name-${i}`, "sheep-name");
    document.getElementById("nameSheepForm").append(newFormLabel);
    document.getElementById("nameSheepForm").append(newFormInput);
  }
}

// store the sheeps' names in an array
function storeSheepName(name) {
  let names = document.querySelectorAll(".sheep-name");
  names.forEach(function(name) {
    sheepNameList.push(name.value);
  });
  document.querySelector(".fields").addEventListener("click", changeLotColor);
  document.getElementById("nameSheepForm").style.display = "none";
  document.getElementById("lotsToClick").style.display = "block";
  foreverFlock();
}

// save to local storage
function foreverFlock() {
  localStorage.setItem("sheepNameList", JSON.stringify(sheepNameList));
  dayNumber++;
  localStorage.setItem('dayNumber', JSON.stringify(dayNumber));
  

}

// reload the page to start a new day
function startNewDay(e) {
  window.location.reload();
  document.getElementById("number-of-sheep").style.display = "none";
  document.getElementById("nameSheepForm").style.display = "none";
}

function startNewFlock(e) {
  console.log("get a new flock bud");
  localStorage.clear();
  document.location.reload();
}

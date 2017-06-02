/**
 * Created by alenka on 01.06.17.
 */
function Casino(SlotMachines, startCasinoMoney) {

    this.slotMachines = SlotMachines;
    this.startCasinoMoney = startCasinoMoney;
    var me = this;
    var machinesArr = [];
    this.machineList = machinesArr;

    var addSlotMashines = function() {

        var moneyForOneMashine = Math.floor(me.startCasinoMoney / me.slotMachines); // Денег на одну машину в среднем

        // Создаем   машины
        for (var i = 0; i < +me.slotMachines; i++) {
            var slotMachine = new SlotMachine(moneyForOneMashine);
            machinesArr.push(slotMachine);

        }

        var remainder = Math.floor(me.startCasinoMoney - moneyForOneMashine * me.slotMachines); //Остаток
        machinesArr[0].startMachineMoney += +remainder;

        var randomLuckyMachine = Math.floor(Math.random() * machinesArr.length);
        machinesArr[randomLuckyMachine].lucky = true;

    };
    addSlotMashines();

    this.totalSum = function() {
        return +me.startCasinoMoney;
    };

    this.totalMachines = function() {
        return +me.slotMachines;
    };

    this.addMachine = function() {
        var max = 0; // максимум денег в списке машин
        var number = 0; // номер машины в списке

        for (var i = 0; i < machinesArr.length; i++) {
            if (machinesArr[i].startMachineMoney > max) {
                max = machinesArr[i].startMachineMoney;
                number = i;
            }
        }

        var moneyToShare = Math.floor(machinesArr[number].startMachineMoney / 2); // делим максимальную сумму в машине на два

        machinesArr[number].startMachineMoney = moneyToShare;

        var slotMachine = new SlotMachine(moneyToShare);
        machinesArr.push(slotMachine);
        me.slotMachines++;
    };

    this.removeMachine = function(number) {

        if (number <= machinesArr.length) {
            var currentNumber = number - 1;
            var currentMashine = machinesArr[currentNumber];
            var moneyInMashine = currentMashine.startMachineMoney;
            machinesArr.splice(currentNumber, 1);
            var avarageSum = Math.floor(moneyInMashine / machinesArr.length);

            for (var i = 0; i < machinesArr.length; i++) {
                machinesArr[i].startMachineMoney += +avarageSum;
            }
        }
        me.slotMachines--;

    };

    this.getMoney = function(number) {
        if (!isNaN(number)) {
            me.startCasinoMoney -= number;
            var machMoney = [];

            for (var i = 0; i < machinesArr.length; i++) {
                machMoney.push(machinesArr[i].startMachineMoney);
            }
            machMoney.sort();
            machMoney.reverse();

            for (var i = 0; i < machMoney.length; i++) {
                var diff = machMoney[i] - number;
                if (diff >= 0) {
                    machMoney[i] = diff;
                    break;

                } else {
                    number -= machMoney[i];
                    machMoney[i] = 0;
                    continue;
                }

            }
            for (var i = 0; i < machMoney.length; i++) {
                machinesArr[i].startMachineMoney = machMoney[i];
            }
        }
    }

}

function SlotMachine(startMachineMoney) {
    this.startMachineMoney = +startMachineMoney;
    this.lucky = false;
    var that = this;

    this.totalSum = function() {
        return that.startMachineMoney;
    };
    this.getMoney = function(number) {

        if (number <= that.startMachineMoney) {
            that.startMachineMoney -= number;
            return that.startMachineMoney;
        } else {
            alert("Вы не можете забрать столько денег, введите меньшую сумму");
        }

    };
    this.setMoney = function(number) {
        that.startMachineMoney += number;
    };
    this.play = function(number) {

        var combinationOne;
        var combinationTwo;
        var combinationThree;

        if (that.lucky) {
            combinationOne = 7;
            combinationTwo = 7;
            combinationThree = 7;
            that.lucky = false;
        } else {
            combinationOne = Math.floor(Math.random() * (9)) + 1;
            combinationTwo = Math.floor(Math.random() * (9)) + 1;
            combinationThree = Math.floor(Math.random() * (9)) + 1;
        }

        var combination = combinationOne + " " + combinationTwo + " " + combinationThree;
        var prize;
        if (combinationOne !== combinationTwo && combinationTwo !== combinationThree && combinationOne !== combinationThree) {
            prize = 0;

        } else if ((combinationOne === 7) && (combinationTwo === 7) && (combinationThree === 7)) {

            prize = that.startMachineMoney;

        } else if (combinationOne === combinationTwo && combinationTwo === combinationThree && combinationOne === combinationThree) {

            prize = number * 5;

        } else if ((combinationOne === combinationTwo) || (combinationOne === combinationThree) || (combinationTwo === combinationThree)) {

            prize = number * 2;
        }
        return {
            'combination': combination,
            'prize': prize
        }
    }
}

// Playing with DOM

//define elements
var playCasino = document.querySelector('.begin-casino'),
    hidden = document.querySelectorAll('.hidden'),
    casinoMoneyDisplay = document.querySelector('.total-money'),
    casinoMoneyDisplay2 = document.querySelector('.real-money'),
    casinoMachines = document.querySelector('.total-machines'),
    casinoInfoMachines = document.querySelector('.casino-list'),
    casinoAddMachine = document.querySelector('.add_machine'),
    casinoRemoveMachine = document.querySelector('.remove_machine'),
    casinoTakeMoney = document.querySelector('.take_money');
var slotMachineMoney = document.querySelector('.money'),
    slotMachineNumber = document.querySelector('.number'),
    slotMachineTakeMoney = document.querySelector('.take_profit'),
    slotMachineTakePrize = document.querySelector('.take_prize'),
    slotMachineSpendMoney = document.querySelector('.table-money_display'),
    slotMachinePut_money = document.querySelector('.put_money'),
    slotMachineplay = document.querySelector('.play'),
    slotMachinePlayCombination = document.querySelector('.machine-item_combination'),
    slotMachinePlayResult = document.querySelector('.machine-item_prize');


// Casino
playCasino.addEventListener('click', function() {
    // Обьявляем доступные на руках деньги
    var realMoney = 0;

    var listItems = document.querySelectorAll('.casino-item');
    // если список существует - удаляем его
    if (listItems) {
        for (var i = 0; i < listItems.length; i++) {
            listItems[i].remove();
        }
    }

    var askCasinoMachines = prompt("How much slotmachins would you like to have in casino?", "10");
    askCasinoMachines = parseInt(askCasinoMachines);
    var askCasinoMoney = prompt("How much money do you have to open a casino?", "1000");
    askCasinoMoney = parseInt(askCasinoMoney);
    // создаем казино
    if (askCasinoMachines && askCasinoMoney && askCasinoMachines <= askCasinoMoney) {
        var casino = new Casino(askCasinoMachines, askCasinoMoney);
    }
    var listSMashines = casino.machineList;

    // Выбираем рандомную машину для игры
    var numberOfMachine = Math.floor(Math.random() * (listSMashines.length));
    slotMachineNumber.innerText = numberOfMachine + 1;
    // Максимальный выигрыш в слотмашине
    var startPrize;
    // Записываем общие показатели казино
    casinoMoneyDisplay.innerText = casino.totalSum();
    casinoMoneyDisplay2.innerText = realMoney;
    casinoMachines.innerText = casino.totalMachines();
    // cоздаем список машин
    for (var i = 0; i < listSMashines.length; i++) {
        var machineItem = document.createElement('li');
        machineItem.innerText = "$" + listSMashines[i].startMachineMoney;
        machineItem.classList.add('casino-item');
        casinoInfoMachines.appendChild(machineItem);
    }
    hidden[0].style.display = 'block';
    hidden[1].style.display = 'block';


    casinoAddMachine.addEventListener('click', function() {
        casino.addMachine();
        casinoMachines.innerText = casino.totalMachines();
        // усли список существует - его удалить
        listItems = document.querySelectorAll('.casino-item');
        if (listItems) {
            for (var i = 0; i < listItems.length; i++) {
                listItems[i].remove();
            }
        }
        for (var i = 0; i < listSMashines.length; i++) {
            var machineItem = document.createElement('li');
            machineItem.innerText = "$" + listSMashines[i].startMachineMoney;
            machineItem.classList.add('casino-item');
            casinoInfoMachines.appendChild(machineItem);

        }
        // Обновили надпись о максимальном призе в слотмашине
        slotMachineMoney.innerText = "Максимальный приз " + listSMashines[numberOfMachine].startMachineMoney + "$";
        startPrize = listSMashines[numberOfMachine].startMachineMoney;
    });

    casinoRemoveMachine.addEventListener("click", function() {
        var numberOfRemoveItem = prompt("Enter number of machine to remove");
        numberOfRemoveItem = Math.floor(numberOfRemoveItem);
        if (numberOfRemoveItem <= listSMashines.length && numberOfRemoveItem >= 1 && numberOfRemoveItem !== numberOfMachine + 1) {
            listItems = document.querySelectorAll('.casino-item');
            if (listItems) {
                for (var i = 0; i < listItems.length; i++) {
                    listItems[i].remove();
                }
                casino.removeMachine(numberOfRemoveItem);
                for (var i = 0; i < listSMashines.length; i++) {

                    var machineItem = document.createElement('li');
                    machineItem.innerText = "$" + listSMashines[i].startMachineMoney;
                    machineItem.classList.add('casino-item');
                    casinoInfoMachines.appendChild(machineItem);
                }
                console.log(numberOfMachine);
                // Обновили надпись о максимальном призе в слотмашине
                slotMachineMoney.innerText = "Максимальный приз " + listSMashines[numberOfMachine].startMachineMoney + "$";
                startPrize = listSMashines[numberOfMachine].startMachineMoney;
            }
        } else {
            prompt("Enter number of machine to remove less or equal " + listSMashines.length);
        }
    });

    casinoTakeMoney.addEventListener("click", function() {
        var askNumber = prompt("How much money do you want to take?");
        if (askNumber <= casino.totalSum()) {
            casino.getMoney(askNumber);
            realMoney = askNumber;
            casino.startCasinoMoney -= askNumber;

            listItems = document.querySelectorAll('.casino-item');
            if (listItems)
                for (var i = 0; i < listItems.length; i++) {
                    listItems[i].remove();
                    var machineItem = document.createElement('li');
                    machineItem.innerText = "$" + listSMashines[i].startMachineMoney;
                    machineItem.classList.add('casino-item');
                    casinoInfoMachines.appendChild(machineItem);
                }
            casinoMoneyDisplay2.innerText = realMoney;
            // Обновили надпись о максимальном призе в слотмашине
            slotMachineMoney.innerText = "Максимальный приз " + listSMashines[numberOfMachine].startMachineMoney + "$";
            startPrize = listSMashines[numberOfMachine].startMachineMoney;

        }
    });


    // Создаем текущую слотмашину
    var slot = listSMashines[numberOfMachine];
    startPrize = listSMashines[numberOfMachine].startMachineMoney;
    var playerMoney = 0;
    slotMachineMoney.innerText = "Максимальный приз " + startPrize + "$";
    slotMachineSpendMoney.innerText = playerMoney;


    slotMachinePut_money.addEventListener("click", function() {
        var moneyForGame = prompt("Минимальная сумма взноса равна $ 10, сколько ты готов потратить?", "50");
        moneyForGame = parseInt(moneyForGame);
        if (moneyForGame < 10 || isNaN(moneyForGame)) {
            alert("Внесите минимум 10$");

        } else {
            slot.setMoney(moneyForGame);
            playerMoney += moneyForGame;
            slotMachineSpendMoney.innerText = playerMoney;
            casino.startCasinoMoney += Number(moneyForGame);
            casinoMoneyDisplay.innerText = casino.startCasinoMoney;
            startPrize += moneyForGame;
            slotMachineMoney.innerText = "Максимальный приз " + startPrize + "$";

            // обновляем список данных машин в казино
            // Удаляем все элементы
            var listItems = document.querySelectorAll('.casino-item');
            for (var i = 0; i < listItems.length; i++) {
                listItems[i].remove();
            }
            // Добавляем все элементы
            for (var i = 0; i < listSMashines.length; i++) {
                var machineItem = document.createElement('li');
                machineItem.innerText = "$" + listSMashines[i].startMachineMoney;
                machineItem.classList.add('casino-item');
                casinoInfoMachines.appendChild(machineItem);
            }
        }


    });
    slotMachineplay.addEventListener("click", function() {
        if (playerMoney < 10) {
            alert("Внесите деньги для начала игры");

        } else if (playerMoney > casino.startCasinoMoney / 5) {
            alert('Извините, казино закрывается на переучет ( закончились деньги:) ), про внесенные средства забудьте');
        } else {


            var game = slot.play(playerMoney);
            var gamePrize = game.prize;


            slotMachinePlayCombination.innerText = game.combination;

            // Уменьшаем количество денег в казино
            casino.startCasinoMoney -= gamePrize;
            casinoMoneyDisplay.innerText = casino.startCasinoMoney;
            if (gamePrize > startPrize) {
                alert("Извините, у автомата нет достаточно денег, чтобы выплатить ваш выигрыш, подойдите на кассу и заберите " + startPrize - gamePrize + "$");
            }
            // Уменьшаем джекпот в машине
            startPrize -= gamePrize;

            slotMachineMoney.innerText = "Максимальный приз " + startPrize + "$";

            //Обнуляем внесенные деньги
            playerMoney = 0;
            slotMachineSpendMoney.innerText = playerMoney;
            slotMachinePlayResult.innerText = gamePrize;

        }

    });

    slotMachineTakeMoney.addEventListener("click", function() {
        var howMuchMoney = document.querySelector('.prize').value;
        howMuchMoney = parseInt(howMuchMoney);
        if (howMuchMoney <= startPrize) {
            slot.getMoney(howMuchMoney);
            casino.startCasinoMoney -= howMuchMoney;
            casinoMoneyDisplay.innerText = casino.startCasinoMoney;
            startPrize -= howMuchMoney;
            slotMachineMoney.innerText = "Максимальный приз " + startPrize + "$";
            realMoney += howMuchMoney;
            casinoMoneyDisplay2.innerText = realMoney;
        } else {
            alert("В автомате нет такой суммы денег");

        }

    });
    slotMachineTakePrize.addEventListener("click", function() {
        slotMachinePlayResult.innerText = '0';
    })


});

 // Playing with DOM

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
     slotMachinespendMoney = document.querySelector('.table-money_display'),
     slotMachinePut_money = document.querySelector('.put_money'),
     slotMachineplay = document.querySelector('.play'),
     slotMachinePlayCombination = document.querySelector('.machine-item_combination'),
     slotMachinePlayResult = document.querySelector('.machine-item_prize'),
     howMuchMoney = document.querySelector('.prize');

 // Casino
 playCasino.addEventListener('click', function() {
     // Обьявляем доступные на руках деньги
     var realMoney = 0;

     // Список машин в дом дереве
     var listItems = document.querySelectorAll('.casino-item');
     // если список машин существует - удаляем его
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
     refreshMachinesListDom();
     // Отображаем скрытые блоки
     hidden[0].style.display = 'block';
     hidden[1].style.display = 'block';
     //Добавляем машину
     casinoAddMachine.addEventListener('click', function() {
         casino.addMachine();
         casinoMachines.innerText = casino.totalMachines();
         refreshMachinesListDom();
         refreshMaxPrizeOfSlot();

     });
     // Удаляем машину
     casinoRemoveMachine.addEventListener("click", function() {
         var numberOfRemoveItem = prompt("Enter number of machine to remove");
         numberOfRemoveItem = Math.floor(numberOfRemoveItem);

         if (numberOfRemoveItem <= listSMashines.length && numberOfRemoveItem >= 1 && numberOfRemoveItem !== numberOfMachine + 1) {
             if (numberOfRemoveItem === numberOfMachine + 1) {
                 alert("Ты не можешь удалить активную машину")
             }
             casino.removeMachine(numberOfRemoveItem);
             refreshMachinesListDom();


             // Обновили надпись о максимальном призе в слотмашине
             if (numberOfMachine + 1 > numberOfRemoveItem) { // если ее индекс больше индекса удаляемого элемента - уменьшаем его на 1

                 numberOfMachine--;
             }

             refreshMaxPrizeOfSlot();
             slotMachineNumber.innerText = numberOfMachine + 1; // Обновляем номер машины

         } else {
             prompt("Enter number of machine to remove less or equal " + listSMashines.length);
         }
     });
     // Выводим деньги с казино
     casinoTakeMoney.addEventListener("click", function() {
         var askNumber = prompt("How much money do you want to take?");
         if (askNumber <= casino.startCasinoMoney) {
             casino.getMoney(askNumber);
             realMoney = askNumber;
             casinoMoneyDisplay.innerText = casino.startCasinoMoney;
             casinoMoneyDisplay2.innerText = realMoney;

             refreshMachinesListDom();
             refreshMaxPrizeOfSlot();
         }
     });


     // Создаем текущую слотмашину
     var slot = listSMashines[numberOfMachine];
     refreshMaxPrizeOfSlot(); // загружаем данные машины - номер и деньги
     var playerMoney = 0; // Внесенные игроком деньги 
     slotMachinespendMoney.innerText = playerMoney;

     // Кнопка - закинуть деньги
     slotMachinePut_money.addEventListener("click", function() {
         var moneyForGame = prompt("Минимальная сумма взноса равна $ 10, сколько ты готов потратить?", "50");
         moneyForGame = parseInt(moneyForGame);
         if (moneyForGame < 10 || isNaN(moneyForGame)) {
             alert("Внесите минимум 10$");
             return

         } else if (moneyForGame > casino.startCasinoMoney / 5) {
             alert('Извините, казино закрывается на переучет, заберите деньги нажав на кнопку "Забрать выигрыш"');
             howMuchMoney.value = moneyForGame;
             moneyForGame = 0;
             playerMoney = 0;
             return
         } else {
             slot.setMoney(moneyForGame);
             playerMoney += moneyForGame;
             slotMachinespendMoney.innerText = playerMoney;
             casino.startCasinoMoney += Number(moneyForGame);
             casinoMoneyDisplay.innerText = casino.startCasinoMoney;
             startPrize += moneyForGame;
             slotMachineMoney.innerText = "Максимальный приз " + startPrize + "$";

             refreshMachinesListDom();
             refreshMaxPrizeOfSlot();

         }

     });
     // Игра
     slotMachineplay.addEventListener("click", function() {
         if (playerMoney < 10) {
             alert("Внесите деньги для начала игры");

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
             slotMachinespendMoney.innerText = playerMoney;
             slotMachinePlayResult.innerText = gamePrize;
         }

     });
     //  Вывести деньги с машины
     slotMachineTakeMoney.addEventListener("click", function() {

         howMuchMoney = howMuchMoney.value;
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
     // Забрать выиграный приз
     slotMachineTakePrize.addEventListener("click", function() {
         slotMachinePlayResult.innerText = '0';
         if (howMuchMoney.value !== 0) {
             howMuchMoney.value = 0;
         }
     })


     // Обновляем список машин в казино
     function refreshMachinesListDom() {

         // eсли список машин существует - его удалить
         listItems = document.querySelectorAll('.casino-item');
         if (listItems) {
             for (var i = 0; i < listItems.length; i++) {
                 listItems[i].remove();
             }
         }
         // обновляем список машин в дом дереве
         for (var i = 0; i < listSMashines.length; i++) {
             var machineItem = document.createElement('li');
             machineItem.innerText = "$" + listSMashines[i].startMachineMoney;
             machineItem.classList.add('casino-item');
             casinoInfoMachines.appendChild(machineItem);

         }
     }

     function refreshMaxPrizeOfSlot() {
         // Обновили надпись о максимальном призе в слотмашине
         slotMachineMoney.innerText = "Максимальный приз " + listSMashines[numberOfMachine].startMachineMoney + "$";
         startPrize = listSMashines[numberOfMachine].startMachineMoney;
     }


 });

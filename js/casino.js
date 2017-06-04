function Casino(slotMachines, startCasinoMoney) {
    this.slotMachines = slotMachines;
    this.startCasinoMoney = startCasinoMoney;
    var me = this;
    var machinesArr = [];
    this.machineList = machinesArr;

    this.setProperties = function(slotMachines, startCasinoMoney) {
        slotMachines = me.SlotMachines, 
        startCasinoMoney = me.startCasinoMoney
    }
    this.getProperties = function() {
        return {
            SlotMachines: me.SlotMachines,
            startCasinoMoney: me.startCasinoMoney
        }
    }
    var addSlotMashines = function() {

        var moneyForOneMashine = Math.floor(me.startCasinoMoney / me.slotMachines); // Денег на одну машину в среднем

        // Создаем   машины
        for (var i = 0; i < +me.slotMachines; i++) {

            var slotMachine = new SlotMachine(moneyForOneMashine);
            machinesArr.push(slotMachine);
        }

        var remainder = Math.floor(me.startCasinoMoney - moneyForOneMashine * me.slotMachines); //Остаток
        machinesArr[0].startMachineMoney += +remainder; // добавляем остаток первой машине

        var randomLuckyMachine = Math.floor(Math.random() * machinesArr.length); // номер удачной машине
        machinesArr[randomLuckyMachine].lucky = true; // задаем ей свойство

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

        // проходим по списку, определяем  машину с максимальной суммой денег и ее индекс
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
            machinesArr.splice(currentNumber, 1); // удаляем указанную машину
            var avarageSum = Math.floor(moneyInMashine / machinesArr.length); // находим среднюю сумму на одну машину
            // добавляем ср сумму к каждой машине
            for (var i = 0; i < machinesArr.length; i++) {
                machinesArr[i].startMachineMoney += +avarageSum;
            }
        }
        // уменьшием число машин в казино
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

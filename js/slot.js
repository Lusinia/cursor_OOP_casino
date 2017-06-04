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
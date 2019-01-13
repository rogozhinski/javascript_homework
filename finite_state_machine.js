"use strict";

let machineStack = [];

function machine(apiObj) {
    let currentMachine = machineCore(apiObj)
    machineStack.push(currentMachine);
    return currentMachine;
}

// конечный автомат реализован в виде объекта, в котором собраны аттрибуты и методы
// (в этом свете он напоминает класс в ООП)
function machineCore(apiObj) {

    const machineObj = {

        currentState: apiObj.initialState,

        context: apiObj.context,

        // функция, выполняющая действия, 
        // задаваемые либо строкой, либо массивом, либо функцией
        actionExecutor(stateAction){

            switch(typeof(stateAction)){

                case('undefined'): {
                    break;
                }

                case('string'):
                    apiObj.actions[stateAction]();
                    break;

                // если действия заданы объектом, то перебираем элементы этого объекта
                case('object'):
                    Object.keys(stateAction).forEach(function(actionString){
                        // если в этом объекте есть вложенные объекты с действиями,
                        // то реккурентно вызываем все элементы в этом "слоеном" объекте
                        machineObj.actionExecutor(stateAction[actionString]);
                    });
                    break;

                case('function'):
                    stateAction();
                    break;
            };    
        },


        // модификатор состояния в контексте данной машины
        setState(newState){

            // проверка на существование состояния, в которое мы хотим перевести машину
            if (!Object.keys(apiObj.states).includes(newState)){
                const InvalidStateError = new Error('Attempt to set invalid state!');
                throw InvalidStateError;
            };

            // если есть действия для выхода из состояния, выполняем их
            if (apiObj.states[machineObj.currentState].onExit != undefined){
                machineObj.actionExecutor(apiObj.states[machineObj.currentState].onExit);
            }

            // переход как таковой
            machineObj.currentState = newState;

            // если есть действия для выхода в состояние, выполняем его
            if (apiObj.states[machineObj.currentState].onEntry != undefined){
                machineObj.actionExecutor(apiObj.states[machineObj.currentState].onEntry);
            }
        },

        // модификатор состояния в контексте данной машины
        setContext(contextObjectUpdate){
            Object.keys(contextObjectUpdate).forEach(function(key){
                machineObj.context[key] = contextObjectUpdate[key];
            });
        },


        // обработчик транзакций
        transition (transitionName, transitionObject) {

            // проверка, доступны ли транзакции для этого состояния
            if (Object.keys(apiObj.states[machineObj.currentState]).indexOf('on') == -1){
                const InvalidStateError = new Error('There\'s no transactions for current state!');
                throw InvalidTransactionError;
            }

            // проверка, существует ли указанная транзакция для данного состояния
            if (Object.keys(apiObj.states[machineObj.currentState].on).indexOf(transitionName) == -1){
                const InvalidTransitionError = new Error('Invalid transition name!');
                throw InvalidTransitionError;
            }

            // если сервис указан, то обрабатываем его
            if (apiObj.states[machineObj.currentState].on[transitionName].service !== undefined){
                apiObj.states[machineObj.currentState].on[transitionName].service()
            }
            // иначе присваиваем машине состояние из графы target
            else {machineObj.setState(apiObj.states[machineObj.currentState].on[transitionName].target)};
             
            machineStack.pop();
        },     
    };    
    return machineObj;
};


// определяет машину и выдает текущее состояние вместе с функцией, 
// "готовой" изменить состояние для данной машины
function useState(){
    let currentMachine = machineStack[machineStack.length - 1];
    return [currentMachine.currentState, currentMachine.setState];
};


// определяет машину и выдает текущий контекст вместе с функцией, 
// "готовой" изменить контекст для данной машины
function useContext(){
    let currentMachine = machineStack[machineStack.length - 1];
    return [currentMachine.context, currentMachine.setContext];
};

module.exports.machine = machine;
module.exports.useState = useState;
module.exports.useContext = useContext;

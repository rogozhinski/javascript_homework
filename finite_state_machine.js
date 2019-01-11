"use strict";

function machine(apiObj) {

    let machineObject = {

        currentState: apiObj.initialState,

        context: apiObj.context,

        // функция, выполняющая действия, 
        // задаваемые либо строкой, либо массивом, либо функцией
        actionExecutor(stateAction){

            let localStack = []; //ДОБАВИТЬ СТЕК

            if (stateAction === undefined){return 0;};

            switch(typeof(stateAction)){
                case('string'):
                    apiObj.actions[stateAction]();
                    break;

                case('object'):
                    stateAction.forEach(function(actionString){
                        localStack.push(); //подумать
                        actionExecutor(actionString);
                    });
                    break;

                case('function'):
                    stateAction();
                    break;
            };    
        },

        setState(newState){

            if (Object.keys(apiObj.states).indexOf(newState) == -1){
                throw ('Error: Attempt to set invalid state!');
            };

            machineObject.actionExecutor(apiObj.states[machineObject.currentState].onExit);
            machineObject.currentState = newState;
            machineObject.actionExecutor(apiObj.states[machineObject.currentState].onEntry);
        },

        setContext(contextObjectUpdate){
            Object.keys(contextObjectUpdate).forEach(function(key){
                machineObject.context[key] = contextObjectUpdate[key];
            });
        },

        transition (transitionName, transitionObject) {
            // проверка, доступны ли транзакции для этого состояния
            if (Object.keys(apiObj.states[currentState]).indexOf('on') == -1){
                throw ('Error: There\'s no transactions for current state!')
            }
            // проверка, существует ли указанная транзакция для данного состояния
            if (Object.keys(apiObj.states[currentState].on).indexOf(transitionName) == -1){
                throw ('Error: Invalid transition name!')
            }
            if (transitionObject != undefined){
                //apiObj.states[machineObject.currentState].on[transitionName].service;  
            }
            machineObject.setState(apiObj.states[machineObject.currentState].on[transitionName].target)
        },     
    };    
    return machineObject;
};

function useState(){

    return [context, setContext];
};

function useContext(){

    return [state, setState];
};


// machine — создает инстанс state machine (фабрика)
const vacancyMachine = machine({
    // У каждого может быть свой id
    id: 'vacancy',
    // начальное состояние
    initialState: 'notResponded',
    // дополнительный контекст (payload)
    context: {id: 123},
    // Граф состояний и переходов между ними
    states: {
      // Каждое поле — это возможное состоение
        responded: {
        // action, который нужно выполнить при входе в это состояние. Можно задавать массивом, строкой или функцией
            onEntry: 'onStateEntry'
          },
        notResponded: {
        // action, который нужно выполнить при выходе из этого состояния. Можно задавать массивом, строкой или функцией                         
            onExit() {
                console.log('we are leaving notResponded state');
              },
        // Блок описания транзакций
            on: {
          // Транзакция
                RESPOND: {
            // упрощенный сервис, вызываем при транзакции
                    service: (event) => {
              // Позволяет получить текущий контекст и изменить его
                        const [context, setContext] = useContext()			
              // Позволяет получить текущий стейт и изменить его
                        const [state, setState] = useState();
              // Поддерживаются асинхронные действия
                        window.fetch({method: 'post', data: {resume: event.resume, vacancyId: context.id} }).then(() => {
                // меняем состояние
                            setState('responded');
                // Мержим контекст
                            setContext({completed: true}); // {id: 123, comleted: true}
                        });
                    },
            // Если не задан сервис, то просто переводим в заданный target, иначе выполняем сервис.
                    // target: 'responded'
                }
            }
        },		
    },
    // Раздел описание экшенов 
    actions: {
        onStateEntry: (event) => {
            const [state] = useState();
            console.log('now state is ' + state);
        },
          /*makeResponse: (event) => {
              // both sync and async actions
              const [contex, setContext] = useContext()			
              window.fetch({method: 'post', data: {resume: event.resume, vacancyId: context.id} })
        }*/
    }
})
  
//  Пример использования StateMachine
console.log(vacancyMachine.transition('RESPOND', {resume: {name: 'Vasya', lastName: 'Pupkin'}}));

vacancyMachine.setContext({name: 'cock'});
vacancyMachine.setState('responded');

console.log(vacancyMachine.context, vacancyMachine.currentState);
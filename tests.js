"use strict";

var assert = require("assert");

// изначальная конструкция "import" заменена более "традиционной" конструкцией
// "required" из соображений поддержки версий языка
// (мой Node.js пока про "import from" не узнал)
const FSM = require('./finite_state_machine.js');
const machine = FSM.machine;
const useState = FSM.useState;
const useContext = FSM.useContext;

// ТЕСТИРОВАНИЕ

console.log("1. ИЗНАЧАЛЬНЫЙ ПРИМЕР");

const vacancyMachine1 = machine({
    id: 'vacancy',
    initialState: 'notResponded',
    context: {id: 123},
    states: {
        responded: {
            onEntry: 'onStateEntry'
          },
        notResponded: {
            onExit() {
                console.log('we are leaving notResponded state');
              },
            on: {
                RESPOND: {
                    service: (event) => {
                        const [context, setContext] = useContext();			
                        const [state, setState] = useState();
                        // Доступно только при работе в браузере
                        // window.fetch({method: 'post', data: {resume: event.resume, vacancyId: context.id} }).then(() => {
                            setState('responded');
                            setContext({completed: true}); // {id: 123, comleted: true}
                        // });
                    },
                }
            }
        },		
    },
    actions: {
        onStateEntry: (event) => {
            const [state] = useState();
            console.log('now state is ' + state);
        },
    }
})
  
//  Запуск
console.log("Результат:")
vacancyMachine1.transition('RESPOND', {resume: {name: 'Vasya', lastName: 'Pupkin'}});
assert(vacancyMachine1.currentState, 'responded', 'Fail in test 1: wrong state');
assert(vacancyMachine1.context.id == '123', 'Fail in test 1: wrong id');
assert(vacancyMachine1.context.completed == true, 'Fail in test 1: wrong \"completed\"');

/////////////////////////////////////////////////////////////////////////////////////

console.log("2. ПОПЫТКА ПРОЙТИ ЧЕРЕЗ ТРАНЗАКЦИЮ В НЕСУЩЕСТВУЮЩЕЕ СОСТОЯНИЕ \"dropped\"");


const vacancyMachine2 = machine({
    id: 'vacancy',
    initialState: 'notResponded',
    context: {id: 123},
    states: {
        responded: {
            onEntry: 'onStateEntry'
        },
        notResponded: {
            onExit() {
                console.log('we are leaving notResponded state');
            },
            on: {
                RESPOND: {
                    target: 'dropped'
                },
            }
        }
    },		
    actions: {
    }
});


try {vacancyMachine2.transition('RESPOND', {resume: {name: 'Vasya', lastName: 'Pupkin'}})}
catch (InvalidStateError) {console.log('Error: Attempt to set invalid state!\n')}


/////////////////////////////////////////////////////////////////////////////////////

console.log("3. ПОПЫТКА ПРОЙТИ ЧЕРЕЗ НЕСУЩЕСТВУЮЩУЮ ТРАНЗАКЦИЮ \"LOST_TRANSACTION\"");


const vacancyMachine3 = machine({
    id: 'vacancy',
    initialState: 'notResponded',
    context: {id: 123},
    states: {
        responded: {
            onEntry: 'onStateEntry'
        },
        notResponded: {
            onExit() {
                console.log('we are leaving notResponded state');
            },
            on: {
                RESPOND: {
                    target: 'dropped'
                },
            }
        }
    },		
    actions: {
    }
});

try {vacancyMachine3.transition('LOST_TRANSACTION', {resume: {name: 'Vasya', lastName: 'Pupkin'}})}
catch (InvalidTransactionError) {console.log('Error: Attempt to set invalid state!\n')}


/////////////////////////////////////////////////////////////////////////////

console.log("4. ВЛОЖЕННЫЕ КОНЕЧНЫЕ АВТОМАТЫ");

const vacancyMachine4 = machine({
    id: 'vacancy',
    initialState: 'notResponded',
    context: {id: 123},
    states: {
        responded: {
            onEntry: 'onStateEntry'
          },
        notResponded: {
            onExit() {
                console.log('we are leaving notResponded state');
              },
            on: {
                RESPOND: {
                    service: (event) => {
                        const [context, setContext] = useContext();			
                        const [state, setState] = useState();
                            setState('responded');
                            setContext({completed: true});
                    },
                }
            }
        },		
    },
    actions: {
        onStateEntry: (event) => {
            const [state] = useState();
            console.log('now state is ' + state);
            console.log('(описываем и запускаем вложенный автомат)');

            const vacancyMachine_inner = machine({
                id: 'vacancy',
                initialState: 'notResponded',
                context: {id: 123},
                states: {
                    responded: {
                        onEntry: 'onStateEntry'
                      },
                    notResponded: {
                        onExit() {
                            console.log('we are leaving notResponded state (inner)');
                          },
                        on: {
                            RESPOND: {
                                service: (event) => {
                                    const [context, setContext] = useContext();			
                                    const [state, setState] = useState();
                                        setState('responded');
                                        setContext({completed: true});
                                }
                            }
                        }
                    }		
                },
                actions: {
                    onStateEntry: (event) => {
                        const [state] = useState();
                        console.log('now state is ' + state + ' (inner)');
                    }
                }
            });
            vacancyMachine_inner.transition('RESPOND', {resume: {name: 'Vasya', lastName: 'Pupkin'}});
            assert(vacancyMachine_inner.currentState == 'responded', 'Fail in test 4: wrong state of inner machine' )
            assert(vacancyMachine_inner.context.id == '123', 'Fail in test 4: wrong id of inner machine');
            assert(vacancyMachine_inner.context.completed == true, 'Fail in test 4: wrong \"completed\" of inner machine');
        }
    }
})
  
//  Запуск
vacancyMachine4.transition('RESPOND', {resume: {name: 'Vasya', lastName: 'Pupkin'}});
assert(vacancyMachine4.currentState == 'responded', 'Fail in test 4: wrong state' )
assert(vacancyMachine4.context.id == '123', 'Fail in test 4: wrong id');
assert(vacancyMachine4.context.completed == true, 'Fail in test 4: wrong \"completed\"');

/////////////////////////////////////////////////////////////////////////////////////

console.log("5. \"ПЁСТРО\" ЗАДАННЫЕ ДЕЙСТВИЯ: И ФУНКЦИИ, И ВЛОЖЕННЫЕ ОБЪЕКТЫ, И СТРОКИ");


const vacancyMachine5 = machine({
    id: 'vacancy',
    initialState: 'notResponded',
    context: {id: 123},
    states: {
        theStateAfterNestedActions: {
            onEntry: 'onStateEntry'
        },
        responded: {
            onEntry: 'onStateEntry'
        },
        notResponded: {
            onExit: {
                onExitInnerString: 'onExitInnerString',
                onExitInnerObject:{
                    onExitInnerFunction() {
                        console.log('onExitInnerFunction run');
                    },
                    onExitVeryInnerString: 'onExitVeryInnerString'
                }
            },
            on: {
                RESPOND: {
                    target: 'responded'
                },
            }
        }
    },		
    actions: {
        onStateEntry: (event) => {
            console.log('onStateEntry run')
        },
        onExitInnerString: () => {console.log('onExitInnerString run')},
        onExitVeryInnerString: () => {
            console.log('onExitVeryInnerString run');
            const [state, setContext] = useContext();
            setContext({NestedActions: 'done'});
        }
    }
});

vacancyMachine5.transition('RESPOND', {resume: {name: 'Vasya', lastName: 'Pupkin'}});
assert(vacancyMachine5.context.NestedActions == 'done', 'Fail in test 5: wrong state' )

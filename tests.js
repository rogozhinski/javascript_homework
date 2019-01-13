"use strict";

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
console.log("current state: ", vacancyMachine1.currentState, "\ncurrent context: ", vacancyMachine1.context, "\n")
//we are leaving notResponded state
//now state is responded
//current state:  responded 
//current context:  { id: 123, completed: true }


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

console.log("Результат:")
try {vacancyMachine2.transition('RESPOND', {resume: {name: 'Vasya', lastName: 'Pupkin'}})}
catch (InvalidState) {console.log('Error: Attempt to set invalid state!\n')}

//we are leaving notResponded state
//now state is responded
//current state:  responded 
//current context:  { id: 123, completed: true }

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

console.log("Результат:")
try {vacancyMachine3.transition('LOST_TRANSACTION', {resume: {name: 'Vasya', lastName: 'Pupkin'}})}
catch (InvalidTransaction) {console.log('Error: Attempt to set invalid state!\n')}


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
                                        setContext({completed: true}); // {id: 123, comleted: true}
                                    // });
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
            console.log("current state (inner): ", vacancyMachine_inner.currentState, 
            "\ncurrent context(inner): ", vacancyMachine_inner.context, "\n")
        }
    }
})
  
//  Запуск
console.log("Результат:")
vacancyMachine4.transition('RESPOND', {resume: {name: 'Vasya', lastName: 'Pupkin'}});
console.log("current state: ", vacancyMachine4.currentState, "\ncurrent context: ", vacancyMachine4.context, "\n")
//we are leaving notResponded state
//now state is responded
//current state:  responded 
//current context:  { id: 123, completed: true }

/////////////////////////////////////////////////////////////////////////////////////

console.log("5. \"ПЁСТРО\" ЗАДАННЫЕ ДЕЙСТВИЯ: И ФУНКЦИИ, И ВЛОЖЕННЫЕ ОБЪЕКТЫ, И СТРОКИ");


const vacancyMachine5 = machine({
    id: 'vacancy',
    initialState: 'notResponded',
    context: {id: 123},
    states: {
        responded: {
            onEntry: 'onStateEntry'
        },
        notResponded: {
            onExit: {
                onExitInnerString: 'onExitInnerString',
                onExitInnerObject:{
                    onExitInnerFunction() {console.log('onExitInnerFunction run')},
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
            const [state] = useState();
            console.log('onStateEntry run')
        },
        onExitInnerString: () => (console.log('onExitInnerString run')),
        onExitVeryInnerString: () => (console.log('onExitVeryInnerString run'))
    }
});

console.log("Результат:");
vacancyMachine5.transition('RESPOND', {resume: {name: 'Vasya', lastName: 'Pupkin'}});

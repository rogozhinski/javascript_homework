let notResponded = {
    // action, который нужно выполнить при выходе из этого состояния. Можно задавать массивом, строкой или функцией                         
          onExit: () => {
              console.log('we are leaving notResponded state');
          },
    // Блок описания транзакций
          on: 'cock'
};

console.log(typeof(notResponded.onExit));
// активирует селект при клике на него
document.getElementsByClassName('input-wrapper')[0].onclick = () => selectMachine.actions.setActive ();

// сбрасывает активность селекта при клике мимо него
document.addEventListener('click', e => {
    const target = e.target;
    if ((target !== document.getElementsByClassName('input')[0])
    && (target !== document.getElementsByClassName('input-wrapper')[0])
    && (target !== document.getElementsByClassName('drop-variants-button')[0])){
        selectMachine.actions.setIdle();
    }
});

// при удалении элементов из инпута
document.getElementsByClassName('input')[0].addEventListener('keydown', function(e) {
    if (e.keyCode==8){
        selectMachine.input = selectMachine.input.slice(0, -1);
    }
    if (selectMachine.input !== '') {
        console.log(selectMachine.input)
        selectMachine.actions.searchForVariants(selectMachine.input)
    }
});

// при нажатии клавиш в input'e...
document.getElementsByClassName('input')[0].addEventListener('keypress', function(e) {
    let inputValue = document.getElementsByClassName('input')[0].value;
    selectMachine.input = inputValue + String.fromCharCode(e.keyCode);
    console.log(selectMachine.input, " selectMachine.input")
    // нажали enter, то выбираем введенное значение
    if (e.keyCode === 13 && inputValue !== "") {
        selectMachine.actions.setValue(inputValue);
        // очищаем предыдущий сет в селекте, если там что-то есть
        document.getElementsByClassName('variant-set')[0].innerHTML = '';
        document.getElementsByClassName('input')[0].value = '';
    } else {
    // if (selectMachine.input != inputValue){ 
    // если что-то другое, то запускаем поиск по городам
        selectMachine.actions.searchForVariants(inputValue); 
    }
})

// при клике на один из вариантов он помещается в строку мультиселекта
document.addEventListener('click', e => {
    const target = e.target;
    if (target.className == 'variant' && target.innerHTML !== 'Type to search'){
        selectMachine.actions.setValue([target.innerHTML]);
    }
});

// если кликнуть на крестик у выбранного варианта, тот удалится 
document.addEventListener('click', e => {
    const target = e.target;
    if (target.className.includes('bloko-icon_cancel')){
        var parent = target.parentElement;
        parent.parentNode.removeChild(parent);
    }
});
    



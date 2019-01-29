// активирует селект при клике на него
document.getElementsByClassName('input-wrapper')[0].onclick = () => {
    document.getElementsByClassName('input')[0].focus();
    selectMachine.actions.setActiveInput();
};

// при нажатии esc выходим в состояние idle
document.addEventListener('keydown', function(e) {
    if (e.keyCode === 27) {
        selectMachine.actions.setIdle();
        document.getElementsByClassName('input')[0].blur()
    }
});

document.addEventListener('keydown', function(e) {

    // при нажатии backspace
    if (e.keyCode === 8){
        selectMachine.input = selectMachine.input.slice(0, -1);
    }
    
    // если кликнуть на стрелку вниз при активном состоянии и имеющихся вариантах,
    // то откроется возможность навигации по вариантам в помощью стрелочек "вверх" и "вниз"
    if (e.keyCode === 40 && document.getElementsByClassName('variant').length !== 0){
        if(document.getElementsByClassName('variant-set')[0].children[0].innerHTML !== 'Type to write'){
        selectMachine.actions.pointerDown();
        }
    }

    //кликнем вверх
    if (e.keyCode === 38 && document.getElementsByClassName('variant').length !== 0){
        if(document.getElementsByClassName('variant-set')[0].children[0].innerHTML !== 'Type to write'){
        selectMachine.actions.pointerUp(); 
        }
    }    

    // ищем новые варианты
    if (selectMachine.input !== '') {
        selectMachine.actions.searchForVariants(selectMachine.input)
    }
    
});

//при нажатии клавиш в input'e...
document.addEventListener('keypress', function(e) {
    let inputValue = document.getElementsByClassName('input')[0].value;
    const charset = 'qwertyuiopasdfghjklzxcvbnmёйцукенгшщзхъфывапролджэячсмитьбю';
    if (charset.includes(String.fromCharCode(e.keyCode).toLowerCase())){
        selectMachine.input = inputValue + String.fromCharCode(e.keyCode);
    }else{
        selectMachine.input = inputValue
    }
    // нажали enter, то выбираем введенное значение
    if (e.keyCode === 13 && inputValue !== "") {
        if (selectMachine.state === 'activeInput'){
            selectMachine.actions.setValue(inputValue);
            // очищаем предыдущий сет в селекте, если там что-то есть
            document.getElementsByClassName('variant-set')[0].innerHTML = '';
            document.getElementsByClassName('input')[0].value = '';
        } else {
        // if (selectMachine.input != inputValue){ 
        // если что-то другое, то запускаем поиск по городам
            selectMachine.actions.searchForVariants(inputValue); 
        }
        if (selectMachine.state === 'activePointer'){
            selectMachine.actions.setValue(
                document.getElementsByClassName('variant-set')[0].children[
                    selectMachine.focusedVariantNum - 1].innerHTML);
        }
    }
})


document.addEventListener('click', e => {
    const target = e.target;

// сбрасывает активность селекта при клике мимо него
    if ((target !== document.getElementsByClassName('input')[0])
    && (target !== document.getElementsByClassName('input-wrapper')[0])
    && (target !== document.getElementsByClassName('drop-variants-button')[0])){
        selectMachine.actions.setIdle();
    }

// при клике на один из вариантов он помещается в строку мультиселекта
    if (target.className == 'variant' && target.innerHTML !== 'Type to search'){
        selectMachine.actions.setValue([target.innerHTML]);
    }    

// если кликнуть на крестик у выбранного варианта, тот удалится 
    if (target.className.includes('bloko-icon_cancel')){
        var parent = target.parentElement;
        parent.parentNode.removeChild(parent);
    }  
});
    



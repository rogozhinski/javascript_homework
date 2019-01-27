// конечный автомат
let selectMachine = {
    
    state: 'idle',

    input: '',

    actions: {

        // в случае активации селекта
        setActive: (variantStack) => {
            if (selectMachine.state === 'idle'){
                let droppingColumn = document.createElement('div');
                droppingColumn.className = 'variant-set';
                document.getElementsByClassName('field')[0].appendChild(droppingColumn);
                // заполняем список возможными вариантами (или плейсхолдером)
                selectMachine.actions.setVariants(['Type to search'])
                // document.getElementsByClassName('field')[0].appendChild(droppingColumn);
                selectMachine.state = 'active';
            }
        },

        // формируем заполненный вариантами или плейсхолдером селект
        setVariants: (variantsArray) => {
            if (variantsArray !== "") {
                // очищаем предыдущий сет в селекте, если там что-то есть
                document.getElementsByClassName('variant-set')[0].innerHTML = '';
                // заполняем новый cет
                variantsArray.forEach(function(variant){
                    let droppingVariant = document.createElement('div');
                    droppingVariant.innerHTML = variant;
                    droppingVariant.className = 'variant';
                    document.getElementsByClassName('variant-set')[0].appendChild(droppingVariant);
                })
            }
        },

        // ищет варианты по запросу и заносит их в выпадающий селект
        searchForVariants: (inputValue) => {
            window.fetch("https://api.hh.ru/suggests/areas?text=\"" + inputValue + "\"")
            .then (function(response) {return response.json()}) 
            .then (function(jsonResponse) {return jsonResponse.items})
            .then (function(items) {
                let variantsArray = []
                items.forEach((variantObj) => {variantsArray.push(variantObj.text)})
                selectMachine.actions.setVariants(variantsArray)})
        },

        // в случае деактивации селекта
        setIdle: () => {
            if (selectMachine.state === 'active'){
                document.getElementsByClassName('variant-set')[0].remove();
                selectMachine.state = 'idle';
            }   
        },

        // запись значения в мультиселект
        setValue: (selectedVariant) => {
            // создадим обертку для выбранного варианта
            let selectedVariantWrapper = document.createElement('div');
            selectedVariantWrapper.className = 'selected-variant';
            
            // создадим блок для самого варианта
            let selectedVariantDiv = document.createElement('div');
            selectedVariantDiv.innerHTML = selectedVariant;

            //создадим кнопку для удаления варианта
            let deleteVariantDiv = document.createElement('div');
            deleteVariantDiv.className = "delete-variant bloko-icon_24 bloko-icon_cancel";

            selectedVariantWrapper.appendChild(selectedVariantDiv);
            selectedVariantWrapper.appendChild(deleteVariantDiv);

            // просто вставим созданную обертку с выбранным значением в поле инпута
            document.getElementsByClassName('input-wrapper')[0].
                insertBefore(selectedVariantWrapper, 
                    document.getElementsByClassName('input-wrapper')[0].children[
                        document.getElementsByClassName('input-wrapper')[0].children.length - 1
                    ]);
            document.getElementsByClassName('input')[0].value = "";
        }
    }
};


let CurrencyConverter = function() {
	
	let converterContent;
	let converterContentOutput;
	let converterContentFormBaseSelect;
	let converterContentFormToSelect;
	let converterContentInput;

	let init = () => {
		let converterElem = document.createElement('div')
		converterElem.classList.add('converter')

			let converterTitle = document.createElement('h2')
			converterTitle.classList.add('converte__title')

			converterContent = document.createElement('div')
			converterContent.classList.add('converte__content')

				converterContentInput = document.createElement('input')
				converterContentInput.classList.add('converte__content_input')
				converterContentInput.placeholder = 'Введите сумму'
				converterContentInput.value = 1
				converterContentInput.type = 'number'

				let converterContentFormBase = document.createElement('form')
				converterContentFormBase.classList.add('converte__content_form')

					converterContentFormBaseSelect = document.createElement('select')
					converterContentFormBaseSelect.classList.add('converte__content_form_select')

				let converterContentFormTo = document.createElement('form')
				converterContentFormTo.classList.add('converte__content_form')

					converterContentFormToSelect = document.createElement	('select')
					converterContentFormToSelect.classList.add	('converte__content_form_select')

				let converterContentBtn = document.createElement('button')
				converterContentBtn.classList.add('converte__content_btn')
				converterContentBtn.addEventListener('click', () => {
					this.convertCurrency()
				})

		converterContentBtn.innerHTML = 'Рассчитать'
		converterTitle.innerHTML = 'Конвертер валют'
		
		converterContentFormTo.append(converterContentFormToSelect)
		converterContentFormBase.append(converterContentFormBaseSelect)
		converterContent.append(converterContentInput, converterContentFormBase, converterContentFormTo, converterContentBtn)

		converterElem.append(converterTitle,converterContent)
		document.body.append(converterElem);
	}

	this.getData = async () => {
		converterContentOutput = document.createElement('div')
		converterContentOutput.classList.add('converte__content_output')

		await fetch('https://api.frankfurter.dev/v1/latest?base=USD')
		.then(response => response.json())
		.then(data => {
				converterContentOutput.innerHTML = `1 USD = ${(data.rates.EUR).toFixed(2)} EUR`
		})
		converterContent.append(converterContentOutput)
	}

	this.SelectCurrency = async () => {
		try {
			converterContentFormBaseSelect.innerHTML = ''
			converterContentFormToSelect.innerHTML = ''

			let response = await fetch('https://api.frankfurter.dev/v1/currencies')
			let data = await response.json()
			
			for (let currencyCode in data) {
					if (data.hasOwnProperty(currencyCode)) {

							let baseOption = document.createElement('option')
							baseOption.value = currencyCode
							baseOption.textContent = `${currencyCode} - ${data[currencyCode]}`
							converterContentFormBaseSelect.appendChild(baseOption)
							
							let toOption = document.createElement('option')
							toOption.value = currencyCode
							toOption.textContent = `${currencyCode} - ${data[currencyCode]}`
							converterContentFormToSelect.appendChild(toOption)
					}
			}
			converterContentFormBaseSelect.value = 'USD'
			converterContentFormToSelect.value = 'EUR'
		} catch (error) {
				console.error('Ошибка загрузки валют:', error)
		}
	}

	this.convertCurrency = async () => {
		let amount = converterContentInput.value
		let baseCurrency = converterContentFormBaseSelect.value
		let toCurrency = converterContentFormToSelect.value

		if (!amount || amount <= 0) {
			alert('Пожалуйста, введите корректное число')
			return
		}

		if (baseCurrency === toCurrency) {
			alert('Пожалуйста, выберите разные валюты')
			return
		}

		try {
			let response = await fetch(`https://api.frankfurter.dev/v1/latest?amount=${amount}&base=${baseCurrency}&symbols=${toCurrency}`)
			let data = await response.json()

			if (amount > 1) {
			converterContentOutput.innerHTML = 
			`
				${amount} ${baseCurrency} = ${data.rates[toCurrency]} ${toCurrency}
      	<br>Курс: 1 ${baseCurrency} = ${(data.rates[toCurrency]/amount).toFixed(2)} ${toCurrency}
			`
			} else {
			 converterContentOutput.innerHTML = `${amount} ${baseCurrency} = ${(data.rates[toCurrency]).toFixed(2)} ${toCurrency}`
			}

		} catch (error) {
			console.error('Ошибка конвертации', error)
			converterContentOutput.innerHTML = 'Ошибка при конвертации валюты'
		}
	}


	init()
	this.SelectCurrency()
	this.getData()
}

window.addEventListener('load', () => {
	new CurrencyConverter()
})

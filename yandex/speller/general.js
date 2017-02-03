/**
 * Created by Created by PhpStorm.
 *
 * @author Соловейчик Тимофей <timofey@1september.ru>/<T-Soloveychik@ya.ru>
 *
 * @version 2015-03-14 8:16
 *
 * @copyright Timofey - 1september 2014
 *
 * @see https://tech.yandex.ru/speller/doc/dg/reference/checkText-docpage/
 * @see https://tech.yandex.ru/speller/doc/dg/reference/speller-options-docpage/
 * @see https://tech.yandex.ru/speller/doc/dg/reference/error-codes-docpage/
 */

var aceHelpers = window.aceHelpers || {};

aceHelpers.yandex = {};
aceHelpers.yandex.speller = {};



// Пропускать слова, написанные заглавными буквами, например, "ВПК".
aceHelpers.yandex.speller.IGNORE_UPPERCASE = 1; // 0x0001

// Пропускать слова с цифрами, например, "авп17х4534".
aceHelpers.yandex.speller.IGNORE_DIGITS = 2; // 0x0002

// Пропускать интернет-адреса, почтовые адреса и имена файлов.
aceHelpers.yandex.speller.IGNORE_URLS = 4; // 0x0004

// Подсвечивать повторы слов, идущие подряд. Например, "я полетел на на Кипр".
aceHelpers.yandex.speller.FIND_REPEAT_WORDS = 8; // 0x0008

// Пропускать слова, написанные латиницей, например, "madrid".
aceHelpers.yandex.speller.IGNORE_LATIN = 16; // 0x0010

// Только проверять текст, не выдавая вариантов для замены.
aceHelpers.yandex.speller.NO_SUGGEST = 32; // 0x0020

// Отмечать слова, написанные латиницей, как ошибочные.
aceHelpers.yandex.speller.FLAG_LATIN = 128; // 0x0080

// Не использовать словарное окружение (контекст) при проверке. Опция полезна в случаях, когда на вход сервиса передается список отдельных слов.
aceHelpers.yandex.speller.BY_WORDS = 256; // 0x0100

// Игнорировать неверное употребление ПРОПИСНЫХ/строчных букв, например, в слове "москва".
aceHelpers.yandex.speller.IGNORE_CAPITALIZATION = 512; // 0x0200

// Игнорировать римские цифры ("I, II, III, ...").
aceHelpers.yandex.speller.IGNORE_ROMAN_NUMERALS = 2048; // 0x0800





/**
 * @see https://tech.yandex.ru/speller/doc/dg/reference/error-codes-docpage/
 */
aceHelpers.yandex.speller.getMarksClasses = function  ()
{
	return [
		  // 1 - ERROR_UNKNOWN_WORD
		  // Слова нет в словаре
		  "ace-helpers-yandex-misspelled"

		  // 2 - ERROR_REPEAT_WORD
		  // Повтор слова
		, "ace-helpers-yandex-misspelled-double"

		  // 3 - ERROR_CAPITALIZATION
		  // Неверное употребление прописных и строчных букв
		, "ace-helpers-yandex-misspelled-cap"

		  // 4 - ERROR_TOO_MANY_ERRORS
		  // Текст содержит слишком много ошибок. При этом приложение может отправить Яндекс.Спеллеру оставшийся непроверенным текст в следующем запросе
		, "ace-helpers-yandex-misspelled-many"
	];
};





aceHelpers.yandex.speller.replaceHtml = function (text)
{
	function getEmptyStringByLength (length)
	{
		var string = "";
		for (var i = 0; i < length; i++)
		{
			string += " ";
		}

		return string;
	}

	function getStringReplacer (textPart)
	{
		var strReplace = getEmptyStringByLength(textPart.length);

		var find, pattern, count = 0;

		var regexp = /((?:title|placeholder|alt)\s*=\s*((?:\\)*(?:'|")))([\2]*)\2/miyu;

		while (find = regexp.exec(textPart))
		{
			var msg = "Found " + find[0] + ".  ";

			msg += "Next match starts at " + pattern.lastIndex;

			document.getElementsByTagName("body")[0].ineerHTML += msg;

			strReplace = strReplace.substr(0 ,find.length + regexp.lastIndex);

			strReplace += find[3];

			strReplace += strReplace.substr(find.index + find.length + regexp.lastIndex);
		}

		if (!strReplace)
			strReplace = "";

		return strReplace;
	}

	/**
	 * Без HTML-я
	 */
	var matches = text.match(/<[^>]+>/mig);
	if (matches)
		for (var mn = 0; mn < matches.length; mn++)
		{
			text = text.replace(matches[mn] ,getStringReplacer(matches[mn]))
		}

	/**
	 * Убрать HTML сущности
	 */
	matches = text.match(/&[^;]+;/mig);
	if (matches)
		for (mn = 0; mn < matches.length; mn++)
		{
			text = text.replace(matches[mn] ,getEmptyStringByLength(matches[mn].length))
		}

	return text;
};

/**
 * Подготовить текст
 *
 * и параметры запроса
 *
 * к отправке Яндексу
 */
aceHelpers.yandex.speller.prepareText = function (button)
{
	var text = button.editor.getValue()

		/** Максимальная длина - 10`000 символов */
		, chunkLength = 10000

		/** Разделитель новой строки */
		, EOL = button.editor.getSession().getDocument().getNewLineCharacter()
		, start = 0
		, length = 0
		, row = 0
		, wrapped = false

		/** Массив частей */
		, parts = {}
		, part

		/** Reg новой строки */
		, regEOL = new RegExp( EOL , "mig" )
		, splittersVar = [
			  " "
			, ","
			, "."
			, " "
		];


	/**
	 * Заменить в тексте все HTML-и и сущности
	 */
	text = aceHelpers.yandex.speller.replaceHtml(text);

	/**
	 * Пока стартовая позиция менее длины всего текста
	 */
	while (start < text.length)
	{
		/** Новая часть текста */
		part = text.substr(start ,chunkLength);

		/**
		 * Если конечная позиция части не является завершением текста
		 */
		if ((start + part.length) < text.length)
		{


			/**
			 * Первая с конца позиция переносу строки
			 */
			length = part.lastIndexOf(EOL);



			/**
			 * Если значение не найдено, то отметить, что строка будет разорвана по длине
			 */
			if (length == -1)
			{
				wrapped = true;

				/**
				 * Перебирать варианты разделителей
				 *
				 * Если будет найдено значение с конца, то завершить перебор
				 */
				for (var i = 0; i < splittersVar.length; i++)
				{
					length = part.lastIndexOf(splittersVar[i]);

					/** Завершить, установив конец участка */
					if (length != -1)
						break;
				}

			}

			/**
			 * Если найдено значение, то взять от части часть, по позиции найднно разделителя
			 *
			 * +1, чтобы захватить найденную позицию
			 */
			if (length != -1)
				part = part.substr(0 ,++length);

		}

		/** Сохранить в массив частей под значением строки начала части */
		parts[row] = part;



		/**
		 * Подготовка для следующей части
		 *
		 * Сместить вперёд позиция начала следующей части на длину данной части
		 */
		start += part.length;


		/**
		 * Если в значении строки было добавлено место разрыва,
		 *
		 * то взять только номер строки
		 */
		if (/:/.test(row))
			row = +(row.split(":")[0]);

		/**
		 * Строка, с которой будет начата следующая часть
		 *
		 * Количество новых строк в данной части
		 */
		if ( part.match( regEOL ) )
			row += part.match( regEOL ).length;

		/**
		 * Если данная часть была разорвана, то отметить
		 *
		 * с какой позиции будет начинаться следующая часть
		 *
		 * и сбросить отметку о том, что данная часть была разбита
		 */
		if (wrapped)
		{
			row = row + ":" + part.length;

			wrapped = false;
		}

	}

	return parts;
};



/**
 * Параметры к запросу на проверку
 *
 * @param {int|int[]} addOptions    Параметр для добавления
 * @param {int|int[]} removeOptions Параметр которые нужно убрать
 */
aceHelpers.yandex.speller.getSpellerOptionsSum = function (addOptions ,removeOptions)
{
	var sum =
		  aceHelpers.yandex.speller.IGNORE_UPPERCASE
		| aceHelpers.yandex.speller.IGNORE_DIGITS
		| aceHelpers.yandex.speller.IGNORE_URLS
		| aceHelpers.yandex.speller.FIND_REPEAT_WORDS
		| aceHelpers.yandex.speller.IGNORE_LATIN
		// | aceHelpers.yandex.speller.NO_SUGGEST
		| aceHelpers.yandex.speller.FLAG_LATIN
		| aceHelpers.yandex.speller.BY_WORDS
		| aceHelpers.yandex.speller.IGNORE_CAPITALIZATION
		| aceHelpers.yandex.speller.IGNORE_ROMAN_NUMERALS
	;

	var i = 0;

	/**
	 * Если указаны опции
	 */
	if (addOptions)
	{
		if (!addOptions instanceof Array)
			sum = sum|addOptions;

		else
		{
			for (i = 0; i < addOptions.length; i++)
			{
				if (addOptions.hasOwnProperty(i))
					sum = sum|addOptions[i];
			}
		}

	}

	/**
	 * Если указаны опции
	 */
	if (removeOptions)
	{
		if (!removeOptions instanceof Array)
			sum = sum^removeOptions;

		else
		{
			removeOptions = Math.summary(removeOptions);

			for (i = 0; i < removeOptions.length; i++)
			{
				if (removeOptions.hasOwnProperty(i))
					sum = sum^removeOptions[i];
			}
		}

	}

	return sum;
};





/**
 * Отправка текста в Yandex.Speller
 *
 * Если нажать Ctrl, то НЕ будет отправлен текст, но будут взяты отметки из памяти
 *
 * @param {event|XMLHttpRequest} ajaxObj
 *
 * @param {HTMLButtonElement} button
 *
 * @return false - для того, чтобы не обрабатывалось нажатие на кнопку проверки
 */
aceHelpers.yandex.speller.buttonSend = function (ajaxObj ,button)
{
	if (!button)
		swal("Внимание" ,"У передан элемент кнопки!");

	if (!button.editor)
		swal("Внимание" ,"У кнопки не указан параметр editor – поле с ACE радектором!");

	var POST = true;

	var $button = $(button);


	/**
	 * Если нажатие на кнопку проверки
	 *
	 * Запущена проверка
	 */
	if (ajaxObj instanceof Event)
	{
		ajaxObj.preventDefault();

		button = ajaxObj.target;

		/**
		 * Если нажат Ctrl, то
		 * Сохранённый запрос, без AJAX!
		 */
		if (ajaxObj.ctrlKey)
			POST = false;
		/**
		 * Иначе сбросить сохранённые ответы для запуска новых запросов
		 */
		else if (!button.partsMisspells || button.status === false)
			button.partsMisspells = {};


		/**
		 * Если в статусе проверки, то убрать и завершить выполнение
		 */
		if (button.status === true)
		{
			$button.removeClass("operator-button-activated");

			return aceHelpers.yandex.speller.removeMarks(button);
		}


		$button.addClass("operator-button-activated");


		/**
		 * Если ещё не было проверок, до создать пустые хранилища
		 */
		if (!button.ajax)
			aceHelpers.yandex.speller.removeMarks(button);


		button.status = true;

		ajaxObj.rows = [];
	}



	var text = button.editor.getValue();

	var parts = this.prepareText(text);


	/**
	 * http://api.yandex.ru/speller/doc/dg/concepts/api-overview.xml
	 */
	var params = {
		  uri: "https://speller.yandex.net/services/spellservice.json/checkText"
		, faElem: $button.find("i.fa")
		, onSuccess: function(data) {

			var responseArray = eval("(" + ajaxObj.ajax.responseText + ")");

			var button = ajaxObj.storage;

			if (responseArray)
			{
				button.partsMisspells[ajaxObj.row] = responseArray;

				aceHelpersMarkTextByYandexSpellerAnswer(responseArray ,ajaxObj.row ,button);

				/**
				 * Добавить функцию сравнения для вывода сообщений об ошибках
				 */
				//button.editor.on("changeSelection", function() {
				//	aceYandexSpellMisspelled();
				//});
			}

			/**
			 * Пока не будут отправлены все части теста, повторять
			 */
			if (aceSendTextToYandexSpeller(ajaxObj ,button))
			{
			}
			else
			{
			}
		}
	};

	for (var obj in ajaxObj.parts) if (ajaxObj.parts.hasOwnProperty(obj))
	{
		if (ajaxObj.rows.indexOf(obj) !== -1)
			continue;

		ajaxObj.rows[ajaxObj.rows.length] = obj;

		ajaxObj.row = obj;

		ajaxObj.data = "text=" + encodeURIComponent(ajaxObj.parts[ajaxObj.row]);

		/**
		 * Добавить параметры проверки
		 */
		ajaxObj.data += "&options=" + aceHelpers.yandex.speller.getSpellerOptionsSum();


		/**
		 * Язык(и) проверки
		 */
		ajaxObj.data += "&lang=ru,en";

		if (POST)
		{
			params.text =

			ajaxWithSwal(params);
		}
		else
		{
			/**
			 * Сохранённый ответ для тестов
			 */
			var testResponse = eval( '([{"code":1,"pos":248,"row":16,"col":44,"len":8,"word":"\u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0442","s":["\u0430\u0442\u0440\u0438\u0431\u0443\u0442"]},{"code":3,"pos":325,"row":23,"col":3,"len":6,"word":"\u041f\u0420\u0430\u0432\u0434\u0430","s":["\u041f\u0440\u0430\u0432\u0434\u0430"]},{"code":1,"pos":359,"row":27,"col":3,"len":21,"word":"\u042d\u043a\u0432\u0430\u043d\u0438\u0437\u0438\u0437\u0430\u0442\u043e\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435","s":[]},{"code":1,"pos":417,"row":31,"col":16,"len":5,"word":"memos","s":["mamas","memo"]},{"code":2,"pos":547,"row":39,"col":13,"len":2,"word":"\u043d\u0430","s":[]},{"code":1,"pos":571,"row":41,"col":10,"len":7,"word":"\u0430\u0448\u0438\u0431\u043a\u043e\u0439","s":["\u043e\u0448\u0438\u0431\u043a\u043e\u0439"]}])' );


			if (!button.partsMisspells)
				aceHelpers.yandex.speller.setMarkersByResponse(testResponse ,'0' ,button);
			/**
			 * Если сохранены ошибки
			 */
			else
			{
				for (var row in button.partsMisspells)
				{
					if (!button.partsMisspells.hasOwnProperty(row))
						continue;

					aceHelpers.yandex.speller.setMarkersByResponse(button.partsMisspells[row] ,row ,button);
				}
			}
		}
	}


	/**
	 * Если нет ошибок, то запомнить текст и указать, что проверка выключена
	 */
	if (button.markers.length == 0)
		button.text = text;

	return false;
};


aceHelpers.yandex.speller.removeMarks = function (button)
{
	button.status = false;

	/**
	 * Очистить сохранённое количество ошибок
	 */
	button.misspells = {};

	var session = button.editor.getSession();

	/**
	 * Убрать отметка на поле номеров строк
	 */
	if (button.decoredGutters)
		for (var d = 0; d < button.decoredGutters.length; d++)
		{
			session.removeGutterDecoration(button.decoredGutters[d][0] ,button.decoredGutters[d][1]);
		}

	/**
	 * Очистить сохранённые значения об отметках
	 */
	button.decoredGutters = [];


	/**
	 * Убрать Все выделения
	 */
	if ( button.markers )
		for ( var m = 0 ; m < button.markers.length ; m++ )
		{
			session.removeMarker( button.markers[m] );
		}

	button.markers = [];

};




/**
 * @param {Array} responseArray массив с объектами описывающими ошибки
 *
 * @param {int|String} nowRow строка начала отсчёта (если несколько частей по 10 тыс символов)
 *
 * @param {HTMLButtonElement} button массив хранящий параметры запросов
 */
aceHelpers.yandex.speller.setMarkersByResponse = function (responseArray ,nowRow ,button)
{
	var mistakes = aceHelpers.yandex.speller.getMarksClasses();

	var session = ace.edit(button.editor).getSession();

	var Range = ace.require('ace/range').Range;

	var strike = nowRow.match(/(\d+)(?:(?::)(\d+))?/);

	var startRow = +strike[1];

	var startCol = 0;
	if (strike[2])
		startCol = +strike[2];

	/**
	 * Перебор переданных в ответе значений
	 */
	for (var r = 0; r < responseArray.length; r++)
	{
		var values = responseArray[r];

		var code = values.code;

		var index = --code;

		/**
		 * Если не нулевая строка, то сбросить значение смещения в строке
		 */
		if (startCol && values.row)
			startCol = 0;

		/** Строка + строка обрабатываемой части */
		var row = +values.row + startRow;


		/** Начальная позиция в строке */
		var col = +values.col + startCol;


		/** Создать диапазон */
		var end = col + +values.len;


		/** Позиция завершения выделения */
		var range = new Range(row ,col ,row ,end);



		/** Запомнить параметры выделения */
		button.decoredGutters.push([row ,mistakes[index]]);

		/** Добавить выделения на нумерации строк */
		session.addGutterDecoration(row ,mistakes[index]);


		/**
		 * Добавить выделения в текст
		 */
		button.markers[button.markers.length]
			= session.addMarker(range ,mistakes[index] ,function() { alert("test ya speller in object"); } ,false);


		button.markers[button.markers.length].onclick = function() {
			alert("test ya for object")
		};


		/**
		 * Записать данные об ошибке
		 */
		if (!button.misspells[row])
			button.misspells[row] = [];

		button.misspells[row][button.misspells[row].length]
			= [range ,mistakes[index] ,values.s ,button.markers[button.markers.length]];
	}
};



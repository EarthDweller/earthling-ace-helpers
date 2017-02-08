/**
 * Created by PhpStorm.
 *
 * @file functions.js
 *
 * Дополнительные методы для объекта редактора
 *
 * @author Соловейчик Тимофей <timofey@1september.ru>/<T-Soloveychik@ya.ru>
 *
 * @date 2017-02-04 08:59:59
 *
 * @copyright 1september 2017
 */


var aceHelpers = window.aceHelpers || {};

/**
 * @description Обернуть в строчный HTML тег выделенный фрагмент текста
 *
 * @param {ace} editor строка с названием тега в который будет обёрнут выделенный текст, строчные теги - http://www.w3schools.com/tags/ref_byfunc.asp
 */
aceHelpers.addFunctions = function(editor) {

	editor.addLineTag = function (tag)
	{

		var selections = this.getSelection().getAllRanges()
			, selectedTex
			, text
			, startTags = []
			, attributes
			, obj;

		// Если НЕ указано название тега, то предложить окно для ввода названия:
		if ( !arguments.length || !tag.trim() )
			{
				// Запросить url
				tag = window.prompt(
					"Укажите название строчного HTML тега "
					+ "\n"
					+ "http://www.w3schools.com/tags/ref_byfunc.asp"
					+ "\n"
					+ "address cite code del kbd mark meter pre progress span s(strike) sub sup wbr" );

				if ( !tag )
					return false;

				tag = tag.trim();
			}

		var tagEnd = "</" + tag + ">";


		/**
		 * Отправить запрос на указание значения
		 *
		 * @param {string} text
		 *
		 * @param {string|false} [value]
		 */
		function promptToSetValue ( text , value ) {
			var prom = window.prompt( text , value );

			if ( prom )
				return prom;

			return false;
		}

		// Проверка, является ли значение числом, если нет, ещё раз показать окно ввода значения:
		function isNumber ( value ) {
			if ( isNaN( Number( value ) ) )
				{
					return promptToSetValue( "Укажите значение цифрами" );
				}

			return Number( value );
		}

		/**
		 * Перебор всех выделенных фрагментов
		 */
		for ( var s = 0 ; s < selections.length ; s++ )
			{
				startTags[s] = "<" + tag + ">";

				selectedTex = this.getSession().getDocument().getTextRange( selections[s] );

				// Если добавление ссылки:
				if ( tag == "a" )
					{
						var href = "http://";

						if ( selectedTex )
							href = selectedTex;

						// Запросить url
						href = promptToSetValue( "Укажите адрес" , href );

						if ( !href )
							return false;

						href = ' href="' + href + '"';

						startTags[s] = "<" + tag + href + ">";
					}

				// Если добавление meter:
				if ( tag == "meter" )
					{
						attributes = {
							value : "Укажите значение цифрами дробное (0.5) или от максимального" , min : "Укажите нижнее значение цифрами" , max : "Укажите максимальное значение цифрами"
						};

						for ( obj in attributes )
							{
								if ( !attributes.hasOwnProperty( obj ) )
									continue;

								attributes[obj] = isNumber( window.prompt( attributes[obj] ) );
							}

						// Переписать открывающий тег:
						startTags[s] = "<" + tag + attributes.min + attributes.max + attributes.value + ">";
					}

				// Если добавление progress:
				if ( tag == "progress" )
					{
						attributes = {
							max : "Укажите максимальное значение цифрами" , value : "Укажите значение цифрами от максимального"
						};

						for ( obj in attributes )
							{
								if ( !attributes.hasOwnProperty( obj ) )
									continue;

								attributes[obj] = isNumber( window.prompt( attributes[obj] ) );
							}

						// Переписать открывающий тег:
						startTags[s] = "<" + tag + attributes.max + attributes.value + ">";
					}

				// Если добавление wbr - убрать закрывающий тег:
				if ( tag == "wbr" )
					tagEnd = "";

				text = startTags[s] + selectedTex + tagEnd;


				// Заменить текст:
				this.session.replace( selections[s] , text );

			}

		this.focus();

		return false;
	};




	editor.addBlockTag = function (tag)
	{

		var
			tab = this.getSession().getTabString()
			, tabSize = this.getSession().getTabSize()
			// На сколько строк выше поднять курсор:
			, rows = null
			, leadingTabs = ''

			, EOL = this.getSession().getDocument().getNewLineCharacter()
			, selections = this.getSelection().getAllRanges()
			, selectedTex
			, selectionPos
			, text
			, insert = false
			, startTags = [];

		var replaceBeforeSet = function ( text ) {

			text = text.replace( /\v/g , "\t" );
			var replRegExp = new RegExp( "( {1," + tabSize + "}(?![^\t])|\t+ {1," + tabSize + "}| {2,})" , "mg" );
			text = text.replace( replRegExp , tab );

			return text;
		};

		// Если НЕ указано название тега, то предложить окно для ввода названия:
		if ( !arguments.length || !tag.trim() )
			{
				// Запросить url
				tag = window.prompt(
					"Укажите название строчного HTML тега "
					+ "\n"
					+ "http://www.w3schools.com/tags/ref_byfunc.asp"
					+ "\n"
					+ "address cite code del kbd mark meter pre progress span s(strike) sub sup wbr" );

				if ( !tag )
					return false;

				tag = tag.trim();
			}

		/**
		 * Перебор всех выделенных фрагментов
		 */
		for ( var s = selections.length - 1 ; s >= 0 ; s-- )
			{
				selectedTex = this.getSession().getDocument().getTextRange( selections[s] );

				startTags[s] = "<" + (
					tag == "li" ? (
					tag + ' style="margin-top: 1em;"'
					) : tag
				) + ">";

				var tagEnd = "</" + tag + ">";

				// Если ничего не выделено:
				if ( selectedTex == "" )
					{
						selectionPos = selections[s].start;
						selectionPos.column = 0;

						// Выделить все строку и сохранить для замены:

						text = this.getSession().getDocument().getLine( selections[s].start.row );

						console.log( 'text: ' + (
							text
						) );

						// Отступ перед началом теста:
						leadingTabs = text.match( /^\s*/ );

						/**
						 * Убрать в начале строки все отступы
						 */
						text = text.replace( leadingTabs , "" );

						// Выбранная строка - тег:
						var textTags = new RegExp( "<(\/?)([^\s]+)[^>]*>" );

						// Проверить и сохранить результат:
						var match = text.match( textTags );

						// Если есть тег и он блочный, то...:
						if ( match && match.length <= 3 && ["div" , "p" , "table" , "tr" , "td" , "ol" , "ul" , "li"].indexOf( match[2] ) != -1 )
							{
								/**
								 * Если закрывающий тег, то блок ниже
								 */
								if ( match[1] == "/" )
									{
										selectionPos.row = selectionPos.row + 2;
										this.getSession().getDocument().insertNewLine( selectionPos );
										this.getSession().getDocument().insertNewLine( selectionPos );
									}
								else
									{
										this.getSession().getDocument().insertNewLine( selectionPos );
										this.getSession().getDocument().insertNewLine( selectionPos );
									}

								text = "";

								insert = true;
							}

						/**
						 * Если добавляется блок списка
						 */
						if ( ["ol" , "ul"].indexOf( tag ) !== -1 )
							{
								text = ""
									   + leadingTabs + startTags[s]
									   + EOL + leadingTabs + tab + '<li style="margin-top: 1em;">'
									   + EOL + leadingTabs + tab + tab + text
									   + EOL + leadingTabs + tab + "</li>"
									   + EOL + leadingTabs + tagEnd;
								rows = 4;
							}
						/**
						 * Другие блочные тег
						 */
						else
							{
								text = ""
									   + leadingTabs + startTags[s]
									   + EOL + leadingTabs + tab + text
									   + EOL + leadingTabs + tagEnd;
								rows = 2;
							}


						/**
						 * Добавить текст
						 */
						if ( insert )
							this.getSession().getDocument().insert( selectionPos , text );
						else
							selections[s].end.column = this.getSession().getDocument().getLine( selections[s].start.row ).length;

					}
				// Если есть выделенный фрагмент:
				else
					{
						text = replaceBeforeSet( selectedTex );

						// Если выбрана пустая строка, то заменить её на отступ:
						if ( /^\s$/.test( text ) )
							{
								text = tab;
							}

						// Строка начала выделения:
						var start = selections[s].start.row;
						// Строка завершения выделения:
						var end = selections[s].end.row;

						/**
						 * Поробовать в фрагменте найти начальные отступы
						 */
						while ( start <= end )
							{
								// Взять всю строку:
								var lineText = this.getSession().getDocument().getLine( start );

								/**
								 * Если найдены предстрочные отступы
								 */
								if ( leadingTabs = lineText.match( /^\s+/mg ) )
									break;

								else leadingTabs = [""];
								start++;
							}



						// Убрать переносы строк из отступа строки:
						leadingTabs = leadingTabs[0].replace(EOL ,"");


						if ( ["ol" , "ul"].indexOf( tag ) !== -1 )
							{
								// Без пустых строк:
								text = text.replace(new RegExp(EOL + "{2}" ,"gm") ,EOL);
								// Убрать отступы в начале:
								text = text.replace( /^\s+/gm , "" );

								// Каждую строку в list:
								text = text.replace( /(^.+$)/gm ,
									EOL + '<li style="margin-top: 1em;">'
									+ EOL + tab + "$1"
									+ EOL + "</li>"
									+ EOL );
								// Добавить leadingTabs не пустым строкам:
								text = text.replace( /^(?=.+$)/gm , leadingTabs + tab );

								// Собрать весть текст:
								text = EOL
									   + leadingTabs + startTags[s]
									   + EOL
									   + text
									   + EOL
									   + leadingTabs + tagEnd;

								rows = 0;
							}
						else
							{
								/** К каждой новой строке добавить <br> */
								if ( ["p"].indexOf( tag ) !== -1 )
									{
										/**
										 * Добавить отступы br
										 *
										 * Если br, то заменить
										 */
										text = text.replace( /(\s*(<br ?\/?>)?(\s*))?\n(?!\s*(<br ?\/?>))/mig , EOL + leadingTabs + "<br>" + "\n$3" );
									}

								text = leadingTabs + text;

								text = EOL
									   + leadingTabs + startTags[s]
									   + EOL + text.replace( /^/mg , tab )
									   + EOL + leadingTabs + tagEnd;

								rows = 1;
							}


					}

				// Заменить текст:
				if ( !insert )
					this.getSession().replace( selections[s] , text );

				var row = selections[s].start.row + rows;

				// Переместить курсор к концу строки:
				this.gotoLine( row , this.getSession().getDocumentLastRowColumn( row ) , true );
			}

		// Вернуться к редактору:
		this.focus();

		return false;
	};
};

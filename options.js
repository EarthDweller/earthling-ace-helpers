/**
 * Created by PhpStorm.
 *
 * @file
 *
 * Описание
 *
 * @author Соловейчик Тимофей <timofey@1september.ru>/<T-Soloveychik@ya.ru>
 *
 * @date 2017-02-03 4:02
 *
 * @copyright 1september 2017
 */

var aceHelpers = window.aceHelpers || {};

// Параметры для ACE редактора:
aceHelpers.getOptions = function()
{
	return {
		  mode: "ace/mode/html"
		, minLines: 1
		, maxLines: 350
		, fontSize: 16
		, theme: aceHelpers.getTheme()
		, newLineMode: "unix"
		, highlightSelectedWord: true
		, highlightActiveLine: false
		, readOnly: false
		, showInvisibles: true
		, tabSize: 2
		, useSoftTabs: false
		, showPrintMargin: false
		//,wrapBehavioursEnabled: false
		, wrap: "free"

		// Проверять код:
		, useWorker: true
		, wrapBehavioursEnabled: true
		, enableBasicAutocompletion: true
		, enableLiveAutocompletion: true
		, enableSnippets: true
		, animatedScroll: true
	};
};


// Цвета редактора:
aceHelpers.getTheme = function()
{
	var aceTheme = "ace/theme/chrome";

	if (window.localStorage && localStorage.getItem("ace-helpers-theme"))
		aceTheme = localStorage.getItem("ace-helpers-theme");

	return aceTheme;
};


// Опции для типов:
aceHelpers.getOptionForType = function(type)
{
	switch (type) {
		case "uri":
		case "url":
			return {
				  theme: "ace/theme/chaos"
				, mode: "ace/mode/mask"
				, highlightGutterLine: false
			};
			break;

		case "email":
				return {
					  theme: "ace/theme/vibrant_ink"
					, mode: "ace/mode/mask"
					, highlightGutterLine: false
				};
			break;


		case "line":
				return {
					  mode: "ace/mode/jack"
					, highlightGutterLine: false
				};
			break;

		default:
			swal("Ошибка","Неверно указано значением аргуменат запрашиваемого стиля: «" + String(type) + "»!")
	}
};

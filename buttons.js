/**
 * Created by PhpStorm.
 *
 * @file
 *
 * Описание
 *
 * @author Соловейчик Тимофей <timofey@1september.ru>/<T-Soloveychik@ya.ru>
 *
 * @date 2017-02-03 18:09:34
 *
 * @copyright 1september 2017
 */

var aceHelpers = window.aceHelpers || {};

aceHelpers.buttons = {
	speller: {
		  class: "ace-helpers-button-yandex-spell"
		, function: 'aceHelpers.yandex.speller.buttonSend'
		, arguments: '(this)'
		, fa: "fa-check-circle-o"
		, title: "Alt + S — Отправить на проверку в Яндекс.Спеллер текст или выделенный фрагмент(ы)"
		, keybind: function(editor) {
			editor.commands.addCommand({
				name   : "yandex-speller-selected/all" ,
				bindKey: {
					win: "Alt-S" ,
					mac: "Alt-S"
				} ,
				exec   : function(editor) {
					editor.buttons["speller"].trigger("click")
				}
			});
		}
	}
	,
	typograph: {
		  class: "ace-helpers-button-typograph"
		, function: 'aceHelpers.typographer'
		, arguments: '(this)'
		, fa: "fa-text-width"
		, title: "Alt + Shift + T — Поправить типографику текста или выделенного фрагмента(ов)"
		, keybind: function(editor) {
			editor.commands.addCommand({
				name   : "typograph-selected/all" ,
				bindKey: {
					win: "Alt-Shift-t" ,
					mac: "Alt-Shift-t"
				} ,
				exec   : function(editor) {
					editor.buttons["typograph"].trigger("click")
				}
			});
		}
	}
	,
	nobr: {
		  class: "ace-helpers-button-nobr"
		, function: 'this.editor.replaceSpacesToNobrs'
		, arguments: '()'
		, fa: "fa-stop"
		, title: "Alt + N — Заменить все пробелы в тексте или выделенном фрагменте(ах) на неразрывные пробелы"
		, keybind: function(editor) {
			editor.commands.addCommand({
				name   : "spaces-to-nobr-for-selected/all" ,
				bindKey: {
					win: "Alt-N" ,
					mac: "Alt-N"
				} ,
				exec   : function(editor) {
					editor.buttons["nobr"].trigger("click")
				}
			});
		}
	}
	,
	"nobr-tag": {
		  class: "ace-helpers-button-nobr-tag"
		, function: 'this.editor.addLineTag'
		, arguments: '(\'nobr\')'
		, fa: "fa-code"
		, title: "Alt + Shift + N — Обернуть текст или выделенный фрагмент(ы) в тег <nobr>"
		, keybind: function(editor) {
			editor.commands.addCommand({
				name   : "wrap-to-nobr-tag-selected/all" ,
				bindKey: {
					win: "Alt-Shift-N" ,
					mac: "Alt-Shift-N"
				} ,
				exec   : function(editor) {
					editor.buttons["nobr-tag"].trigger("click")
				}
			});
		}
	}
};

aceHelpers.addButtons = function ($field)
{
	$field.addClass("already-with-buttons");

	var editor = $field.data("editor");

	var $block = $field.data("aceHelpers").$block;

	var $buttonsBlock = $("<div class='ace-helpers-buttons'></div>");

	$block.append($buttonsBlock);

	var id = aceHelpers.getIdForField($field);

	var requestButtons = $field.data("ace-buttons").split(/\s*,\s*/);

	var buttons = {};
	if (requestButtons)
	{
		for (var i in requestButtons)
		{
			buttons[requestButtons[i]] = aceHelpers.buttons[requestButtons[i]];
		}
	}

	if ($field.data("ace-buttons-all"))
		buttons = aceHelpers.buttons;

	if (!buttons)
		return;

	editor.buttons = {};

	var button;
	for (var buttonName in buttons)
	{
		if (!buttons[buttonName])
			continue;

		button = buttons[buttonName];

		$button = $('<button type="button" class="ace-helpers-button ' + button.class + '" title="' + button.title + '" onclick="' + button.function+ button.arguments + '"><i class="fa ' + button.fa + ' fa-fw"></i></button>');

		$button.css("cursor" ,"pointer");

		$button
			.prop("editor" ,editor)
			.data("editor" ,editor);

		editor.buttons[buttonName] = $button;

		if (button.keybind)
			button.keybind(editor);

		$buttonsBlock.append($button);
	}
};

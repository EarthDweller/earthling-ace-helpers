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
		, fa: "fa-check-circle-o"
		, title: "Alt + S — Отправить на проверку в Яндекс.Спеллер текст или выделенный фрагмент(ы)"
	}
	,
	typograph: {
		  class: "ace-helpers-button-typograph"
		, function: 'aceHelpers.typographer'
		, fa: "fa-text-width"
		, title: "Alt + T — Поправить типографику текста или выделенного фрагмента (ов).Спеллер текст или выделенный фрагмент(ы)"
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

	var buttons = [];
	if (requestButtons)
	{
		for (var i in requestButtons)
		{
			buttons.push(aceHelpers.buttons[requestButtons[i]]);
		}
	}

	if ($field.data("ace-buttons-all"))
		buttons = aceHelpers.buttons;

	if (!buttons)
		return;

	var button;
	for (var buttonName in buttons)
	{
		if (!buttons[buttonName])
			continue;

		button = buttons[buttonName];

		$button = $('<button type="button" class="' + button.class + '" title="' + button.title + '" onclick="' + button.function + '(this)"><i class="fa ' + button.fa + ' fa-fw"></i></button>');

		$button.css("cursor" ,"pointer");

		$button
			.prop("editor" ,editor)
			.data("editor" ,editor);

		$buttonsBlock.append($button);
	}
};

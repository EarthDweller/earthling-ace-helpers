/**
 * Created by PhpStorm.
 *
 * @file
 *
 * Описание
 *
 * @author Соловейчик Тимофей <timofey@1september.ru>/<T-Soloveychik@ya.ru>
 *
 * @date 2017-02-02 19:21
 *
 * @copyright 1september 2017
 */

var aceHelpers = window.aceHelpers || {};

aceHelpers.replaceFields = function (block)
{
	$(block)
		.find("[data-ace]")
		.not("[data-ace=false]")
		.not(".already-with-ace")
		.addClass("already-with-ace")
		.each(function (){

			field = $(this);

			id = field.attr("id");

			if (id)
				webinarFields[id] = field;

			var textareaForAce = $("<textarea></textarea>");

			textareaForAce.val(field.val());

			var div = $("<div></div>");

			if (field.data("ace-width"))
				div.css("max-width" ,field.data("ace-width"));

			field.after(div);

			div.append(textareaForAce);

			aceEditor = ace.edit(textareaForAce.get(0));

			var pre = $(aceEditor.container);

			var placeholder = field.attr("placeholder");
			if (!placeholder)
				placeholder = field.parent().text().trim();

			var node = aceEditor.renderer.emptyMessageNode = document.createElement("div");
			node.textContent = placeholder;
			node.className = "ace_invisible ace_emptyMessage";

			if (field.is(":text"))
				node.style.paddingLeft = "1em";
			else
				node.style.padding = "1em 1em";

			aceEditor.renderer.scroller.appendChild(node);

			aceEditor.on("input", acePlaceHolder);

			if (aceEditor.session.getValue().trim())
				node.style.display = "none";

			(function (aceEditor ,field){
				aceEditor.on("change", function(changes ,editor) {
					field.val(editor.getValue());
				});
			})(aceEditor ,field);

			if (id)
				webinarAceFields[id] = aceEditor;

			field.prop("hidden" ,"hidden");

			field.prev("br").remove();

			if (window.aceHelpersGeneralOptions)
				aceEditor.setOptions(window.aceHelpersGeneralOptions);

			if (field.is(":text"))
				aceEditor.setOption("showGutter" ,false);
			else
				aceEditor.setOption("minLines" ,3);

			if (field.data("ace-mode"))
				aceEditor.setOption("mode" ,"ace/mode/" + field.data("ace-mode"));

			if (field.data("button-spell") == false && field.data("button-typo") == false)
				return;

			yaButton = $('<button type="button" class="webinar-yandex-spell-button" title="Отправить текст на проверку в Яндекс.Спеллер"><i class="fa fa-check-circle-o"></i></button>');

			yaButton.data("title" ,id);
			yaButton.css("cursor" ,"pointer");

			typographButton = $('<button type="button" class="webinar-typograph" title="Поправить типографику текста"><i class="fa fa-text-width"></i></button>');

			typographButton.data("title" ,id);

			if (field.data("button-spell") == false)
				yaButton = null;

			if (field.data("button-typo") == false)
				typographButton = null;

			pre
				.before(yaButton)
				.before(typographButton)
			;

			if (yaButton)
				yaButton
					.prop("editor" ,aceEditor)
					.data("editor" ,aceEditor);

			if (typographButton)
				typographButton
					.prop("editor" ,aceEditor)
					.data("editor" ,aceEditor);

		});
};

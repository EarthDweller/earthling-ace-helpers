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

aceHelpers.fields = {};


aceHelpers.addPlaceHolder = function (editor ,placeholder ,line)
{
	var node = editor.renderer.emptyMessageNode = document.createElement("div");
	node.textContent = placeholder;
	node.className = "ace_invisible ace_emptyMessage";

	if (line)
		node.style.paddingLeft = "3em";
	else
		node.style.padding = "1em 1em";

	editor.renderer.scroller.appendChild(node);

	if (editor.getSession().getValue().trim())
		node.style.display = "none";

	return node;
};


aceHelpers.showHidePlaceHolder = function (changes ,editor)
{
	var shouldShow = editor.session.getValue().trim();
	var node = editor.renderer.emptyMessageNode;
	if (shouldShow) {
		if (node.style.display != "none")
			node.style.display = "none";
	} else if (node.style.display == "none") {
		node.style.display = "block";
	}
};



aceHelpers.getIdForField = function ($field)
{
	id = $field.attr("id");

	var placeholder = aceHelpers.getPlaceholderForField($field);

	if (!id)
	{
		if (placeholder && !aceHelpers.fields[placeholder])
			id = placeholder;

		else if ($field.attr("name") && !aceHelpers.fields[$field.attr("name")])
			id = $field.attr("name");

		else
		{
			id = 0;
			while (aceHelpers.fields[id])
				id++;
		}
	}

	return id;
};



aceHelpers.getPlaceholderForField = function ($field)
{
	var placeholder = $field.attr("placeholder");
	if (!placeholder)
		placeholder = $field.parent().text().trim();

	return placeholder;
};



aceHelpers.replaceFields = function (block)
{
	$(block)
		.find("[data-ace]")
		.not("[data-ace=false]")
		.not(".already-with-ace")
		.addClass("already-with-ace")
		.each(function (){

			var $field = $(this);

			id = aceHelpers.getIdForField($field);

			var textAreaForAce = $("<textarea></textarea>");

			var $div = $("<div></div>");

			$div.addClass("ace-helpers-block");

			if ($field.data("ace-width"))
				$div.css("max-width" ,$field.data("ace-width"));

			$field.after($div);

			$div.append(textAreaForAce);



			var editor = ace.edit(textAreaForAce.get(0));

			aceHelpers.fields[id] = {
				  $field: $field
				, $block: $div
				, editor: editor
			};

			editor.renderer.setStyle("ace-helpers-editor");

			var document = ace.createEditSession($field.val() ,"ace/mode/twig");

			editor.setSession(document);



			$field.css("display" ,"none");

			$field
				.prop("editor" ,editor)
				.data("editor" ,editor)

				.prop("aceHelpers" ,aceHelpers.fields[id])
				.data("aceHelpers" ,aceHelpers.fields[id]);



			var placeholder = aceHelpers.getPlaceholderForField($field);
			if (!placeholder)
				placeholder = id;

			$div.attr("title" ,placeholder);

			aceHelpers.addPlaceHolder(editor ,placeholder ,$field.data("ace") == "line");



			if (aceHelpers.addFunctions)
				aceHelpers.addFunctions(editor);

			if (aceHelpers.addKeyBindings)
				aceHelpers.addKeyBindings(editor);



			editor.on("input" ,aceHelpers.showHidePlaceHolder);

			(function (editor ,field){
				editor.on("change", function(changes ,editor) {
					field.val(editor.getValue());
				});
			})(editor ,$field);




			if (aceHelpers.getOptions)
				editor.setOptions(aceHelpers.getOptions());

			if ($field.data("ace") == "line")
				editor.setOption("showGutter" ,false);
			else
				editor.setOption("minLines" ,3);

			if ($field.data("ace-type"))
				editor.setOptions(aceHelpers.getOptionForType($field.data("ace-type")));

			if ($field.data("ace-mode"))
				editor.setOption("mode" ,"ace/mode/" + $field.data("ace-mode"));

			if ($field.data("ace-readonly"))
				editor.setOption("readOnly" ,true);

			if ($field.data("ace-gutter") == false)
				editor.setOption("showGutter" ,false);

			if ($field.data("ace-select-all"))
				editor.getSelection().on("changeCursor" ,function(event ,selection) {
					selection.selectAll();
				});

			if ($field.data("buttons-all") || $field.data("ace-buttons"))
				aceHelpers.addButtons($field);
		});
};

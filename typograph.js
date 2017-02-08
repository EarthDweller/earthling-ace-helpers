/**
 * Created by PhpStorm.
 *
 * @file
 *
 * Описание
 *
 * @author Соловейчик Тимофей <timofey@1september.ru>/<T-Soloveychik@ya.ru>
 *
 * @date 2017-02-06 9:48
 *
 * @copyright 1september 2017
 */

var aceHelpers = window.aceHelpers || {};

aceHelpers.typographer = function(button) {

	var editor = button.editor;

	var selections = editor.getSession().getSelection();
	var ranges = selections.getAllRanges();

	var data = [];
	for (var i = 0; i < ranges.length; i++)
	{
		textRange = editor.getSession().getDocument().getTextRange(ranges[i]).trim();
		if (textRange)
			data[i] = {
				  text: textRange
				, range: i
			};
	}

	if (data.length == 0 && editor.getValue().trim())
		data[0] = {
			  text: editor.getValue()
			, range: -1
		};

	if (data.length == 0)
		return;

	var params = {
		  data: {texts: data}
		, faElem: $(button).find("i")
		, url: aceHelpers.typographerURL
		, onSuccess: function(response) {
			if (response.texts)
			{
				for (var i in response.texts)
				{
					if (response.texts[i].range !== -1)
						editor.getSession().getDocument().replace(ranges[i] ,response.texts[i].text);
					else
						editor.setValue(response.texts[i].text);
				}
			}

			editor.focus();
		}
	};

	$(button).ajaxWithSwal(params);
};

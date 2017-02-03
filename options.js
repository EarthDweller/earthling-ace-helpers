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
aceHelpers.getOptions = function() {

	return {
		  mode: "ace/mode/html"
		, minLines: 1
		, maxLines: 350
		, fontSize: 16
		, theme: aceTheme
		, newLineMode: "unix"
		, highlightSelectedWord: true
		, highlightSelectedLine: false
		, readOnly: false
		, showInvisibles: true
		, tabSize: 2
		, useSoftTabs: false
		//,wrapBehavioursEnabled: false
		, wrap: "free"

		, useWorker: false
		, wrapBehavioursEnabled: true
		, enableBasicAutocompletion: true
		, enableLiveAutocompletion: true
		, enableSnippets: true
		, animatedScroll: true
	};
};

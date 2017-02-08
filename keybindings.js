/**
 * Created by PhpStorm.
 *
 * @file keybindings.js
 *
 * Методы установки для редактора событий по нажатию сочетания клавиш
 *
 * @author Соловейчик Тимофей <timofey@1september.ru>/<T-Soloveychik@ya.ru>
 *
 * @date 2017-02-04 07:59:21
 *
 * @copyright 1september 2017
 */

var aceHelpers = window.aceHelpers || {};

aceHelpers.addKeyBindings = function(editor) {

/*
	// Сохранить
	editor.commands.addCommand({
		name: "save",
		bindKey: {win: "Ctrl-s", mac: "Command-s"},
		exec: function(editor) {
			saveFunction()
		}
	});

	editor.commands.addCommand({
		name: "execute",
		bindKey: "ctrl+enter",
		exec: function(editor) {
			try
				{
					var r = window.eval(editor.getCopyText() || editor.getValue());
				}
			catch(e) { r = e; }

			editor.cmdLine.setValue(r + "");
		}
	});

	cmdLine.commands.bindKeys({
		"Shift-Return|Ctrl-Return|Alt-Return": function(cmdLine) { cmdLine.insert("\n"); },
		"Esc|Shift-Esc": function(cmdLine){ cmdLine.editor.focus(); },
		"Return": function(cmdLine){
			var command = cmdLine.getValue().split(/\s+/);
			var editor = cmdLine.editor;
			editor.commands.exec(command[0], editor, command[1]);
			editor.focus();
		}
	});

	cmdLine.commands.removeCommands(["find", "gotoline", "findall", "replace", "replaceall"]);
*/


	// Типограф
	editor.commands.addCommand({
		name   : "typograph-selected/all" ,
		bindKey: {
			win: "Alt-Shift-t" ,
			mac: "Alt-Shift-t"
		} ,
		exec   : function(editor) {
			aceTipografButton.click()
		}
	});

	// Menu
	editor.commands.addCommand({
		name   : "show-menu" ,
		bindKey: {
			win: "Ctrl-Alt-m" ,
			mac: "Command-Alt-m"
		} ,
		exec   : function(editor) {
			if (editor.showSettingsMenu)
				editor.showSettingsMenu();
			else
				ace.config.loadModule("ace/ext/settings_menu", function(module) {
					module.init(editor);
					editor.showKeyboardShortcuts()
				});
		}
	});

	// add command to lazy-load keybinding_menu extension
	editor.commands.addCommand({
		name   : "show-keyboard-shortcuts" ,
		bindKey: {
			win: "Ctrl-Alt-h" ,
			mac: "Command-Alt-h"
		} ,
		exec   : function(editor) {
			if (editor.showKeyboardShortcuts)
				editor.showKeyboardShortcuts();
			else
				ace.config.loadModule("ace/ext/keybinding_menu", function(module) {
					module.init(editor);
					editor.showKeyboardShortcuts()
				});
		}
	});

	// Ctrl+Alt+P – скрыть/отобразить непечатные
	editor.commands.addCommand({
		name   : "show/hide-invisibles" ,
		bindKey: {
			win: "Ctrl-Alt-p" ,
			mac: "Command-Alt-p"
		} ,
		exec   : function(editor) {
			editor.setShowInvisibles(!editor.getShowInvisibles());
		}
	});

	// // Alt-r - ReadOnly
	// editor.commands.addCommand({
	// 	name   : "read-only" ,
	// 	bindKey: {
	// 		win: "Alt-r" ,
	// 		mac: "Alt-r"
	// 	} ,
	// 	exec   : function(editor) {
	// 		editor.setReadOnly(!editor.getReadOnly());
	// 	}
	// });

	// Alt-a - link
	editor.commands.addCommand({
		name   : "wrap-text-by-link" ,
		bindKey: {
			win: "Alt-a" ,
			mac: "Alt-a"
		} ,
		exec   : function(editor) {
			editor.addLineTag('a');
		}
	});

	// Alt-b - boild
	editor.commands.addCommand({
		name   : "wrap-text-by-bold" ,
		bindKey: {
			win: "Alt-b" ,
			mac: "Alt-b"
		} ,
		exec   : function(editor) {
			editor.addLineTag('b');
			return false;
		}
	});

	// Alt-b - italic
	editor.commands.addCommand({
		name   : "wrap-text-by-italic" ,
		bindKey: {
			win: "Alt-i" ,
			mac: "Alt-i"
		} ,
		exec   : function(editor) {
			editor.addLineTag('i');
		}
	});

	// Alt-t - inline Tag
	editor.commands.addCommand({
		name   : "wrap-or-add-to-text-by-inline-tag" ,
		bindKey: {
			win: "Alt-t" ,
			mac: "Alt-t"
		} ,
		exec   : function(editor) {
			editor.addLineTag();
		}
	});

	// Alt-u - underline
	editor.commands.addCommand({
		name   : "wrap-text-by-underline" ,
		bindKey: {
			win: "Alt-u" ,
			mac: "Alt-u"
		} ,
		exec   : function(editor) {
			editor.addLineTag('u');
		}
	});

	// Alt-p - paragraph
	editor.commands.addCommand({
		name   : "wrap-text-by-paragraph-line/selected" ,
		bindKey: {
			win: "Alt-p" ,
			mac: "Alt-p"
		} ,
		exec   : function(editor) {
			editor.addBlockTag('p');
		}
	});

	// Alt-div - Division
	editor.commands.addCommand({
		name   : "wrap-text-by-division-line/selected" ,
		bindKey: {
			win: "Alt-d" ,
			mac: "Alt-d"
		} ,
		exec   : function(editor) {
			editor.addBlockTag('div');
		}
	});

	// Alt-Shift-u - UnOrderedList
	editor.commands.addCommand({
		name   : "wrap-text-by-unordered-list-selected" ,
		bindKey: {
			win: "Alt-Shift-u" ,
			mac: "Alt-Shift-u"
		} ,
		exec   : function(editor) {
			addBlockTag('ul');
		}
	});

	// Alt-Shift-o - OrderedList
	editor.commands.addCommand({
		name   : "wrap-text-by-ordered-list-selected" ,
		bindKey: {
			win: "Alt-Shift-o" ,
			mac: "Alt-Shift-o"
		} ,
		exec   : function(editor) {
			editor.addBlockTag('ol');
		}
	});

	// Alt-l - List - li
	editor.commands.addCommand({
		name   : "wrap-text-by-list-line/selected-lines" ,
		bindKey: {
			win: "Alt-l" ,
			mac: "Alt-l"
		} ,
		exec   : function(editor) {
			editor.addBlockTag('li');
		}
	});

	// Esc - fullWindowMode
	editor.commands.addCommand({
		name   : "full-window-mode" ,
		bindKey: {
			win: "Esc" ,
			mac: "Esc"
		} ,
		exec   : function(editor) {
			editor.fullWindowMode();
		}
	});
};

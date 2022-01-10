<?php

class BoardFlipperHook
{
	/**
	 * @param  OutputPage  $out
	 * @param  Skin  $skin
	 * @return bool
	 */
	public static function onBeforePageDisplay(OutputPage $out, Skin $skin)
	{
		global $wgScriptPath;
		$out->addScriptFile("${wgScriptPath}/extensions/BoardFlipper/board-flipper.user.js");
		return true;
	}
}

global $wgVersion;
if (version_compare($wgVersion, '1.25', '<')) {
	$wgHooks['BeforePageDisplay'][] = 'BoardFlipperHook::onBeforePageDisplay';
}

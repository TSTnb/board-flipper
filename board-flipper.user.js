/* Copyright 2022 TSTman
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// ==UserScript==
// @name         HD Wiki Board Flipper
// @namespace    HD Wiki Board Flipper
// @license      Apache 2.0
// @version      v0.0.6
// @description  Buttons to flip the stacking boards on the Hard Drop wiki
// @homepage     https://github.com/TSTman/board-flipper
// @author       TSTman
// @match        https://harddrop.com/wiki/*
// @match        https://harddrop.com/w/index.php*
// @grant        none
// @run-at       document-start
// ==/UserScript==
(() => {
	if (['complete', 'loaded', 'interactive'].indexOf(document.readyState) !== -1) {
		boardFlipper();
	} else {
		document.addEventListener('DOMContentLoaded', boardFlipper);
	}

	function boardFlipper() {
		'use strict';

		document.addEventListener('keydown', (event) => event.key === 'f' && flipBoard());
	}
})();
var isBoardFlipped = false;

const minoMap = [
	{
		"initial": {"alt": "L", "src": "https://cdn.harddrop.com/5/51/LTet.png"},
		"flipped": {"alt": "J", "src": "https://cdn.harddrop.com/8/85/JTet.png"}
	}, // L <=> J
	{
		"initial": {"alt": "S", "src": "https://cdn.harddrop.com/b/bc/STet.png"},
		"flipped": {"alt": "Z", "src": "https://cdn.harddrop.com/c/c6/ZTet.png"}
	}, // S <=> Z

	{
		"initial": {"alt": "LL", "src": "https://cdn.harddrop.com/8/87/LLTet.png"},
		"flipped": {"alt": "LJ", "src": "https://cdn.harddrop.com/8/83/LJTet.png"}
	}, // LL <=> LJ
	{
		"initial": {"alt": "LS", "src": "https://cdn.harddrop.com/a/ad/LSTet.png"},
		"flipped": {"alt": "LZ", "src": "https://cdn.harddrop.com/7/79/LZTet.png"}
	}, // LS <=> LZ

	{
		"initial": {"alt": "'L", "src": "https://cdn.harddrop.com/2/25/'LTet.png"},
		"flipped": {"alt": "'J", "src": "https://cdn.harddrop.com/2/28/'JTet.png"}
	}, // 'L <=> 'J
	{
		"initial": {"alt": "'S", "src": "https://cdn.harddrop.com/0/02/'STet.png"},
		"flipped": {"alt": "'Z", "src": "https://cdn.harddrop.com/4/40/'ZTet.png"}
	}, // 'S <=> 'Z

	{
		"initial": {"alt": "-L", "src": "https://cdn.harddrop.com/a/ae/-LTet.png"},
		"flipped": {"alt": "-J", "src": "https://cdn.harddrop.com/f/f3/-JTet.png"}
	}, // -L <=> -J
	{
		"initial": {"alt": "-S", "src": "https://cdn.harddrop.com/7/72/-STet.png"},
		"flipped": {"alt": "-Z", "src": "https://cdn.harddrop.com/6/67/-ZTet.png"}
	}, // -S <=> -Z

	{
		"initial": {"alt": "+L", "src": "https://cdn.harddrop.com/4/4c/+LTet.png"},
		"flipped": {"alt": "+J", "src": "https://cdn.harddrop.com/8/8e/+JTet.png"}
	}, // +L <=> +J
	{
		"initial": {"alt": "+S", "src": "https://cdn.harddrop.com/9/9c/+STet.png"},
		"flipped": {"alt": "+Z", "src": "https://cdn.harddrop.com/9/9d/+ZTet.png"}
	}, // +S <=> +Z

	{
		"initial": {"alt": "!S", "src": "https://cdn.harddrop.com/b/b1/!STet.png"},
		"flipped": {"alt": "!Z", "src": "https://cdn.harddrop.com/2/29/!ZTet.png"}
	}, // !S <=> !Z

	{
		"initial": {"alt": "SL", "src": "https://cdn.harddrop.com/7/71/SLTet.png"},
		"flipped": {"alt": "SJ", "src": "https://cdn.harddrop.com/e/e7/SJTet.png"}
	}, // SL <=> SJ
	{
		"initial": {"alt": "SS", "src": "https://cdn.harddrop.com/0/00/SSTet.png"},
		"flipped": {"alt": "SZ", "src": "https://cdn.harddrop.com/2/28/SZTet.png"}
	}, // SS <=> SZ
];

function flipBoard() {
	let scope = document.body;

	const pattern = `:scope div > ${Array(10).fill('img[width="12"][height="12"][src^="https://"][src$=".png"]').join(' + ')}`;
	const toUpperCase = String.prototype.toUpperCase.apply.bind(String.prototype.toUpperCase);

	[...scope.querySelectorAll(pattern)]
		.map(t => t.parentElement)
		.forEach(row => {
			const children = [...row.childNodes].reverse();

			children.forEach(img => {
				if (!(img instanceof HTMLImageElement)) {
					return;
				}

				let sourceAlt = toUpperCase(String(img.alt))
				const minoMappingResult = minoMap.find(
					t => t.initial.alt == sourceAlt || t.flipped.alt == sourceAlt);

				if (!(minoMappingResult instanceof Object)) {
					return;
				}

				const properties = minoMappingResult.initial.alt == sourceAlt
					? minoMappingResult.flipped
					: minoMappingResult.initial;

				img.alt = properties.alt;
				img.src = properties.src;
				img.title = properties.alt;
			});

			children.forEach(child => row.appendChild(child));
			isBoardFlipped = !isBoardFlipped;
		});
}

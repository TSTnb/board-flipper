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
// @version      v0.0.0
// @description  Buttons to flip the stacking boards on the Hard Drop wiki
// @homepage     https://github.com/TSTman/board-flipper
// @author       TSTman
// @match        https://harddrop.com/wiki/*
// @grant        none
// ==/UserScript==
(() => {
    'use strict';

    addFlipButtons();

    function addFlipButtons() {
        document.addEventListener('keydown', (event) => event.key === 'f' && flipBoard());
        const navigationMenu = document.querySelector('div#gumax-p-navigation > ul#gumax-nav');
        const flipLink = document.createElement('a');
        flipLink.textContent = 'Flip boards';
        flipLink.href = 'javascript:';
        flipLink.alt = 'Shortcut: f';
        flipLink.addEventListener('click', flipBoard);
        navigationMenu.appendChild(document.createElement('li')).appendChild(flipLink);

        const pattern = `:scope > tbody > tr > td > div > ${Array(8).fill('a.image[href^="/wiki/File:"][href$="Tet.png"]').join(' + ')}`;
        const boardTables = [...document.querySelectorAll('table')].filter(element => element.querySelector(pattern));
        boardTables.forEach(boardTable => {
                const flipButton = document.createElement('button');
                flipButton.textContent = 'Flip';
                flipButton.class = 'mw-htmlform-submit flip-button';
                flipButton.addEventListener('click', () => flipBoard(flipButton));
                boardTable.appendChild(flipButton);
            }
        );
    }

    const minoProperties = {
        "Tet.png": {"reverse": "Tet.png", "attributes": {"a": {"title": "", "href": "/wiki/File:Tet.png"}, "img": {"alt": "Tet.png", "src": "/w/images/1/18/Tet.png"}}},
        "J": {"reverse": "L", "attributes": {"a": {"title": "J", "href": "/wiki/File:JTet.png"}, "img": {"alt": "J", "src": "/w/images/8/85/JTet.png"}}},
        "i": {"reverse": "i", "attributes": {"a": {"title": "i", "href": "/wiki/File:ITet.png"}, "img": {"alt": "i", "src": "/w/images/1/19/ITet.png"}}},
        "Z": {"reverse": "S", "attributes": {"a": {"title": "Z", "href": "/wiki/File:ZTet.png"}, "img": {"alt": "Z", "src": "/w/images/c/c6/ZTet.png"}}},
        "S": {"reverse": "Z", "attributes": {"a": {"title": "S", "href": "/wiki/File:STet.png"}, "img": {"alt": "S", "src": "/w/images/b/bc/STet.png"}}},
        "L": {"reverse": "J", "attributes": {"a": {"title": "L", "href": "/wiki/File:LTet.png"}, "img": {"alt": "L", "src": "/w/images/5/51/LTet.png"}}},
        "O": {"reverse": "O", "attributes": {"a": {"title": "O", "href": "/wiki/File:OTet.png"}, "img": {"alt": "O", "src": "/w/images/2/20/OTet.png"}}},
        "T": {"reverse": "T", "attributes": {"a": {"title": "T", "href": "/wiki/File:TTet.png"}, "img": {"alt": "T", "src": "/w/images/2/20/TTet.png"}}},
        "G": {"reverse": "G", "attributes": {"a": {"title": "G", "href": "/wiki/File:GTet.png"}, "img": {"alt": "G", "src": "/w/images/8/88/GTet.png"}}},
        "I": {"reverse": "I", "attributes": {"a": {"title": "I", "href": "/wiki/File:ITet.png"}, "img": {"alt": "I", "src": "/w/images/1/19/ITet.png"}}},
    };

    function flipBoard(button) {
        let scope;
        if (button instanceof HTMLElement) {
            scope = button.closest('table');
        } else {
            scope = document.body;
        }
        const pattern = `:scope div > ${Array(8).fill('a.image[href^="/wiki/File:"][href$="Tet.png"]').join(' + ')}`;
        [...scope.querySelectorAll(pattern)].map(el => el.parentElement).forEach(row => {
            const children = [...row.childNodes].reverse();
            children.forEach(anchor => {
                const elements = {
                    a: anchor,
                    img: anchor.querySelector(':scope > img'),
                };
                const properties = minoProperties[minoProperties[elements.img.alt].reverse];
                Object.keys(elements).forEach(tag =>
                    Object.keys(properties.attributes[tag]).forEach(attribute =>
                        elements[tag].setAttribute(attribute, properties.attributes[tag][attribute])
                    ))
            });
            children.forEach(child => row.appendChild(child));
        });
    }
})();

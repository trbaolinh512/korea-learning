// Composition and decomposition algorithms copied from the supplied v6 HTML.
// The v6 input handler does not invoke convertQwertyToHangul; retain that behavior.
import data from './data/typing.json';
const qwertyJamoMap: Record<string,string> = data.qwertyJamoMap;

export function convertQwertyToHangul(str: string): string {
            let hasEnglish = /[a-zA-Z]/.test(str);
            if (!hasEnglish) return str;

            let jamos = [];
            for (let char of str) {
                if (qwertyJamoMap[char]) {
                    jamos.push(qwertyJamoMap[char]);
                } else {
                    jamos.push(char);
                }
            }

            const CHOSUNG = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
            const JOONGSUNG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
            const JONGSUNG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

            const JOONGSUNG_COMBINE: Record<string,string> = {
                'ㅗㅏ': 'ㅘ', 'ㅗㅐ': 'ㅙ', 'ㅗㅣ': 'ㅚ',
                'ㅜㅓ': 'ㅝ', 'ㅜㅔ': 'ㅞ', 'ㅜㅣ': 'ㅟ',
                'ㅡㅣ': 'ㅢ'
            };

            const JONGSUNG_COMBINE: Record<string,string> = {
                'ㄱㅅ': 'ㄳ', 'ㄴㅈ': 'ㄵ', 'ㄴㅎ': 'ㄶ', 'ㄹㄱ': 'ㄺ',
                'ㄹㅁ': 'ㄻ', 'ㄹㅂ': 'ㄼ', 'ㄹㅅ': 'ㄽ', 'ㄹㄾ': 'ㄾ',
                'ㄹㅍ': 'ㄿ', 'ㄹㅎ': 'ㅀ', 'ㅂㅅ': 'ㅄ'
            };

            let result = '';
            let L = 0;
            while (L < jamos.length) {
                let c1 = jamos[L];
                let choIdx = CHOSUNG.indexOf(c1);

                if (choIdx !== -1 && L + 1 < jamos.length && JOONGSUNG.indexOf(jamos[L + 1]) !== -1) {
                    let cho = choIdx;
                    let jungStr = jamos[L + 1];
                    L += 2;

                    if (L < jamos.length && JOONGSUNG_COMBINE[jungStr + jamos[L]]) {
                        jungStr = JOONGSUNG_COMBINE[jungStr + jamos[L]];
                        L++;
                    }
                    let jung = JOONGSUNG.indexOf(jungStr);

                    let jong = 0;
                    if (L < jamos.length) {
                        let c3 = jamos[L];
                        let jongIdx = JONGSUNG.indexOf(c3);

                        if (jongIdx !== -1) {
                            let nextJamo = jamos[L + 1];
                            let nextNextJamo = jamos[L + 2];
                            
                            let isNextIsVowel = nextJamo && JOONGSUNG.indexOf(nextJamo) !== -1;
                            let isAfterNextIsVowel = nextNextJamo && JOONGSUNG.indexOf(nextNextJamo) !== -1;

                            let canBeBatchim = false;
                            if (isNextIsVowel) {
                                canBeBatchim = true;
                            } else if (nextJamo && CHOSUNG.indexOf(nextJamo) !== -1 && isAfterNextIsVowel) {
                                canBeBatchim = true;
                            } else if (!nextJamo) {
                                canBeBatchim = true;
                            }

                            if (canBeBatchim) {
                                let jongStr = c3;
                                L++;
                                if (L < jamos.length && JONGSUNG.indexOf(jamos[L]) !== -1) {
                                    let nextC = jamos[L];
                                    let afterNextC = jamos[L + 1];
                                    if (JONGSUNG_COMBINE[jongStr + nextC] && (!afterNextC || JOONGSUNG.indexOf(afterNextC) === -1)) {
                                        jongStr = JONGSUNG_COMBINE[jongStr + nextC];
                                        L++;
                                    }
                                }
                                jong = JONGSUNG.indexOf(jongStr);
                            }
                        }
                    }

                    let syllableCode = 0xAC00 + (cho * 588) + (jung * 28) + jong;
                    result += String.fromCharCode(syllableCode);
                } else {
                    result += c1;
                    L++;
                }
            }

            return result;
        }

export function decomposeSentenceToJamos(str: string): string[] {
            let res = [];
            for (let i = 0; i < str.length; i++) {
                const jamos = decomposeKoreanChar(str[i]);
                res.push(...jamos);
            }
            return res;
        }

        export function decomposeKoreanChar(char: string): string[] {
            const code = char.charCodeAt(0);
            if (code >= 0xAC00 && code <= 0xD7A3) {
                const offset = code - 0xAC00;
                const initialConsonants = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
                const vowels = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
                const finalConsonants = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

                const initialIndex = Math.floor(offset / 588);
                const vowelIndex = Math.floor((offset % 588) / 28);
                const finalIndex = offset % 28;

                const res = [initialConsonants[initialIndex], vowels[vowelIndex]];
                if (finalIndex > 0) res.push(finalConsonants[finalIndex]);
                return res;
            }
            return [char];
        }

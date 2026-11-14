const consonants: Record<string, string> = {
  'ㄱ':'그','ㄴ':'느','ㄷ':'드','ㄹ':'르','ㅁ':'므','ㅂ':'브','ㅅ':'스','ㅇ':'으','ㅈ':'즈','ㅊ':'츠','ㅋ':'크','ㅌ':'트','ㅍ':'프','ㅎ':'흐','ㄲ':'끄','ㄸ':'뜨','ㅃ':'쁘','ㅆ':'쓰','ㅉ':'쯔',
};
/** Pronounce isolated consonants with ㅡ (ư); words and sentences retain their original text. */
export function speakKorean(text: string): string {
  if (!('speechSynthesis' in window)) return 'Trình duyệt chưa hỗ trợ đọc văn bản.';
  const voice = speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('ko'));
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(consonants[text] || text);
  utterance.lang = 'ko-KR'; utterance.rate = 0.8;
  if (voice) utterance.voice = voice;
  speechSynthesis.speak(utterance);
  return voice ? '' : 'Chưa tìm thấy giọng Hàn. Hãy cài giọng Korean trong hệ điều hành.';
}

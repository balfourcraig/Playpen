const vowels = ['A', 'E', 'I', 'O', 'U', 'Y'];
const isVowel = (c) => vowels.includes(c);
const endsInVowel = (s) => isVowel(s[s.length-1]);